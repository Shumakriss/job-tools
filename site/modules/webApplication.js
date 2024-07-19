import GapiWrapper from "./gapiWrapper.js";
import Company from "./company.js";
import Extractor from "./extractor.js";
import JobPosting from "./jobPosting.js";
import Template from "./template.js";
import TailoredDocument from "./tailoredDocument.js";

const LINKEDIN_QUERY = "(software OR data) AND (founding OR senior OR principal OR staff OR L4 OR L5) AND (engineer OR architect)";
const STORAGE_KEY = "web-application-state";

class WebApplication {

    constructor() {
        this.gapiWrapper = new GapiWrapper();
        this.company = new Company();
        this.resumeTemplate = new Template();
        this.resumeTemplate.setGapiWrapper(this.gapiWrapper);
        this.coverLetterTemplate = new Template();
        this.coverLetterTemplate.setGapiWrapper(this.gapiWrapper);
        this.jobPosting = new JobPosting();
        this.resumeTailoredDocument = new TailoredDocument();
        this.coverLetterTailoredDocument = new TailoredDocument();
        this.extractor = new Extractor();
        this.gapi;
        this.google;
    }

    setStateChangeCallback(callback) {
        this.stateChangeCallback = callback;
        if (this.gapiWrapper) {
            this.gapiWrapper.setApiInitCallback(callback);
            this.gapiWrapper.setClientInitCallback(callback);
            this.gapiWrapper.setAuthenticatedCallback(callback);
            this.gapiWrapper.setTokenClientCallback(callback);
            this.gapiWrapper.setTokenClientCallback(this.stateChangeCallback);
        }
    }

    setGapiWrapper(gapiWrapper) {
        this.gapiWrapper = gapiWrapper;
        this.resumeTemplate.setGapiWrapper(gapiWrapper);
        this.coverLetterTemplate.setGapiWrapper(gapiWrapper);
    }

    setGapi(gapi) {
        this.gapi = gapi;
        this.gapiWrapper.setGapi(gapi);
    }

    setGoogle(google) {
        this.google = google;
        this.gapiWrapper.setGoogle(google);
    }

    setCompany(company) {
        this.company = company;
    }

    setCompanyName(name) {
        this.company.setName(name);
    }

    setJobTitle(title) {
        this.jobPosting.setTitle(title);
    }

    setMinimumRequirements(minimumRequirements) {
        this.jobPosting.setMinimumRequirements(minimumRequirements);
    }

    setPreferredRequirements(preferredRequirements) {
        this.jobPosting.setPreferredRequirements(preferredRequirements);
    }

    setJobDuties(jobDuties) {
        this.jobPosting.setJobDuties(jobDuties);
    }

    setCompanyInformation(companyInformation) {
        this.jobPosting.setCompanyInformation(companyInformation);
    }

    setResumeSuggestions(resumeSuggestions) {
        this.resumeSuggestions = resumeSuggestions;
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

    setJobDescription(jobDescription) {
        this.jobPosting.setDescription(jobDescription);
    }

    setResumeTemplateName(name) {
        this.resumeTemplate.setName(name);
    }

    setCoverLetterTemplateName(name) {
        this.coverLetterTemplate.setName(name);
    }

    setCredentials(credentials) {
        console.log("Updating app credentials");
        this.gapiWrapper.setApiKey(credentials.google.apiKey);
        this.gapiWrapper.setClientId(credentials.google.clientId);
        this.extractor.setApiKey(credentials.chatGpt.apiKey);
//            app.jobscan.xsrfToken = credentials.jobscan.xsrfToken;
//            app.jobscan.cookie = credentials.jobscan.cookie;
    }

    async isSignInReady() {
        return this.gapiWrapper && await this.gapiWrapper.isSignInReady();
    }

    async isRefreshReady() {
        return this.gapiWrapper && await this.gapiWrapper.isRefreshReady();
    }

    async isSignOutReady() {
        return this.gapiWrapper && await this.gapiWrapper.isSignOutReady();
    }

    getDate() {
        return this.coverLetterTailoredDocument.date;
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

    getJobTitle() {
        return this.jobPosting.title;
    }

    getMinimumRequirements() {
        return this.jobPosting.minimumRequirements;
    }

    getPreferredRequirements() {
        return this.jobPosting.preferredRequirements;
    }

    getJobDuties() {
        return this.jobPosting.responsibilities;
    }

    getCompanyInformation() {
        return this.company.about;
    }

    getCompanyNamePossessive() {
        return this.company.possessive;
    }

    getCompanyAddress() {
        return this.company.address;
    }

    getHiringManager() {
        return this.jobPosting.hiringManager;
    }

    getCompleteJobTitle() {
        return this.jobPosting.completeTitle;
    }

    getShortJobTitle() {
        return this.jobPosting.shortTitle;
    }

    getCompanyValues() {
        return this.company.values;
    }

    getRelevantExperience() {
        return this.jobPosting.relevantExperience;
    }

    copyTemplates() {

    }

    async isExtractReady() {

        if (!this.jobPosting) {
            console.warn("Extract is not ready because jobPosting is null");
            return false;
        }

        if (!this.jobPosting.description) {
            console.log("Cannot extract description without description");
            return false;
        }

        if (!await this.extractor.isReady()) {
            console.warn("Cannot extract because extractor is not ready");
            return false;
        }

        return true;
    }

    async isCreateResumeReady() {
        // TODO: Check for existing documents!
        return this.jobPosting.minimumRequirements && await this.resumeTemplate.isReady() && await this.coverLetterTemplate.isReady();
    }

    isScanReady() {
        return false;
    }

    async isTailorReady() {
        return await this.gapiWrapper.isReady() && await this.coverLetter.template.isReady();
    }

    scan() {
    }

    tailorTemplates() {
    }

    clearFromStorage() {
        localStorage.removeItem(STORAGE_KEY);
        console.log("Cleared application state from storage");
    }

    replacer(key, value) {
        if (key=="tokenClient"){
            console.debug("Skipping serialization of tokenClient");
            return undefined;
        } else if (key == "gapi") {
            console.debug("Skipping serialization of gapi");
            return undefined;
        } else if (key == "google") {
            console.debug("Skipping serialization of google");
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
    
    async tryLoad() {
        let storedState = localStorage.getItem(STORAGE_KEY);
        if (storedState) {
            console.log("Found application state in local storage.");
            await this.load(storedState);
            return true;
        } else {
            console.log("No application state found in local storage.");
            return false;
        }
    }

    async extractJobDescriptionSections() {
        console.log("Extracting job description sections");

        let companyName = await this.extractor.extractCompanyName(this.jobPosting.description);
        console.debug("Extracted companyName: " + companyName);
        this.setCompanyName(companyName);

        let jobTitle = await this.extractor.extractJobTitle(this.jobPosting.description);
        console.debug("Extracted jobTitle: " + jobTitle);
        this.setJobTitle(jobTitle);

        let minimumRequirements = await this.extractor.extractMinimumRequirements(this.jobPosting.description);
        console.debug("Extracted minimumRequirements: " + minimumRequirements);
        this.setMinimumRequirements(minimumRequirements);

        let preferredRequirements = await this.extractor.extractPreferredJobRequirements(this.jobPosting.description);
        console.debug("Extracted preferredRequirements: " + preferredRequirements);
        this.setPreferredRequirements(preferredRequirements);

        let jobDuties = await this.extractor.extractJobDuties(this.jobPosting.description);
        console.debug("Extracted jobDuties: " + jobDuties);
        this.setJobDuties(jobDuties);

        let companyInformation = await this.extractor.extractCompanyInformation(this.jobPosting.description);
        console.debug("Extracted companyInformation: " + companyInformation);
        this.setCompanyInformation(companyInformation);

    }

    async createTailoredDocuments() {

    }

    async load(webApplicationJson) {
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
        await this.gapiWrapper.setGapi(this.gapi);
        await this.gapiWrapper.setGoogle(this.google);
        console.debug("Assigning GapiWrapper callbacks");
        this.gapiWrapper.setApiInitCallback(this.stateChangeCallback);
        this.gapiWrapper.setClientInitCallback(this.stateChangeCallback);
        this.gapiWrapper.setAuthenticatedCallback(this.stateChangeCallback);
        this.gapiWrapper.setTokenClientCallback(this.stateChangeCallback);
        this.gapiWrapper.setTokenClientCallback(this.stateChangeCallback);

        await this.gapiWrapper.init();

        // Setup Resume Template
        if (storedApp.resumeTemplate) {
            this.resumeTemplate = Template.createFromObject(storedApp.resumeTemplate);
            this.resumeTemplate.setGapiWrapper(this.gapiWrapper);
        } else {
            this.resumeTemplate = new Template();
            this.resumeTemplate.setGapiWrapper(this.gapiWrapper);
        }
        
        // Setup Cover Letter Template
        if (storedApp.coverLetterTemplate) {
            this.coverLetterTemplate = Template.createFromObject(storedApp.coverLetterTemplate);
            this.resumeTemplate.setGapiWrapper(this.gapiWrapper);
        } else {
            this.coverLetterTemplate = new Template();
            this.coverLetterTemplate.setGapiWrapper(this.gapiWrapper);
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

        // Setup Extractor
        if (storedApp.extractor) {
            console.log("Discovered extractor, reusing");
            this.extractor = Extractor.createFromObject(storedApp.extractor);
        } else {
            this.extractor = new Extractor();
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
