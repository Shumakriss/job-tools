/*
* This file stores functions built on the Google Docs interaction
*/


class GoogleDoc {
    constructor(gapiWrapper) {
        if (!gapiWrapper) {
            throw new Error("GoogleDoc.constructor - Must provide GoogleApi-like object");
        }
        this.gapiWrapper = gapiWrapper;
        this.name;
        this.id = null;
        this.exists;
        this.pdfLink = null;
    }

    getName() {
        this.name = name;
    }

    setName(name) {
        console.debug("Setting GoogleDoc name to: " + name);
        this.name = name;
        this.id = null;
        this.pdfLink = null;
    }

    async exists() {
        this.id = await this.lookupId();
        if (this.id) {
            return this.id;
        } else {
            return false;
        }
    }

    async lookupId() {
        console.debug("GoogleDoc.lookupId - Looking up name: " + this.name);
        let id = await this.gapi.getDocumentIdByName(this.name);

        if (id != null) {
            console.debug("GoogleDoc.lookupId - Found id: " + id + " for name: " + this.name);
            this.exists = true;
            this.id = id;
        } else {
            console.debug("GoogleDoc.lookupId - ID not found for name: " + this.name);
            this.exists = false;
            this.id = null;
        }

        return this.id;
    }

    async getId() {
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