import View from './view.js'
import ChatGpt from './chatgptExtractor.js'
import Jobscan from './jobscan.js'
import GoogleWorkspace from './googleWorkspace.js'


class Controller {

    /* Manages complexities of application initialization, state, and behavior
        - Delegates complexity to separate objects when necessary
    */
    constructor(view, gapi, google) {
        this.view = view;
        this.view.load();
        this.workspace = new GoogleWorkspace(view, gapi, google);
        this.jobscan = new Jobscan(view);
        this.chatgpt = new ChatGpt(view);
    }

    /* State Setters
        - Each stateful "thing" (i.e. button, etc.) has a setter
        - Update runs through all of them
    */

    setNavigationPage(pageName) {
        console.log("Navigating to page " + pageName);
        this.view.navigationPage = pageName;
        this.view.save();
    }

    setExtractJobSectionsEnabled() {
        this.view.extractJobSectionsEnabled = this.view.chatgptApiKey && this.jobDescription;
    }

    /* Field setters
        - Setters should exist for every field.
        - View should only use setters.
        - Setters do not perform work like handlers.
        - Setters may toggle or change viewable state like enabling/disabling buttons
        - Setters run updateEnabledState by convention
    */
    setCredentials(credentials) {
        this.view.chatgptApiKey = credentials.chatGpt.apiKey;
        this.view.googleApiKey = credentials.google.apiKey;
        this.view.googleClientId = credentials.google.clientId;
        this.view.jobscanCookie = credentials.jobscan.cookie;
        this.view.jobscanXsrfToken = credentials.jobscan.xsrfToken;

        this.view.googleSignInEnabled = true;
        this.view.googleRefreshEnabled = false;
        this.view.googleSignOutEnabled = false;
        this.view.save();
    }

    updateCompanyNamePossessive() {
        let companyName = this.view.companyName;
        if (companyName == "") {
            this.view.companyNamePossessive = "";
        } else if (companyName.endsWith("s")) {
            this.view.companyNamePossessive = companyName + "'";
        } else {
            this.view.companyNamePossessive = companyName + "'s";
        }
    }

    setCompanyName(companyName) {
        this.view.companyName = companyName;
        this.updateCompanyNamePossessive();
        this.updateCreateResumeEnabled();
        this.updateTailorEnabled();
        this.view.save();
        // If changed, check for file
        // If file, disable button
        // If no file, enable button
    }
    
    setResumeTemplateName(resumeTemplateName) {
        this.view.resumeTemplateName = resumeTemplateName;
        this.view.save();
    }
    
    setCoverLetterTemplateName(coverLetterTemplateName) { 
        this.view.coverLetterTemplateName = coverLetterTemplateName;
        this.view.save();
    }
    
    setApplicationLogName(applicationLogName) { 
        this.view.applicationLogName = applicationLogName;
        this.view.save();
    }
    
    setJobDescription(jobDescription) { 
        this.view.jobDescription = jobDescription;
        if (!this.view.jobDescription) {
            this.view.extractJobSectionsEnabled = false;
        } else {
            this.view.extractJobSectionsEnabled = true;
        }
        this.updateTailorEnabled();
        this.view.save();
    }
    
    setJobTitle(jobTitle) {
        this.view.jobTitle = jobTitle;
        this.view.completeJobTitle = jobTitle;
        this.view.shortJobTitle = jobTitle;
        this.updateTailorEnabled();
        this.view.save();
    }

    setCompanyAddress(companyAddress) {
        this.view.companyAddress = companyAddress;
        this.updateTailorEnabled();
        this.view.save();
    }

    setCompanyValues(companyValues) {
        this.view.companyValues = companyValues;
        this.updateTailorEnabled();
        this.view.save();
    }

    setRelevantExperience(relevantExperience) {
        this.view.relevantExperience = relevantExperience;
        this.updateTailorEnabled();
        this.view.save();
    }
    
    setMinimumRequirements(minimumRequirements) {
        this.view.minimumRequirements = minimumRequirements;
        this.view.save();
    }

    setPreferredRequirements(preferredRequirements) {
        this.view.preferredRequirements = preferredRequirements;
        this.view.save();
    }

    setJobDuties(jobDuties) {
        this.view.jobDuties = jobDuties;
        this.view.save();
    }

    setCompanyInfo(companyInfo) {
        this.view.companyInfo = companyInfo;
        this.view.save();
    }

    setLinkedInProfileLink(linkedInProfileLink) {
        this.view.linkedInProfileLink = linkedInProfileLink;
        this.view.save();
    }

    setGithubProfileLink(githubProfileLink) {
        this.view.githubProfileLink = githubProfileLink;
        this.view.save();
    }

    setWebsiteProfileLink(websiteProfileLink) {
        this.view.websiteProfileLink = websiteProfileLink;
        this.view.save();
    }

    setHiringManager(hiringManager) {
        this.view.hiringManager = hiringManager;
        this.updateTailorEnabled();
        this.view.save();
    }

    async setGoogleSheetName(googleSheetName) {
        this.view.googleSheetName = googleSheetName;
        await this.updateLogSheetLink();
        this.view.save();
    }

    updateCreateResumeEnabled() {
        this.view.createResumeEnabled = Boolean(
            this.view.googleRefreshEnabled &&
            this.view.companyName &&
            this.view.companyName != "");
        this.view.save();
    }

    updateScanEnabled() {
        this.view.scanEnabled = Boolean(this.view.resumeId && this.view.minimumRequirements);
    }

    updateTailorEnabled() {
        this.view.tailorEnabled = Boolean(this.view.resumeId &&
                                          this.view.coverLetterId &&
                                          this.view.date &&
                                          this.view.companyName &&
                                          this.view.companyNamePossessive &&
                                          this.view.companyAddress &&
                                          this.view.hiringManager &&
                                          this.view.jobTitle &&
                                          this.view.completeJobTitle &&
                                          this.view.shortJobTitle &&
                                          this.view.companyValues &&
                                          this.view.relevantExperience
                                          )
    }

    async updateDocLinks() {
        let gdocPrefix = "https://docs.google.com/document/d/";
        let gdocSuffix = "/edit";
        this.view.tailoredResumeLink = gdocPrefix + this.view.resumeId + gdocSuffix;
        this.view.tailoredCoverLetterLink = gdocPrefix + this.view.coverLetterId + gdocSuffix;
        this.view.tailoredResumeDlButtonEnabled = true;
        this.view.tailoredCoverLetterDlButtonEnabled = true;
        this.view.resumePdfLink = await this.workspace.getPdfLink(this.view.resumeId);
        this.view.coverLetterPdfLink = await this.workspace.getPdfLink(this.view.coverLetterId);
        this.view.save();
    }

    async updateLogSheetLink() {
        let sheetsPrefix = "https://docs.google.com/spreadsheets/d/";
        let sheetSuffix = "/edit";
        let sheetId = await this.workspace.getDocumentIdByName(this.view.googleSheetName);
        if (sheetId) {
            this.view.logApplicationEnabled = true;
            this.view.googleSheetLink = sheetsPrefix + sheetId + sheetSuffix;
        } else {
            this.view.logApplicationEnabled = false;
            this.view.googleSheetLink = "";
        }

        this.view.save();
    }

    /* Complex functions
        - Handles
    */
    async googleAuthorize() {
        try {
            await this.workspace.init();
            await this.workspace.authorize();
            this.view.googleSignInEnabled = false;
            this.view.googleRefreshEnabled = true;
            this.view.googleSignOutEnabled = true;
        } catch(err) {
            console.error("Failed to authorize Google: " + err.message);
            this.view.googleSignInEnabled = false;
            this.view.googleRefreshEnabled = false;
            this.view.googleSignOutEnabled = false;
        }

        this.updateCreateResumeEnabled();
        this.updateLogSheetLink();
        this.view.save();
    }

    googleSignOut() {}

    extractJobSections() {
        this.chatgpt.extractJobSections();
        this.updateCompanyNamePossessive();
        this.view.save();
    }

    async createResumeAndCoverLetter() {
        this.view.createResumeEnabled = false;
        this.view.save();

        try {
            await this.workspace.createResumeAndCoverLetter();
            await this.updateScanEnabled();
            await this.updateDocLinks();
        } catch(err) {
            console.error("Encountered error while creating resume and cover letter: " + err.message);
        }
    }

    async scanResume() {
        console.warn("Scan button Handler not implemented");

        this.view.resumeContent = await this.workspace.getPlaintextFileContents(this.view.resumeId);

        let results;
        let jobDescription = "";

        jobDescription = jobDescription + this.view.minimumRequirements;
        results = await this.jobscan.scan(this.view.resumeContent, jobDescription);
        this.view.minimumRequirementsScore = results['matchRate']['score'];
        this.view.minimumRequirementsKeywords = results;

        if (this.view.includePreferredRequirements && this.view.preferredRequirements) {
            jobDescription = jobDescription + this.view.preferredRequirements;
            results = await this.jobscan.scan(this.view.resumeContent, jobDescription);
            this.view.preferredRequirementsScore = results['matchRate']['score'];
            this.view.preferredRequirementsKeywords = results;
        }

        if (this.view.includeJobDuties && this.view.jobDuties) {
            jobDescription = jobDescription + this.view.jobDuties;
            results = await this.jobscan.scan(this.view.resumeContent, jobDescription);
            this.view.jobDutiesScore = results['matchRate']['score'];
            this.view.jobDutiesKeywords = results;
        }

        if (this.view.includeCompanyInfo && this.view.companyInfo) {
            jobDescription = jobDescription + this.view.companyInfo;
            results = await this.jobscan.scan(this.view.resumeContent, jobDescription);
            this.view.companyInfoScore = results['matchRate']['score'];
            this.view.companyInfoKeywords = results;
        }

    }

    tailorDocuments() {
        

        this.updateTailorEnabled();
        this.view.save();
    }

    logApplication() {
        console.warn("Log application is not yet implemented");
        this.view.logApplicationEnabled = false;
        this.view.save();
    }

}

export default Controller;