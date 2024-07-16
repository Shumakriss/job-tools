const LINKEDIN_QUERY = "(software OR data) AND (founding OR senior OR principal OR staff OR L4 OR L5) AND (engineer OR architect)";

class GoogleDoc {
    constructor() {
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

    async lookupId() {
        console.debug("GoogleDoc.lookupId - Looking up name: " + this.name);
        let id = await getDocumentIdByName(this.name);

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
}

class Template {
    constructor() {
        this.name;
        this.googleDoc = new GoogleDoc();
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
        this.name = "";
        this.possessive = "";
        this.about = "";
        this.address = "";
        this.values = "";
    }

    setName(name) {
        this.name = name;
        if(name && name != null && name != "") {

            if(name.endsWith("s")) {
                this.possessive = name + "'";
            } else {
                this.possessive = name + "'s";
            }

        }

    }
}

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

class JobPosting {

    constructor() {
        this.title = "";
        this.completeTitle = "";
        this.shortTitle = "";
        this.description = "";
        this.minimumRequirements = "";
        this.preferredRequirements = "";
        this.responsibilities = "";
        this.hiringManager = "Hiring Manager";
        this.relevantExperience = "";
        this.company = new Company();
    }

    setCompany(company) {
        this.company = company;
    }

    setDescription(description) {
        this.description = description;
    }

    setTitle(title) {
        console.debug("JobPosting.setTitle() - " + title);
        this.title = title;

        if (this.shortTitle == "") {
            console.debug("JobPosting.setTitle() - shortTitle is empty, trying to update");
            if (title.includes(",")){
                this.shortTitle = title.split(",")[0];
            } else {
                this.shortTitle = title;
            }
        }

        if (this.completeTitle == "") {
            this.completeTitle = title;
        }
    }
}

class Jobscan {
    constructor() {
        this.xsrfToken;
        this.cookie;
    }

    isReady() {
        return this.xsrfToken && this.cookie;
    }

}


class ChatGpt {
    constructor() {
        this.apiKey;
        this.healthCheckResult;
    }

    isReady() {
        return this.apiKey && this.healthCheck();
    }

    async healthCheck() {
        if (!this.healthCheckResult) {
            this.healthCheckResult = await this.ask("Say hello");
        }

        return this.healthCheckResult;
    }

    async ask(prompt, dryRun=false) {
        if (dryRun){
            return "Mock response from ChatGPT";
        }

        if (!this.apiKey){
            throw new Error("Chat GPT missing API Key");
        }

        if (!prompt) {
            throw new Error("Missing prompt");
        }

        return await askChatGpt(this.apiKey, prompt);
    }
}

class WebApplication {

    constructor() {
        this.storageKey = "web-application-state";

        let company = new Company();
        company.name = "";
        this.company = company;

        let resumeTemplate = new Template();
        resumeTemplate.name = null;

        let coverLetterTemplate = new Template();
        coverLetterTemplate.name = "";

        this.resume = new TailoredDocument();
        this.resume.setCompany(company);
        this.resume.template = resumeTemplate;

        this.coverLetter = new TailoredDocument();
        this.coverLetter.setCompany(company);
        this.coverLetter.company = company;
        this.coverLetter.template = coverLetterTemplate;

        this.job = new JobPosting();
        this.job.setCompany(company);

        this.chatGpt = new ChatGpt();
        this.jobscan = new Jobscan();
        this.googleApi = new GoogleApi();

        const date = new Date();  // Today
        const month = date.toLocaleString('default', { month: 'long' });
        this.applicationDate = `${month} ${date.getDate()}, ${date.getFullYear()}`;
        this.applicationLog = new ApplicationLog();
    }

    setCompanyName(name) {
        console.log("Set company name: " + name);
        this.company.setName(name);
        this.resume.setCompany(this.company);
        this.coverLetter.setCompany(this.company);
        this.job.setCompany(this.company);
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

    async extractJobDescriptionSections() {
        let prompt;
        let response;

        prompt = COMPANY_NAME_PROMPT + "\n\nJob Description:\n\n"+ app.job.description;
        response = await this.chatGpt.ask(prompt);
        if (response == "No section found.") {
            response = "";
        }
        app.setCompanyName(response);

        prompt = JOB_TITLE_PROMPT + "\n\nJob Description:\n\n"+ app.job.description;
        response = await this.chatGpt.ask(prompt);
        if (response == "No section found.") {
            response = "";
        }
        app.job.setTitle(response);

        prompt = JOB_DUTIES_PROMPT + "\n\nJob Description:\n\n"+ app.job.description;
        response = await this.chatGpt.ask(prompt);
        if (response == "No section found.") {
            response = "";
        }
        app.job.responsibilities = response;

        prompt = COMPANY_INFORMATION_PROMPT + "\n\nJob Description:\n\n"+ app.job.description;
        response = await this.chatGpt.ask(prompt);
        if (response == "No section found.") {
            response = "";
        }
        app.company.about = response;

        prompt = MINIMUM_JOB_REQUIREMENTS_PROMPT + "\n\nJob Description:\n\n"+ app.job.description;
        response = await this.chatGpt.ask(prompt);
        if (response == "No section found.") {
            response = "";
        }
        app.job.minimumRequirements = response;

        prompt = PREFERRED_JOB_REQUIREMENTS_PROMPT + "\n\nJob Description:\n\n"+ app.job.description;
        response = await this.chatGpt.ask(prompt);
        if (response == "No section found.") {
            response = "";
        }
        app.job.preferredRequirements = response;
    }

    copyTemplates() {

    }

    isExtractReady() {
        return this.job.description && this.chatGpt.isReady();
    }

    isScanReady() {
        console.log("Checking if ready for scan");
        return false;
    }

    isTailorReady() {
        return app.googleApi.isReady() && app.coverLetter.template.isReady() ;
    }

    scan() {
    }

    tailorTemplates() {
    }

    clearFromStorage() {
        localStorage.removeItem(this.storageKey);
        console.log("Cleared application state from storage");
    }

    replacer(key, value)
    {
        if (key=="tokenClient"){
            console.debug("Skipping serialization of tokenClient");
            return undefined;
        } else {
            return value;
        }
    }

    save() {
        console.log("Saving app", this);
        localStorage.setItem(this.storageKey, JSON.stringify(this, this.replacer));
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
        console.debug("App from storage:", app);

        let company = new Company();
        this.company = company;
        this.company.setName(app.company.name);

        console.log("Set resume template name");
        let resumeTemplate = new Template();
        resumeTemplate.setName(app.resume.template.name);
        this.resume.setTemplate(resumeTemplate);
        this.resume.setCompany(company);

        console.log("Set cover letter template name");
        let coverLetterTemplate = new Template();
        coverLetterTemplate.setName(app.coverLetter.template.name);
        this.coverLetter.setTemplate(coverLetterTemplate);
        this.coverLetter.setCompany(company);

        this.job = new JobPosting();
        this.job.setCompany(company);
        this.job.setDescription(app.job.description);
        this.job.setTitle(app.job.title);

        // Third-party
        this.chatGpt.apiKey = app.chatGpt.apiKey;
        this.googleApi.load(app.googleApi);
        this.jobscan.cookie = app.jobscan.cookie;
        this.jobscan.xsrfToken = app.jobscan.xsrfToken;

        console.info("Application state loaded", this);
    }
}
