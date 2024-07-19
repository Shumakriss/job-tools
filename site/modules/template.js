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
            if (jsonObject.document){
                this.document = GoogleDoc.createFromObject(jsonObject.document);
            } else {
                // Defaulted in constructor
            }

            temp.setName(jsonObject.name);

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
        return this.name && this.document && await this.document.id;
    }


}

export default Template;