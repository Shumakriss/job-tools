import Company from "./company.js";
import Template from "./template.js";
import GoogleDoc from "./gdocs.js";

const MONTHS = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December"
}

class TailoredDocument {

    constructor() {
        const date = new Date();  // Today
        this.date = MONTHS[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
        this.template = new Template();
        this.company = new Company();
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
            let temp = new TailoredDocument();

            // Do the deep copy
            temp.setName(jsonObject.name);

            return temp;
        } catch(err) {
            throw new Error("Encountered issue during deep-copy. Error: " + err.message, { cause: err })
        }
    }

    setName(name) {
        this.name = name;
    }

    setDocument(document) {
        this.document = document;
    }

    setTemplate(template) {
        this.template = template;
        this.name = this.company.name + " " + this.template.name;
        if (this.document) {
            this.document.setName(this.name);
        }
    }

    setCompany(company) {
        this.company = company;
        this.name = this.company.name + " " + this.template.name;
        if (this.document) {
            this.document.setName(this.name);
        }
    }

    getName() {
        return this.name;
    }

    async getPdfLink() {
        console.log("TailoredDocument.getPdfLink: ", this);
        if (!this.pdfLink && this.document) {
            this.pdfLink = await this.document.getPdfLink();
        }

        return this.pdfLink;
    }
}

export default TailoredDocument;