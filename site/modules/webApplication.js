import GapiWrapper from "./gapiWrapper.js";
import Company from "./company.js";
import Template from "./template.js";
import TailoredDocument from "./tailoredDocument.js";
import JobPosting from "./jobPosting.js";

const LINKEDIN_QUERY = "(software OR data) AND (founding OR senior OR principal OR staff OR L4 OR L5) AND (engineer OR architect)";
const STORAGE_KEY = "web-application-state";

class WebApplication {

    constructor() {
        const date = new Date();  // Today
        const month = date.toLocaleString('default', { month: 'long' });

        this.company = new Company();
        this.gapiWrapper = new GapiWrapper();
        this.resumeTemplate = new Template();
        this.coverLetterTemplate = new Template();
        this.jobPosting = new JobPosting();
        this.resumeTailoredDocument = new TailoredDocument();
        this.coverLetterTailoredDocument = new TailoredDocument();
    }

    setStateChangeCallback(callback) {
        this.stateChangeCallback = callback;
        if (this.gapiWrapper) {
            this.gapiWrapper.setApiInitCallback = callback;
            this.gapiWrapper.setClientInitCallback = callback;
            this.gapiWrapper.setAuthenticatedCallback = callback;
            this.gapiWrapper.setTokenClientCallback = callback;
        }
    }

    setGapiWrapper(gapiWrapper) {
        this.gapiWrapper = gapiWrapper;
    }

    setCompany(company) {
        this.company = company;
    }

    setResumeTemplate(template) {
        this.resumeTemplate = template;
    }
    
    setCoverLetterTemplate(template) {
        this.coverLetterTemplate = template;
    }
    
    setResumeTailoredDocument(tailoredDocument) {
        this.resumeTailoredDocument = tailoredDocument;
    }
    
    setCoverLetterTailoredDocument(tailoredDocument) {
        this.coverLetterTailoredDocument = tailoredDocument;
    }

    setJobPosting(jobPosting) {
        this.jobPosting = jobPosting;
    }

    isSignInReady() {
        return this.gapiWrapper && this.gapiWrapper.isSignInReady();
    }

    isRefreshReady() {
        return this.gapiWrapper && this.gapiWrapper.isRefreshReady();
    }

    isSignOutReady() {
        return this.gapiWrapper && this.gapiWrapper.isSignOutReady();
    }

    getResumeTemplateName() {
        return this.resumeTemplate.name;
    }

    getCoverLetterTemplateName() {
        return this.coverLetterTemplate.name;
    }

    getLinkedInQuery() {
        return LINKEDIN_QUERY;
    }

    getCompanyName() {
        return this.company.name;
    }

    getJobDescription() {
        return this.jobPosting.description;
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
        localStorage.removeItem(STORAGE_KEY);
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this, this.replacer));
        console.log("Saved application state to local storage");
    }
    
    tryLoad() {
        let storedState = localStorage.getItem(STORAGE_KEY);
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
        if (!webApplicationJson) {
            throw new Error("Missing web application JSON input string");
        }

        if (typeof webApplicationJson != 'string') {
            throw new Error("Web application JSON parameter is not a string");
        }

        let storedApp = JSON.parse(webApplicationJson);
        console.debug("WebApplication.load - Deep copying from JSON object:", storedApp);

        // Setup company
        if (storedApp.company) {
            this.company = Company.createFromObject(storedApp.company);
            console.log("Company successfully loaded");
        } else {
            this.company = new Company();
            console.log("Company not found, initialized new company");
        }
        
        // Setup Google API Wrapper
        if (storedApp.gapiWrapper) {
            this.gapiWrapper = GapiWrapper.createFromObject(storedApp.gapiWrapper);
            console.log("GapiWrapper successfully loaded");
        } else {
            this.gapiWrapper = new GapiWrapper();
            console.log("GapiWrapper not found, initialized new gapiWrapper");
        }

        // Setup Resume Template
        if (storedApp.resumeTemplate) {
            this.resumeTemplate = Template.createFromObject(storedApp.resumeTemplate);
        } else {
            this.resumeTemplate = new Template();
        }
        
        // Setup Cover Letter Template
        if (storedApp.coverLetterTemplate) {
            this.coverLetterTemplate = Template.createFromObject(storedApp.coverLetterTemplate);
        } else {
            this.coverLetterTemplate = new Template();
        }
        
        // Setup Job Posting
        if (storedApp.jobPosting) {
            this.jobPosting = JobPosting.createFromObject(storedApp.jobPosting);
        } else {
            this.jobPosting = new JobPosting();
        }
        
        // Setup Resume TailoredDocument
        if (storedApp.resumeTailoredDocument) {
            this.resumeTailoredDocument = TailoredDocument.createFromObject(storedApp.resumeTailoredDocument);
        } else {
            this.resumeTailoredDocument = new TailoredDocument();
        }
        
        // Setup Cover Letter TailoredDocument
        if (storedApp.coverLetterTailoredDocument) {
            this.coverLetterTailoredDocument = TailoredDocument.createFromObject(storedApp.coverLetterTailoredDocument);
        } else {
            this.coverLetterTailoredDocument = new TailoredDocument();
        }

//        // Third-party
//        this.chatGpt.apiKey = app.chatGpt.apiKey;
//        this.googleApi.load(app.googleApi);
//        this.jobscan.cookie = app.jobscan.cookie;
//        this.jobscan.xsrfToken = app.jobscan.xsrfToken;

        console.info("Application state loaded", this);
    }
}

export default WebApplication;
