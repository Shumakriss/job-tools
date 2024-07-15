class GoogleDoc {
    constructor() {
        this.name;
        this.id;
        this.exists;
        this.pdfLink;
    }

    getName() {
        this.name = name;
    }

    setName(name) {
        if (this.name == name){
            return;
        } else {
            this.lookupId();
        }
    }

    async lookupId() {
        this.id = await getDocumentIdByName(this.name);

        if (id) {
            this.exists = true;
            this.id = id;
        } else {
            this.exists = false;
            this.id = null;
        }
    }

    async getId() {
        if (this.id) {
            return this.id;
        } else {
            await lookupId();
            return this.id;
        }
    }

    async getPdfLink() {
        if (this.pdfLink) {
            return this.pdfLink;
        } else {
            this.pdfLink = await getPdfLink(this.getId());
            return this.pdfLink;
        }
    }
}

class Template {
    constructor() {
        this.name;
        this.googleDoc = new GoogleDoc();
    }

    setName(name) {
        this.googleDoc.setName(name);
    }
}

class ApplicationLog {
    constructor() {
        this.name;
        this.googleDoc = new GoogleDoc();
    }

    setName(name) {
        this.name = name;
        this.googleDoc.setName(name);
    }

    logApplication(companyName) {
        return;
    }
}

class Company {
    constructor() {
        this.name;
        this.about;
        this.address;
    }

    setName(name) {
        this.name = name;
    }
}

class TailoredDocument {

    constructor() {
        this.name;
        this.template;
        this.company;
        this.googleDoc;
        this.pdfLink;
    }

    setName(companyName, templateName) {
        this.companyName = companyName;
        this.templateName = templateName;
        this.googleDoc.setName(this.getName);
    }

    setTemplate(template) {
        this.template = template;
    }

    getTemplate() {
        return this.template;
    }

    setCompanyName(companyName) {
        this.companyName = companyName;
    }

    getName() {
        this.name = this.companyName + " " + this.template.name;
        this.googleDoc.setName(this.name);
        return this.name;
    }

    getPdfLink() {
        return this.googleDoc.getPdfLink();
    }

}

class JobPosting {

    constructor() {
        this.title;
        this.description;
        this.minimumRequirements;
        this.preferredRequirements;
        this.responsibilities;
        this.company = new Company();
    }
}

class Google {
    constructor() {
        this.clientId;
        this.apiKey;
        this.token;
    }
}

class Jobscan {
    constructor() {
        this.xsrfToken;
        this.cookie;
    }
}


class ChatGpt {
    constructor() {
        this.apiKey;
        this.healthCheck;
    }

    isReady() {
        return healthCheck();
    }

    healthCheck() {
        if (this.apiKey) {
            // invoke test method
        } else {
            //throw
            return false;
        }
    }

    ask(prompt, dryRun=false) {
        if (dryRun){
            return "Mock response from ChatGPT";
        } else {
            if (!this.apiKey) {
                throw new Error("Chat GPT missing API Key");
                return;
            }

            if (!this.prompt) {
                throw new Error("Missing prompt");
                return;
            }

            askChatGpt(this.apiKey, prompt);
        }

    }
}

class WebApplication {

    constructor() {
        this.storageKey = "web-application-state";

        this.resumeTemplate = new Template();
        this.coverLetterTemplate = new Template();

        this.company = new Company();
        this.company.name = "";

        this.resumeTailoredDocument = new TailoredDocument();
        this.resumeTailoredDocument.company = this.company;

        this.coverLetterTailoredDocument = new TailoredDocument();
        this.coverLetterTailoredDocument.company = this.company;

        this.jobPosting = new JobPosting();
        this.jobPosting.company = this.company;

        this.chatGpt = new ChatGpt();
    }

    setCompanyName(name) {
        this.company.name = name;
    }

    loadCredentialFile(credentialFile) {
        this.chatGpt.apiKey = credentialFile.chatGpt.apiKey;
    }

    authenticate() {
        // Check if different
        // Set all variables
        // Refresh token
    }

    isAuthenticated() {
        // Check variables
        // Test API calls?
        // googleApi.isAuthenticated?
        // jobscan.isAuthenticated?
        // chatgpt.isAuthenticated?
    }

    extractJobDescription() {
    }

    copyTemplates() {

    }

    readyToExtract() {
        return this.chatGpt.isReady() && this.jobPosting.description
    }

    readyForScan() {
        console.log("Checking if ready for scan");
        return false;
    }

    scan() {
    }

    tailorTemplates() {
    }

    clearFromStorage() {
        localStorage.removeItem(this.storageKey);
        console.log("Cleared application state from storage");
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this));
        console.log("Saved application state to local storage");
    }
    
    tryLoad() {
        let storedState = localStorage.getItem(this.storageKey);
        if (storedState) {
            console.log("Found application state in local storage.");
            this.load(storedState);
            return true;
        } else {
            console.log("No application state found in local storage.");
            return false;
        }
    }
    
    load(webApplicationJson) {
        let app = JSON.parse(webApplicationJson);
        console.log("App from storage:", app);

        this.company.name = app.company.name;

        this.chatGpt = new ChatGpt();
        this.chatGpt.apiKey = app.chatGpt.apiKey;


        console.log("Application state loaded", this);
    }
}
