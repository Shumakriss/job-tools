/*
* This file provide useful functions for interacting with files in Google Drive.
*/

// Discovery doc URL for APIs
// Don't forget to add scopes where necessary
const DRIVE_DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SHEETS_DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const DOCS_DISCOVERY_DOC = 'https://docs.googleapis.com/$discovery/rest?version=v1';


// Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
// Don't forget your Discovery Doc Url
const SCOPES = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/documents';

class GoogleWorkspace {

    constructor (view, gapi, google) {
        console.debug("GoogleWorkspace.constructor");
        this.view = view;   // TODO: Eliminate view
        this.gapi = gapi;
        this.google = google;

        this.tokenClient = null;

        this.apiInitCallback;
        this.clientInitCallback;
        this.tokenClientCallback;
        this.authenticatedCallback;

        if (this.view.googleToken) {    // TODO: Can be passed
            this.init();
        }
    }

    setApiInitCallback(callback) {
        if (callback && typeof callback === 'function' ) {
            this.apiInitCallback = callback;
        }
    }

    setClientInitCallback(callback) {
        if (callback && typeof callback === 'function' ) {
            this.clientInitCallback = callback;
        }
    }

    setTokenClient(tokenClient) {
        this.tokenClient = tokenClient;
    }

    setTokenClientCallback(callback) {
        if (callback && typeof callback === 'function' ) {
            this.tokenClientCallback = callback;
        }
    }

    setAuthenticatedCallback(callback) {
        if (callback && typeof callback === 'function' ) {
            this.authenticatedCallback = callback;
        }
    }

    async onGapiLoaded() {
        console.debug("GoogleWorkspace.onGapiLoaded - Invoked");
        if (!this.gapi) {
            throw new Error("Gapi is not loaded");
        }
        this.isApiReady = true;

        if (this.apiInitCallback) {
            console.log("API callback invoked");
            this.apiInitCallback();
        } else {
            console.log("No Api Init callback to invoke");
        }

        await this.gapi.client.init({
            apiKey: this.view.googleApiKey,
            discoveryDocs: [DRIVE_DISCOVERY_DOC, SHEETS_DISCOVERY_DOC, DOCS_DISCOVERY_DOC]
            });
        console.debug("GoogleWorkspace.onGapiLoaded - gapi.client.init returned: ", this.gapi.client);
        if (this.clientInitCallback){
            console.log("Client init invoked");
            this.clientInitCallback();
        } else {
            console.log("No client init callback to be invoked");
        }

        if (this.view.googleToken) {
            console.debug("GoogleWorkspace.onGapiLoaded - Found token, will reuse");
            this.gapi.client.setToken(this.view.googleToken);
            if (this.authenticatedCallback) {
                console.log("Authenticated callback invoked");
                this.authenticatedCallback();
            } else {
                console.log("No authenticated callback to be invoked");
            }
        }

        this.tokenClient = await this.google.accounts.oauth2.initTokenClient({
            client_id: this.view.googleClientId,
            scope: SCOPES,
            callback: '', // defined later
        });

        console.debug("GoogleWorkspace.onGapiLoaded - Done initializing tokenClient");

        this.tokenClient.callback = async (resp) => {
            console.debug("GoogleWorkspace.onGapiLoaded - tokenClient callback");
            if (resp.error !== undefined) {
                throw (resp);
            }
            console.debug("Token client callback invoked");
            if (this.consentRequested) {
                this.tokenClient.requestAccessToken({prompt: ''});
            } else {
                this.tokenClient.requestAccessToken({prompt: 'consent'});
            }

            this.view.googleToken = await this.gapi.client.getToken();
            this.view.save();

            if (this.authenticatedCallback) {
                console.log("Authenticated callback invoked");
                this.authenticatedCallback();
            } else {
                console.log("No authenticated callback to be invoked");
            }

            if (this.tokenClientCallback) {
                console.log("No token client callback invoked");
                this.tokenClientCallback();
            } else {
                console.log("No token client callback to be invoked");
            }
        };
    }

    async init() {
        console.debug("GoogleWorkspace.init - Initializing Google Drive Class");
        if (!this.view.googleApiKey) {
            console.log("GoogleWorkspace.init - Skipping due to missing API Key");
            return;
        }

        if (!this.view.googleClientId) {
            console.log("GoogleWorkspace.init - Skipping due to missing Client Id");
            return;
        }
        if (!this.gapi) {

            console.warn("Gapi is not initialized");
            return;
        }

        await this.gapi.load('client',  async () => {
            console.log("GoogleWorkspace.init:gapi.load callback");
            await this.onGapiLoaded();
            });
    }

    async authorize() {
        console.debug("GoogleWorkspace.authorize - Authorizing Google Drive client");

        if (this.view.googleConsentRequested) {
            console.debug("Consent to Google previously given, only refreshing");
            this.tokenClient.requestAccessToken({prompt: ''});
        } else {
            console.debug("Consent to Google not previously given, loading consent screen");
            this.tokenClient.requestAccessToken({prompt: 'consent'});
            this.view.googleConsentRequested = true;
        }

        this.view.googleToken = await this.gapi.client.getToken();
        this.view.save();
    }


    setToken(token) {
        if (!token || typeof token != "object") {
            throw new Error("Invalid token");
        }

        console.debug("Set token invoked");
        this.view.googleToken = token;
        this.view.save();
        if (this.authenticatedCallback) {
            this.authenticatedCallback();
        }
    }

    signOut() {
        if (!this.gapi || !this.gapi.client || !this.google || !this.google.accounts || !this.google.accounts.oauth){
            throw new Error("Google API is not ready to perform a signout.");
        }
        this.google.accounts.oauth2.revoke(this.gapi.client.getToken().access_token);
        this.gapi.client.setToken('');
        this.view.googleConsentRequested = false;
    }

    async getDocumentIdByName(name) {
        console.info("Getting doc ID for name: ", name);

        let files;

        let response;
        try {
            response = await this.gapi.client.drive.files.list({
                'q': 'name = \'' + name + '\'',
                'pageSize': 5,
                'fields': 'nextPageToken, files(id, name)',
            });
        } catch (err) {
            console.log(err.message);
            return;
        }

        files = response.result.files;
        if (!files || files.length == 0) {
            console.log("No files found for name: " + name);
            return;
        }

        if (files.length == 1) {
            console.log("Query returned single doc ID: ", files[0].id);
            return files[0].id;
        } else {
            console.log("Too many document ID's with name: ", name);
            for (let i = 0; i < files.length; i++) {
                console.log(files[i].id, ": ", files[i].name);
            }
            console.log("Try deleting duplicates and check your trash.");
            return;
        }

    }

    async copyFile(fileId, fileName) {
        console.log("Copying file ID: " + fileId);

        let response;
        try {
          response = await this.gapi.client.drive.files.copy({
            'fileId': fileId
          });
        } catch (err) {
          console.log(err.message);
          return;
        }

        let newFileId = response.result.id;
        console.log("Copied " + fileId + " to " + newFileId);
        console.log("Renaming " + newFileId + " to " + fileName);
        try {
          response = await this.gapi.client.drive.files.update({
            'fileId': newFileId,
            'resource': { 'name': fileName, 'capabilities': {'canDownload': true}}
          });
          return newFileId;
          console.log(response);
        } catch (err) {
          console.log(err.message);
          return;
        }
    }

    /*
    *
    * Valid Export Types: https://developers.google.com/drive/api/guides/ref-export-formats
    * Google Docs native format (vnd.google-apps.document) is not supported for download
    */
    async getPlaintextFileContents(fileId) {
        console.log("Getting plaintext file contents: " + fileId);

        try {
            // This only works on Google Docs formatted files!
            const response = await this.gapi.client.drive.files.export({
                fileId: fileId,
                mimeType: 'text/plain'
            });
            return response.body;
        } catch (err) {
            console.log(err.message);
        throw err;
        }
    }

    async getPdfLink(fileId) {
        try {
            // This only works on Google Docs formatted files!
            const response = await gapi.client.drive.files.get({
                fileId: fileId,
                fields: 'exportLinks'
            });
            let file = JSON.parse(response.body);
            return file.exportLinks['application/pdf'];
        } catch (err) {
            console.error("Encountered error retrieving PDF link: " + err.message);
            return "";
        }
    }

    createTemplateRequests() {
        let requests = [];

        const templateUpdate = new Map();
        templateUpdate.set("{{job-title}}", this.view.jobTitle);

            templateUpdate.set("{{date}}", this.view.date);
            templateUpdate.set("{{company-name}}", this.view.companyName);
            templateUpdate.set("{{company-name-possessive}}", this.view.companyNamePossessive);
            templateUpdate.set("{{company-address}}", this.view.companyAddress);
            templateUpdate.set("{{hiring-manager-name}}", this.view.hiringManager);
            templateUpdate.set("{{complete-job-title}}", this.view.completeJobTitle);
            templateUpdate.set("{{short-job-title}}", this.view.shortJobTitle);
            templateUpdate.set("{{values}}", this.view.values);
            templateUpdate.set("{{experiences}}", this.view.relevantExperience);

        [...templateUpdate.keys()].forEach(placeholder => {
            let request = {
                replaceAllText: {
                    containsText: {
                        text: placeholder,
                        matchCase: true,
                    },
                    replaceText: templateUpdate.get(placeholder),
                }
            }
            requests.push(request);
        })

        return requests;
    }

    async mergeTextInTemplate(docId) {
        let requests = this.createTemplateRequests();
        let requestPayload = {
            documentId: docId,
            resource: {
                requests
            }
        };

        let errorHandler = (err, {data}) => {
            console.error("Error in mergeTextInTemplate: " + err.message);
            console.error(data);
        }

        await this.gapi.client.docs.documents.batchUpdate(requestPayload, errorHandler);
    }

    // TODO: Move to controller?
    async createResume() {
        this.view.resumeTemplateId = await this.getDocumentIdByName(this.view.resumeTemplateName);
        this.view.resumeId = await this.getDocumentIdByName(this.view.resumeName);

        if (this.view.resumeTemplateId && !this.view.resumeId) {
            this.view.resumeId = await this.copyFile(this.view.resumeTemplateId, this.view.resumeName);
        }
        this.view.save();
    }

    async createCoverLetter() {
        this.view.coverLetterTemplateId = await this.getDocumentIdByName(this.view.coverLetterTemplateName);
        this.view.coverLetterId = await this.getDocumentIdByName(this.view.coverLetterName);

        if (this.view.coverLetterTemplateId && !this.view.coverLetterId) {
            this.view.coverLetterId = await this.copyFile(this.view.coverLetterTemplateId, this.view.coverLetterName);
        }
        this.view.save();
    }

    async createResumeAndCoverLetter() {
        await this.createResume();
        await this.createCoverLetter();
    }
}

export default GoogleWorkspace;