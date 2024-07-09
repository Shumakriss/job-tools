
// Discovery doc URL for APIs
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive';

let tokenClient;
let gapiInited = false;
let gisInited = false;
let storedGApiToken = JSON.parse(sessionStorage.getItem("gapi-token"));

// TODO: Check existing token to setup buttons
document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';


/**
* Callback after api.js is loaded.
*/
function gapiLoaded(apiKey) {
    gapi.load('client', (apiKey)=>{initializeGapiClient(apiKey)});
    maybeEnableButtons();
}

/**
* Callback after the API client is loaded. Loads the
* discovery doc to initialize the API.
*/
async function initializeGapiClient(apiKey) {
    await gapi.client.init({
      apiKey: apiKey,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
    if (storedGApiToken && storedGApiToken != null && storedGApiToken != "null") {
        console.log("Loaded stored gAPI token");
        gapi.client.setToken(storedGApiToken);
        document.getElementById('authorize_button').innerText = 'Refresh';
        document.getElementById('authorize_button').style.visibility = 'visible';
        document.getElementById('signout_button').style.visibility = 'visible';
    }
}

/**
* Callback after Google Identity Services are loaded.
*/
function gisLoaded(clientId) {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES,
      callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
* Enables user interaction after all libraries are loaded.
*/
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

