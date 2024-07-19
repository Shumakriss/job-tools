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

class GapiWrapper {

    constructor () {
//        if (!gapi) {
//            throw new Error("GoogleApiWrapper.constructor - Cannot initialize without gapi object");
//        }
//
//        if (!google) {
//            throw new Error("GoogleApiWrapper.constructor - Cannot initialize without google object");
//        }

        this.gapi;
        this.google;
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

    static createFromObject(jsonObject) {
        if (!jsonObject) {
            throw new Error("Object to load was undefined");
        }
        if (typeof jsonObject != 'object') {
            throw new Error("Object to load not an object");
        }
        try {
            let temp = new GapiWrapper();

            // Do the deep copy
            temp.apiKey = jsonObject.apiKey;
            temp.clientId = jsonObject.clientId;
            temp.consentRequested = jsonObject.consentRequested;
            temp.token = jsonObject.token;

            return temp;
        } catch(err) {
            throw new Error("Encountered issue during deep-copy. Error: " + err.message, { cause: err })
        }
    }

   async setGapi(gapi) {
        this.gapi = gapi;
    }

    async setGoogle(google) {
        this.google = google;
    }

    async setApiKey(apiKey) {
        console.log("GapiWrapper.setApiKey");
        this.apiKey = apiKey;
    }

    async setClientId(clientId) {
        console.log("GapiWrapper.setClientId");
        this.clientId = clientId;
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

    async isReady() {
        return this.gapi && this.gapi.client && await this.gapi.client.getToken();
    }

    async isSignInReady() {
        return this.gapi && this.gapi.client && !await this.gapi.client.getToken();
    }

    async isSignOutReady() {
        return this.gapi && this.gapi.client && await this.gapi.client.getToken();
    }

    async isRefreshReady() {
        return this.gapi && this.gapi.client && this.consentRequested && await this.gapi.client.getToken();
    }

    async onGapiLoaded() {
        console.debug("GapiWrapper.onGapiLoaded - Invoked");
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
            apiKey: this.apiKey,
            discoveryDocs: [DRIVE_DISCOVERY_DOC, SHEETS_DISCOVERY_DOC, DOCS_DISCOVERY_DOC]
            });
        console.debug("GapiWrapper.onGapiLoaded - gapi.client.init returned: ", this.gapi.client);
        if (this.clientInitCallback){
            console.log("Client init invoked");
            this.clientInitCallback();
        } else {
            console.log("No client init callback to be invoked");
        }

        if (this.token) {
            console.debug("GapiWrapper.onGapiLoaded - Found token, will reuse");
            this.gapi.client.setToken(this.token);
            if (this.authenticatedCallback) {
                console.log("Authenticated callback invoked");
                this.authenticatedCallback();
            } else {
                console.log("No authenticated callback to be invoked");
            }
        }

        this.tokenClient = await this.google.accounts.oauth2.initTokenClient({
            client_id: this.clientId,
            scope: SCOPES,
            callback: '', // defined later
        });
        console.debug("GapiWrapper.onGapiLoaded - Done initializing tokenClient");

        this.tokenClient.callback = async (resp) => {
            console.debug("GapiWrapper.onGapiLoaded - tokenClient callback");
            if (resp.error !== undefined) {
                throw (resp);
            }
            console.debug("Token client callback invoked");
            if (this.consentRequested) {
                this.tokenClient.requestAccessToken({prompt: ''});
            } else {
                this.tokenClient.requestAccessToken({prompt: 'consent'});
            }

            this.token = await this.gapi.client.getToken();

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
        console.debug("GapiWrapper.init - Initializing Google Drive Class");
        if (!this.apiKey) {
            console.log("GapiWrapper.init - Skipping due to missing API Key");
            return;
        }

        if (!this.clientId) {
            console.log("GapiWrapper.init - Skipping due to missing Client Id");
            return;
        }
        if (!this.gapi) {

            console.warn("Gapi is not initialized");
            return;
        }

        await this.gapi.load('client',  async () => {
            console.log("GapiWrapper.init:gapi.load callback");
            await this.onGapiLoaded();
            });
    }

    async authorize() {
        console.debug("GapiWrapper.authorize - Authorizing Google Drive client");

        if (!(await this.isSignInReady() || await this.isRefreshReady())) {
            throw new Error("Cannot authorize with uninitialized dependencies");
        }

        if (this.consentRequested) {
            console.debug("Consent to Google previously given, only refreshing");
            this.tokenClient.requestAccessToken({prompt: ''});
        } else {
            console.debug("Consent to Google not previously given, loading consent screen");
            this.tokenClient.requestAccessToken({prompt: 'consent'});
            this.consentRequested = true;
        }

        this.token = await this.gapi.client.getToken();
    }

    load(apiWrapper) {
        if (!apiWrapper || typeof apiWrapper != 'object') {
            throw new Error("GapiWrapper.load - Invalid credentials");
        }
        this.clientId = googleApi.clientId;
        this.apiKey = googleApi.apiKey;
        this.token = googleApi.token;
        this.consentRequested = googleApi.consentRequested;
    }

    setToken(token) {
        if (!token || typeof token != "object") {
            throw new Error("Invalid token");
        }

        console.debug("Set token invoked");
        this.token = token;
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
        this.consentRequested = false;
    }
}

export default GapiWrapper;