/*
* This file stores functions built on the Google Drive interaction
*/

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