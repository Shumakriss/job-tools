// Discovery doc URL for APIs
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive';
const GoogleDriveStates = Object.freeze({
    UNKNOWN:   Symbol("unknown"),
    AUTHORIZED:  Symbol("authorized"),
    UNAUTHORIZED: Symbol("unauthorized")
});

class GoogleDrive {

    constructor (apiKey, clientId, token, onAuthenticatedCallback) {
        this.apiKey = apiKey;
        this.clientId = clientId;
        this.token = token;
        this.tokenClient = null;
        this.state = GoogleDriveStates.UNKNOWN;
        this.onAuthenticatedCallback = onAuthenticatedCallback;
    }


    async onGapiLoaded() {

        await gapi.client.init({
            apiKey: this.apiKey,
            discoveryDocs: [DISCOVERY_DOC]
            });

        if (this.token) {
            gapi.client.setToken(this.token);
            this.state = GoogleDriveStates.AUTHORIZED;
            this.onAuthenticatedCallback();
        }

        this.state = GoogleDriveStates.UNAUTHORIZED;

        this.tokenClient = await google.accounts.oauth2.initTokenClient({
            client_id: this.clientId,
            scope: SCOPES,
            callback: '', // defined later
        });
        console.debug("Done initializing tokenClient");

        this.tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                this.state = GoogleDriveStates.UNAUTHORIZED;
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
            this.state = GoogleDriveStates.UNKNOWN;
            console.log("Missing API Key");
            return;
        }

        if (!this.clientId) {
            this.state = GoogleDriveStates.UNKNOWN;
            console.log("Missing Client Id");
            return;
        }

        gapi.load('client',  () => {this.onGapiLoaded()});
    }

    async authorize() {
        console.log("Authorizing Google Drive client");
        if (gapi.client.getToken() === null) {
            this.tokenClient.requestAccessToken({prompt: 'consent'});
            this.state = GoogleDriveStates.AUTHORIZED;
        } else {
            this.tokenClient.requestAccessToken({prompt: ''});
            this.state = GoogleDriveStates.AUTHORIZED;
        }
    }

    signOut() {
        google.accounts.oauth2.revoke(this.token.access_token);
        gapi.client.setToken('');
        this.state = GoogleDriveStates.UNAUTHORIZED;
    }
}


function gDocLinkFromId(gDocId) {
    return "https://docs.google.com/document/d/" + gDocId + "/edit";
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
    console.log("Getting doc ID for name: " + name);
    let files;

    let response;
    try {
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

async function getPdfFileContents(fileId) {
    console.log("Getting PDF file contents: " + fileId);

    try {
        // This only works on Google Docs formatted files!
        const response = await gapi.client.drive.files.export({
            fileId: fileId,
            mimeType: 'application/pdf'
        });
        return response.body;
    } catch (err) {
        document.getElementById('content').innerText = err.message;
    throw err;
    }

}

async function createFile(fileId) {
    console.log("Creating PDF in Google Drive: " + fileName);

    try {
        // This only works on Google Docs formatted files!
        const response = await gapi.client.drive.files.create({
            fileId: fileId,
            media: {
                mimeType: "application/pdf",
                body: content
            }
        });
        return response.body;
    } catch (err) {
        document.getElementById('content').innerText = err.message;
    throw err;
    }

}

async function getPdfLink(fileId) {
    console.log("Getting file from Google Drive: " + fileId);

    try {
        // This only works on Google Docs formatted files!
        const response = await gapi.client.drive.files.get({
            fileId: fileId,
            fields: 'exportLinks'
        });
        let file = JSON.parse(response.body);
        return file.exportLinks['application/pdf'];
    } catch (err) {
        document.getElementById('content').innerText = err.message;
    throw err;
    }

}