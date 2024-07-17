import GoogleApiWrapper from "./gapiWrapper.js";

import Company from "./company.js";
import Template from "./template.js";
import TailoredDocument from "./tailoredDocument.js";

const LINKEDIN_QUERY = "(software OR data) AND (founding OR senior OR principal OR staff OR L4 OR L5) AND (engineer OR architect)";

class WebApplication {

    constructor() {
        this.storageKey = "web-application-state";
        this.gapiWrapper = new GoogleApiWrapper(gapi, google);

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

    setGapi(gapi) {

    }

    setGoogle(google) {

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

export default WebApplication;
