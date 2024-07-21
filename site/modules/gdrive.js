/*
* This file stores functions built on the Google Drive interaction
*/

// TODO: Move into GoogleWorkspace
class GoogleDrive {

    constructor(gapiWrapper) {
        if (!gapiWrapper) {
            throw new Error("GoogleDrive.constructor() - Must provide GapiWrapper");
        }
        this.gapiWrapper = gapiWrapper;
    }

    async isReady() {
        return await this.gapiWrapper.isReady();
    }

    static gDocLinkFromId(gDocId) {
        if (!gDocId || gDocId == "") {
            throw new Error("GoogleDrive.gDocLinkFromId - Invalid Google Drive ID");
        }
        return "https://docs.google.com/document/d/" + gDocId + "/edit";
    }
    
    async listFiles() {
        console.debug("GoogleDrive.listFiles called");
        let response;
        try {
            response = await this.gapiWrapper.gapi.client.drive.files.list({
                'pageSize': 10,
                'fields': 'files(id, name)',
            });
            console.debug("GoogleDrive.listFiles got response from google");
        } catch (err) {
            console.error(err.message);
            throw new Error("Failed to list files due to error: " + err.message);
        }

        if (!response) {
            throw new Error("listFiles response is undefined");
        }

        if (!response.result) {
            throw new Error("Did not receive result in listFiles response");
        }

        if (!response.result.files) {
            throw new Error("Did not receive files in listFiles response.result");
        }

        const files = response.result.files;
        if (!files || files.length == 0) {
            console.log('No files found.');
          return;
        }
        // Flatten to string to display
        const output = files.reduce(
            (str, file) => `${str}${file.name} (${file.id})\n`,
            'Files:\n');
    }
    
    async getDocumentIdByName(name) {
        console.info("Getting doc ID for name: ", name);

        if (!this.gapiWrapper) {
            throw new Error("Cannot getDocumentIdByName without Gapi client");
        }
        if (!name) return null;
    
        let files;
    
        let response;
        try {
            response = await this.gapiWrapper.gapi.client.drive.files.list({
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
          response = await this.gapiWrapper.gapi.client.drive.files.copy({
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
          response = await this.gapiWrapper.gapi.client.drive.files.update({
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
            const response = await this.gapiWrapper.gapi.client.drive.files.export({
                fileId: fileId,
                mimeType: 'text/plain'
            });
            return response.body;
        } catch (err) {
            console.log(err.message);
        throw err;
        }
    }
    
    /*
    *
    * Valid Export Types: https://developers.google.com/drive/api/guides/ref-export-formats
    */
    async getPdfFileContents(fileId) {
        console.log("Getting PDF file contents: " + fileId);
    
        try {
            // This only works on Google Docs formatted files!
            const response = await this.gapiWrapper.gapi.client.drive.files.export({
                fileId: fileId,
                mimeType: 'application/pdf'
            });
            return response.body;
        } catch (err) {
            document.getElementById('content').innerText = err.message;
        throw err;
        }
    
    }
    
    async createFile(fileId) {
        console.log("Creating PDF in Google Drive: " + fileName);
    
        try {
            // This only works on Google Docs formatted files!
            const response = await this.gapiWrapper.gapi.client.drive.files.create({
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
    
    async getPdfLink(fileId) {
        console.log("Getting PDF link from Google Drive: " + fileId);
    
        try {
            // This only works on Google Docs formatted files!
            const response = await this.gapiWrapper.gapi.client.drive.files.get({
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

}

export default GoogleDrive;