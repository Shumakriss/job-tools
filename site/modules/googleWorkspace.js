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
// Manages the gapi and google.auth libraries to obtain user consent, authorize and execute requests to google API's

    constructor (model, gapi, google) {
        console.debug("GoogleWorkspace.constructor");
        this.model = model;   // TODO: Eliminate model
        this.gapi = gapi;
        this.google = google;

        this.tokenClient = null;

        this.apiInitCallback;
        this.clientInitCallback;
        this.tokenClientCallback;
        this.authenticatedCallback;

        if (this.model.googleToken) {    // TODO: Can be passed
            this.init();
        }
    }

    async init() {
        console.debug("GoogleWorkspace.init - Initializing Google Drive Class");

        // Error handling for improper page load or recovery
        if (!this.model.googleApiKey) {
            console.log("GoogleWorkspace.init - Skipping due to missing API Key");
            return;
        }

        if (!this.model.googleClientId) {
            console.log("GoogleWorkspace.init - Skipping due to missing Client Id");
            return;
        }
        if (!this.gapi) {
            console.warn("Gapi is not initialized");
            return;
        }

        // Tell GAPI to load the API client object and give it a handler for when it's done
        // Note: A loaded client is not ready until it's also initialized via its 'init()' method and supplied a token
        await this.gapi.load('client',  async () => {
            console.log("GoogleWorkspace.init:gapi.load callback");
            await this.onGapiLoaded();
            });
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
        // Invoked when GAPI is done loading the client

        console.debug("GoogleWorkspace.onGapiLoaded - Invoked");

        if (!this.gapi) {
            throw new Error("Gapi is not loaded");
        }
        this.isApiReady = true;

        // Invoke any external callbacks to this class
        if (this.apiInitCallback) {
            console.log("API callback invoked");
            this.apiInitCallback();
        } else {
            console.log("No Api Init callback to invoke");
        }

        // Initialize the gapi client and invoke any external callbacks
        await this.gapi.client.init({
            apiKey: this.model.googleApiKey,
            discoveryDocs: [DRIVE_DISCOVERY_DOC, SHEETS_DISCOVERY_DOC, DOCS_DISCOVERY_DOC]
            });
        console.debug("GoogleWorkspace.onGapiLoaded - gapi.client.init returned: ", this.gapi.client);
        if (this.clientInitCallback){
            console.log("Client init invoked");
            this.clientInitCallback();
        } else {
            console.log("No client init callback to be invoked");
        }

        // Reuse a saved token and invoke external callback
        if (this.model.googleToken) {
            console.debug("GoogleWorkspace.onGapiLoaded - Found token, will reuse");
            this.gapi.client.setToken(this.model.googleToken);
            if (this.authenticatedCallback) {
                console.log("Authenticated callback invoked");
                this.authenticatedCallback();
            } else {
                console.log("No authenticated callback to be invoked");
            }
        }

        // Initialize the token client for getting new tokens anyway (we usually need a refresh)
        this.tokenClient = await this.google.accounts.oauth2.initTokenClient({
            client_id: this.model.googleClientId,
            scope: SCOPES,
            callback: '', // defined later
        });

        console.debug("GoogleWorkspace.onGapiLoaded - Done initializing tokenClient");

        // Tell google tokenClient what to do when its read
        this.tokenClient.callback = async (resp) => {
            console.debug("GoogleWorkspace.onGapiLoaded - tokenClient callback");
            if (resp.error !== undefined) {
                throw (resp);
            }

            // Displays a prompt to the user in a popup window requesting the user to approve/deny the application scopes
            // Alternatively, skip this if already done.
            console.debug("Token client callback invoked");
            if (this.consentRequested) {
                this.tokenClient.requestAccessToken({prompt: ''});
            } else {
                this.tokenClient.requestAccessToken({prompt: 'consent'});
            }

            // Save the refreshed token(?)
            this.model.googleToken = await this.gapi.client.getToken();
            this.model.save();

            // Handle external callbacks
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


    async authorize() {
        // Useful when user needs a refreshed token
        console.debug("GoogleWorkspace.authorize - Authorizing Google Drive client");

        if (this.model.googleConsentRequested) {
            console.debug("Consent to Google previously given, only refreshing");
            this.tokenClient.requestAccessToken({prompt: ''});
        } else {
            console.debug("Consent to Google not previously given, loading consent screen");
            this.tokenClient.requestAccessToken({prompt: 'consent'});
            this.model.googleConsentRequested = true;
        }

        this.model.googleToken = await this.gapi.client.getToken();
        this.model.save();
    }


    setToken(token) {
        if (!token || typeof token != "object") {
            throw new Error("Invalid token");
        }

        console.debug("Set token invoked");
        this.model.googleToken = token;
        this.model.save();
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
        this.model.googleConsentRequested = false;
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
        // Creates the required payload for google API to do a batch text merge
        let requests = [];

        const templateUpdate = new Map();
        templateUpdate.set("{{job-title}}", this.model.jobTitle);

            templateUpdate.set("{{date}}", this.model.date);
            templateUpdate.set("{{company-name}}", this.model.companyName);
            templateUpdate.set("{{company-name-possessive}}", this.model.companyNamePossessive);
            templateUpdate.set("{{company-address}}", this.model.companyAddress);
            templateUpdate.set("{{hiring-manager-name}}", this.model.hiringManager);
            templateUpdate.set("{{complete-job-title}}", this.model.completeJobTitle);
            templateUpdate.set("{{short-job-title}}", this.model.shortJobTitle);
            templateUpdate.set("{{values}}", this.model.companyValues);
            templateUpdate.set("{{experiences}}", this.model.relevantExperience);

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

    async appendApplicationLog() {
        // Add an entry to a Google Sheet
        // Google Sheets guesses where the last row is based on the range supplied
        let values = [[ this.model.companyName, "Applied", this.model.date ]];
        let rowData = {
                spreadsheetId: this.model.googleSheetId,
                range: "Sheet1!A1:D1",
                valueInputOption: "USER_ENTERED",
                resource: {
                    values: values,
                },
            }
        await this.gapi.client.sheets.spreadsheets.values.append(rowData);
    }

    async getCompanyCorrespondence(companyName) {
        // Find any rows where first column matches the parameter
        let request = {
            spreadsheetId: this.model.googleSheetId,
            range: "Sheet1!A:D"
        }

        let response = await this.gapi.client.sheets.spreadsheets.values.get(request);

        let rows = response['result']['values'];

        let filteredCells = [];

        for (let i=0; i< rows.length; i++) {
            let cells = rows[i];
            for (let j=0; j<cells.length; j++) {
                if (cells[j] == companyName) {
                    filteredCells.push(cells);
                }
            }
        }
        return filteredCells;
    }

}

export default GoogleWorkspace;