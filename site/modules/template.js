
class Template {
    constructor() {
        this.name;
        this.document;
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

            return temp;
        } catch(err) {
            throw new Error("Encountered issue during deep-copy. Error: " + err.message, { cause: err })
        }
    }

    setDocument(document) {
        this.document = document;
    }

    setName(name) {
        console.debug("Setting template name: " + name);
        this.name = name;
//        this.document.setName(name);
    }

    async isReady() {
        let id = await this.document.getId();
        if (id && id != null) {
            return true;
        } else {
            return false;
        }
    }


}

export default Template;