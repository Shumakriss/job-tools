/*
* This file provide useful functions for interacting with files in Google Drive.
*/

// Discovery doc URL for APIs
const DRIVE_DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SHEETS_DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';


// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets';
const GoogleApiStates = Object.freeze({
    UNKNOWN:   Symbol("unknown"),
    AUTHORIZED:  Symbol("authorized"),
    UNAUTHORIZED: Symbol("unauthorized")
});

class GoogleApi {

    constructor (apiKey, clientId, token, onAuthenticatedCallback) {
        this.apiKey = apiKey;
        this.clientId = clientId;
        this.token = token;
        this.tokenClient = null;
        this.state = GoogleApiStates.UNKNOWN;
        this.onAuthenticatedCallback = onAuthenticatedCallback;
    }


    async onGapiLoaded() {

        await gapi.client.init({
            apiKey: this.apiKey,
            discoveryDocs: [DRIVE_DISCOVERY_DOC, SHEETS_DISCOVERY_DOC]
            });

        if (this.token) {
            gapi.client.setToken(this.token);
            this.state = GoogleApiStates.AUTHORIZED;
            this.onAuthenticatedCallback();
        }

        this.state = GoogleApiStates.UNAUTHORIZED;

        this.tokenClient = await google.accounts.oauth2.initTokenClient({
            client_id: this.clientId,
            scope: SCOPES,
            callback: '', // defined later
        });
        console.debug("Done initializing tokenClient");

        this.tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                this.state = GoogleApiStates.UNAUTHORIZED;
                throw (resp);
            }
            console.debug("Token client callback invoked");
            this.token = await gapi.client.getToken();
            this.onAuthenticatedCallback();
        };
    }

    init() {
        console.log("Initializing Google Drive Class");
        if (!this.apiKey) {
            this.state = GoogleApiStates.UNKNOWN;
            console.log("Missing API Key");
            return;
        }

        if (!this.clientId) {
            this.state = GoogleApiStates.UNKNOWN;
            console.log("Missing Client Id");
            return;
        }

        gapi.load('client',  () => {this.onGapiLoaded()});
    }

    async authorize() {
        console.log("Authorizing Google Drive client");
        if (gapi.client.getToken() === null) {
            this.tokenClient.requestAccessToken({prompt: 'consent'});
            this.state = GoogleApiStates.AUTHORIZED;
        } else {
            this.tokenClient.requestAccessToken({prompt: ''});
            this.state = GoogleApiStates.AUTHORIZED;
        }
    }

    signOut() {
        google.accounts.oauth2.revoke(this.token.access_token);
        gapi.client.setToken('');
        this.state = GoogleApiStates.UNAUTHORIZED;
    }
}

