import Company from "./company.js";
import Template from "./template.js";
import GoogleDoc from "./gdocs.js";

class TailoredDocument {

    constructor() {
        this.template = new Template();
        this.company = new Company();
        this.googleDoc = new GoogleDoc();
    }

    setTemplate(template) {
        this.template = template;
        this.name = this.company.name + " " + this.template.name;
        this.googleDoc.setName(this.name);
    }

    setCompany(company) {
        this.company = company;
        this.name = this.company.name + " " + this.template.name;
        this.googleDoc.setName(this.name);
    }

    getName() {
        return this.name;
    }

    async getPdfLink() {
        console.log("GoogleDoc.getPdfLink: ", this);
        return await this.googleDoc.getPdfLink();
    }

}

export default TailoredDocument;