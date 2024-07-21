import GoogleDrive from "./gdrive.js"

/*
* This file stores functions built on the Google Docs interaction
*/

// TODO: Move into GoogleWorkspace
class GoogleDoc {

    constructor() {
        this.gapiWrapper;
        this.name = "";
        this.id = null;
        this.pdfLink = null;
        this.gDrive;
    }

    static async createFromObject(jsonObject) {
        if (!jsonObject) {
            throw new Error("Object to load was undefined");
        }
        if (typeof jsonObject != 'object') {
            throw new Error("Object to load not an object");
        }
        try {
            let temp = new GoogleDoc();

            // Do the deep copy
            temp.name = jsonObject.name;
//            await temp.lookupId();

            return temp;
        } catch(err) {
            throw new Error("Encountered issue during deep-copy. Error: " + err.message, { cause: err })
        }
    }

    getName() {
        this.name = name;
    }

    async setName(name) {
        console.debug("Setting GoogleDoc name to: " + name);
        if (name != this.name){
            this.name = name;
            if(this.gapiWrapper) {
                this.id = await this.lookupId();
            }
        } else {
            this.name = name;
        }
    }

    setGapiWrapper(gapiWrapper) {
        this.gapiWrapper = gapiWrapper;
        this.gDrive = new GoogleDrive(gapiWrapper);
    }

    async exists() {
        console.debug("Checking if document exists for name: " + this.name);
        this.id = await this.lookupId();
        if (!this.id) {
            console.log("No ID found for document named: " + this.name);
        }
        if (this.id) {
            return this.id;
        } else {
            return false;
        }
    }

    async lookupId() {
        if (!this.name) {
            console.log("GoogleDoc.lookupId - Name is not set");
            return;
        }

        if (!this.gapiWrapper) {
            console.log("GoogleDoc.lookupId - GapiWrapper is not set");
            throw new Error("GoogleDoc.lookupId - GapiWrapper is not set")
        }

        if (!await this.gDrive.isReady()) {
            console.log("GoogleDoc.lookupId - gDrive is not ready");
            return;
        }

        console.debug("GoogleDoc.lookupId - Looking up name: " + this.name);
        let id = await this.gDrive.getDocumentIdByName(this.name);

        if (id != null) {
            console.debug("GoogleDoc.lookupId - Found id: " + id + " for name: " + this.name);

            this.id = id;
        } else {
            console.debug("GoogleDoc.lookupId - ID not found for name: " + this.name);

            this.id = null;
        }

    console.debug("GoogleDoc.lookupId - Looking up returning: " + this.id);
        return this.id;
    }

    async getId() {
        console.log("GoogleDoc.getId - This.name: " + this.name);
        if (this.id != null) {
            console.debug("GoogleDoc id is not null: " + this.id);
            return this.id;
        } else {
            if (!this.name || this.name == null || this.name == "") {
                throw new Error("Missing name");
            }
            console.debug("GoogleDoc id is null, looking up ID");
            this.id = await this.lookupId();
            return this.id;
        }
    }

    async getPdfLink() {
        console.debug("GoogleDoc getting pdf link");
        if (this.pdfLink) {
            console.debug("Returning existing link: " + this.pdfLink);
            return this.pdfLink;
        } else {
            console.debug("Fetching new PDF link");
            let id = await this.getId();
            console.debug("ID retrieved: " + id);
            if (id != null){
                console.debug("Fetching new PDF link for ID: " + id);
                let pdfLink = await getPdfLink(id);
                console.debug("PDF link for ID: " + id + " is " + pdfLink);
                this.pdfLink = pdfLink;
                return this.pdfLink;
            } else {
                console.debug("ID for PDF not found: " + id);
                return;
            }
        }
    }


    /*
    * Based on https://developers.google.com/docs/api/how-tos/merge
    */
    async mergeTextInResume(docId, jobTitle) {
        console.log("Merging job title '" + jobTitle + " to doc: " + docId);
        let requests = [
            {
                replaceAllText: {
                    containsText: {
                        text: '{{job-title}}',
                        matchCase: true,
                    },
                    replaceText: jobTitle,
                },
            }
        ];

        let requestPayload = {
            documentId: docId,
            resource: {
                requests,
            },
        };
        let errorHandler = (err, {data}) => {
            console.log("There was an error")
            if (err) return console.log('The API returned an error: ' + err);
                console.log(data);
        }

        await gapi.client.docs.documents.batchUpdate(requestPayload, errorHandler);
        console.log("All done");
    }

}

export default GoogleDoc;