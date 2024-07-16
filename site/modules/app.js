const LINKEDIN_QUERY = "(software OR data) AND (founding OR senior OR principal OR staff OR L4 OR L5) AND (engineer OR architect)";

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
        console.debug("Setting GoogleDoc name to: " + name);
        this.name = name;
    }

    async lookupId() {
        console.debug("Looking up name: " + this.name);
        let id = await getDocumentIdByName(this.name);

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
            this.id = await lookupId();
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
        console.debug("Setting template name: " + name);
        this.name = name;
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
        this.template = new Template();
        this.company = new Company();
        this.googleDoc = new GoogleDoc;
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

    setCompany(company) {
        this.company = company;
    }

    setDescription(description) {
        this.description = description;
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
        let companyName = await this.chatGpt.ask(prompt);
        console.log("ChatGPT discovered companyName:" + companyName);
        app.setCompanyName(companyName);

        prompt = JOB_TITLE_PROMPT + "\n\nJob Description:\n\n"+ app.job.description;
        let jobTitle = await this.chatGpt.ask(prompt);
        console.log("ChatGPT discovered job title:" + jobTitle);
        app.job.title = jobTitle;

//        prompt = JOB_TITLE_PROMPT + "\n\nJob Description:\n\n"+ jobDescription;
//        response = await askChatGpt(session.chatGptApiKey, prompt);
//        document.getElementById("job-title").value = response;
//
//        prompt = JOB_DUTIES_PROMPT + "\n\nJob Description:\n\n"+ jobDescription;
//        response = await askChatGpt(session.chatGptApiKey, prompt);
//        document.getElementById("job-duties").value = response;
//
//        prompt = COMPANY_INFORMATION_PROMPT + "\n\nJob Description:\n\n"+ jobDescription;
//        response = await askChatGpt(session.chatGptApiKey, prompt);
//        document.getElementById("company-information").value = response;
//
//        prompt = MINIMUM_JOB_REQUIREMENTS_PROMPT + "\n\nJob Description:\n\n"+ jobDescription;
//        response = await askChatGpt(session.chatGptApiKey, prompt);
//        document.getElementById("minimum-requirements").value = response;
//
//        prompt = PREFERRED_JOB_REQUIREMENTS_PROMPT + "\n\nJob Description:\n\n"+ jobDescription;
//        response = await askChatGpt(session.chatGptApiKey, prompt);
//        document.getElementById("preferred-requirements").value = response;
    }

    copyTemplates() {

    }

    isExtractReady() {
        return this.job.description && this.chatGpt.isReady();
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
        this.job.title = app.job.title;

        // Third-party
        this.chatGpt.apiKey = app.chatGpt.apiKey;
        this.googleApi.load(app.googleApi);
        this.jobscan.cookie = app.jobscan.cookie;
        this.jobscan.xsrfToken = app.jobscan.xsrfToken;

        console.info("Application state loaded", this);
    }
}
