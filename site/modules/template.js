import GoogleDoc from "./gdocs.js"

class Template {
    constructor() {
        this.name = "";
        this.document = new GoogleDoc();
    }

    static createFromObject(jsonObject) {
        if (!jsonObject) {
            throw new Error("Object to load was undefined");
        }
        if (typeof jsonObject != 'object') {
            throw new Error("Object to load not an object");
        }
        try {
            let temp = new Template();

            // Do the deep copy
            temp.setName(jsonObject.name);

            if (jsonObject.document){
                this.document = GoogleDoc.createFromObject(jsonObject.document);
            } else {
                this.document = new GoogleDoc();
            }

            return temp;
        } catch(err) {
            throw new Error("Encountered issue during deep-copy. Error: " + err.message, { cause: err })
        }
    }

    setDocument(document) {
        this.document = document;
    }

    setGapiWrapper(gapiWrapper) {
        this.document.setGapiWrapper(gapiWrapper);
    }

    setName(name) {
        console.debug("Setting template name: " + name);
        this.name = name;
        this.document.setName(name);
    }

    async isReady() {
//        debugger;
        return this.name && this.document && await this.document.exists();
    }


}

export default Template;