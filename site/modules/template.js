
class Template {
    constructor() {
        this.name;
        this.googleDoc;
    }

    setGoogleDoc(gDoc) {
        this.googleDoc = gDoc;
    }

    setName(name) {
        console.debug("Setting template name: " + name);
        this.name = name;
        this.googleDoc.setName(name);
    }

    async isReady() {
        let id = await this.googleDoc.getId();
        if (id && id != null) {
            return true;
        } else {
            return false;
        }
    }
}

export default Template;