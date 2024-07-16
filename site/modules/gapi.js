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

class GoogleApi {

    constructor () {
        this.apiKey;
        this.clientId;
        this.token;
        this.consentRequested = false;
        this.tokenClient = null;
        this.apiInitCallback;
        this.clientInitCallback;
        this.tokenClientCallback;
        this.authenticatedCallback;
    }

    setToken() {
        console.log("setToken");
    }

    isReady() {
        return gapi && gapi.client && gapi.client.getToken();
    }

    isSignInReady() {
        return gapi && gapi.client && !gapi.client.getToken();
    }

    isSignOutReady() {
        return gapi && gapi.client && gapi.client.getToken();
    }

    isRefreshReady() {
        return gapi && gapi.client && this.consentRequested && gapi.client.getToken();
    }

    async onGapiLoaded() {
        console.debug("onGapiLoaded");
        this.isApiReady = true;
        this.apiInitCallback();

        await gapi.client.init({
            apiKey: this.apiKey,
            discoveryDocs: [DRIVE_DISCOVERY_DOC, SHEETS_DISCOVERY_DOC, DOCS_DISCOVERY_DOC]
            });

        this.clientInitCallback();

        if (this.token) {
            console.debug("Reusing token");
            gapi.client.setToken(this.token);
            this.authenticatedCallback();
        }

        this.tokenClient = await google.accounts.oauth2.initTokenClient({
            client_id: this.clientId,
            scope: SCOPES,
            callback: '', // defined later
        });
        console.debug("Done initializing tokenClient");

        this.tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                throw (resp);
            }
            console.debug("Token client callback invoked");
            if (this.consentRequested) {
                this.tokenClient.requestAccessToken({prompt: ''});
            } else {
                this.tokenClient.requestAccessToken({prompt: 'consent'});
            }

            this.token = await gapi.client.getToken();

            this.authenticatedCallback();
            this.tokenClientCallback();
        };

    }

    init() {
        console.debug("Initializing Google Drive Class");
        if (!this.apiKey) {
            console.warn("Missing API Key");
            return;
        }

        if (!this.clientId) {
            console.warn("Missing Client Id");
            return;
        }

        gapi.load('client',  () => {this.onGapiLoaded()});
    }

    async authorize() {
        console.debug("Authorizing Google Drive client");

        if (this.consentRequested) {
            console.debug("Consent to Google previously given, only refreshing");
            this.tokenClient.requestAccessToken({prompt: ''});
        } else {
            console.debug("Consent to Google previously given, loading consent screen");
            this.tokenClient.requestAccessToken({prompt: 'consent'});
            this.consentRequested = true;
        }
    }

    load(googleApi) {
        this.clientId = googleApi.clientId;
        this.apiKey = googleApi.apiKey;
        this.token = googleApi.token;
        this.consentRequested = googleApi.consentRequested;
    }

    setToken(token) {
        console.debug("Set token invoked");
        this.token = token;
        this.authenticatedCallback();
    }

    signOut() {
        google.accounts.oauth2.revoke(gapi.client.getToken().access_token);
        gapi.client.setToken('');
        this.consentRequested = false;
    }
}

