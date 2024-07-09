
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


function gdrive() {
    console.log("gdrive func")
}


/**
* Callback after api.js is loaded.
*/
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

/**
* Callback after the API client is loaded. Loads the
* discovery doc to initialize the API.
*/
async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
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
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
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


/**
*  Sign in the user upon button click.
*/
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw (resp);
      }
      document.getElementById('signout_button').style.visibility = 'visible';
      document.getElementById('authorize_button').innerText = 'Refresh';
      sessionStorage.setItem("gapi-token", JSON.stringify(gapi.client.getToken()));
//      await listFiles();
    };

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({prompt: ''});
    }

}

/**
*  Sign out the user upon button click.
*/
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
//        document.getElementById('content').innerText = '';
        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

async function listFiles() {
    let response;
    try {
      response = await gapi.client.drive.files.list({
        'pageSize': 10,
        'fields': 'files(id, name)',
      });
    } catch (err) {
      document.getElementById('content').innerText = err.message;
      return;
    }
    const files = response.result.files;
    if (!files || files.length == 0) {
      document.getElementById('content').innerText = 'No files found.';
      return;
    }
    // Flatten to string to display
    const output = files.reduce(
        (str, file) => `${str}${file.name} (${file.id})\n`,
        'Files:\n');
    document.getElementById('content').innerText = "Login successful";
}

async function getDocumentIdByName(name) {
    console.log("get doc id by name")
    let files;

    let response;
    try {
        console.log("Issued async request")
        response = await gapi.client.drive.files.list({
            'q': 'name = \'' + name + '\'',
            'pageSize': 5,
            'fields': 'nextPageToken, files(id, name)',
        });
    } catch (err) {
        document.getElementById('content').innerText = err.message;
        return;
    }

    files = response.result.files;
    if (!files) {
        console.log("No files found")
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

async function copyFile(fileId, fileName) {
    console.log("Copying file ID: " + fileId);

    let response;
    try {
      response = await gapi.client.drive.files.copy({
        'fileId': fileId
      });
    } catch (err) {
      document.getElementById('content').innerText = err.message;
      return;
    }

    let newFileId = response.result.id;
    console.log("Copied " + fileId + " to " + newFileId);
    console.log("Renaming " + newFileId + " to " + fileName);
    try {
      response = await gapi.client.drive.files.update({
        'fileId': newFileId,
        'resource': { 'name': fileName, 'capabilities': {'canDownload': true}}
      });
      return newFileId;
      console.log(response);
    } catch (err) {
      document.getElementById('content').innerText = err.message;
      return;
    }
}

async function getPlaintextFileContents(fileId) {
    console.log("Getting plaintext file contents: " + fileId);

    try {
        // This only works on Google Docs formatted files!
        const response = await gapi.client.drive.files.export({
            fileId: fileId,
            mimeType: 'text/plain'
        });
        return response.body;
    } catch (err) {
        document.getElementById('content').innerText = err.message;
    throw err;
    }

}