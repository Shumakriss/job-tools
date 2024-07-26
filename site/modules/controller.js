import Model from './model.js'
import ChatGpt from './chatgptExtractor.js'
import Jobscan from './jobscan.js'
import GoogleWorkspace from './googleWorkspace.js'


class Controller {

    /* Manages complexities of application initialization, state, and behavior
        - Delegates complexity to separate objects when necessary
    */
    constructor(model, gapi, google) {
        this.model = model;
        this.model.load();
        this.workspace = new GoogleWorkspace(model, gapi, google);
        this.jobscan = new Jobscan(model);
        this.chatgpt = new ChatGpt(model);
    }

    /* State Setters
        - Each stateful "thing" (i.e. button, etc.) has a setter
        - Update runs through all of them
    */

    setNavigationPage(pageName) {
        console.log("Navigating to page " + pageName);
        this.model.navigationPage = pageName;
        this.model.save();
    }

    setExtractJobSectionsEnabled() {
        this.model.extractJobSectionsEnabled = this.model.chatgptApiKey && this.jobDescription;
    }

    setCredentials(credentials) {
        this.model.chatgptApiKey = credentials.chatGpt.apiKey;
        this.model.googleApiKey = credentials.google.apiKey;
        this.model.googleClientId = credentials.google.clientId;
        this.model.jobscanCookie = credentials.jobscan.cookie;
        this.model.jobscanXsrfToken = credentials.jobscan.xsrfToken;

        this.model.googleSignInEnabled = true;
        this.model.googleRefreshEnabled = false;
        this.model.googleSignOutEnabled = false;
        this.model.save();
    }

    updateCompanyNamePossessive() {
        let companyName = this.model.companyName;
        if (companyName == "") {
            this.model.companyNamePossessive = "";
        } else if (companyName.endsWith("s")) {
            this.model.companyNamePossessive = companyName + "'";
        } else {
            this.model.companyNamePossessive = companyName + "'s";
        }
    }

    async setCompanyName(companyName) {
        this.model.companyName = companyName;
        this.updateDocumentNames();
        this.updateCompanyNamePossessive();
        this.updateCreateResumeEnabled();
        await this.updateTailorEnabled();
        await this.updateDocLinks();
        this.model.save();
        // If changed, check for file
        // If file, disable button
        // If no file, enable button
    }
    
    async setResumeTemplateName(resumeTemplateName) {
        this.model.resumeTemplateName = resumeTemplateName;
        await this.updateDocLinks();
        await this.updateTailorEnabled();
        this.model.save();
    }
    
    async setCoverLetterTemplateName(coverLetterTemplateName) {
        this.model.coverLetterTemplateName = coverLetterTemplateName;
        await this.updateDocLinks();
        await this.updateTailorEnabled();
        this.model.save();
    }
    
    setApplicationLogName(applicationLogName) { 
        this.model.applicationLogName = applicationLogName;
        this.model.save();
    }
    
    async setJobDescription(jobDescription) {
        this.model.jobDescription = jobDescription;
        if (!this.model.jobDescription) {
            this.model.extractJobSectionsEnabled = false;
        } else {
            this.model.extractJobSectionsEnabled = true;
        }
        await this.updateTailorEnabled();
        this.model.save();
    }
    
    async setJobTitle(jobTitle) {
        this.model.jobTitle = jobTitle;
        this.model.completeJobTitle = jobTitle;
        this.model.shortJobTitle = jobTitle;
        await this.updateTailorEnabled();
        this.model.save();
    }

    async setCompanyAddress(companyAddress) {
        this.model.companyAddress = companyAddress;
        await this.updateTailorEnabled();
        this.model.save();
    }

    async setCompanyValues(companyValues) {
        this.model.companyValues = companyValues;
        await this.updateTailorEnabled();
        await this.model.save();
    }

    async setRelevantExperience(relevantExperience) {
        this.model.relevantExperience = relevantExperience;
        await this.updateTailorEnabled();
        this.model.save();
    }
    
    setMinimumRequirements(minimumRequirements) {
        this.model.minimumRequirements = minimumRequirements;
        this.model.save();
    }

    setPreferredRequirements(preferredRequirements) {
        this.model.preferredRequirements = preferredRequirements;
        this.model.save();
    }

    setJobDuties(jobDuties) {
        this.model.jobDuties = jobDuties;
        this.model.save();
    }

    setCompanyInfo(companyInfo) {
        this.model.companyInfo = companyInfo;
        this.model.save();
    }

    setLinkedInProfileLink(linkedInProfileLink) {
        this.model.linkedInProfileLink = linkedInProfileLink;
        this.model.save();
    }

    setGithubProfileLink(githubProfileLink) {
        this.model.githubProfileLink = githubProfileLink;
        this.model.save();
    }

    setWebsiteProfileLink(websiteProfileLink) {
        this.model.websiteProfileLink = websiteProfileLink;
        this.model.save();
    }

    setHiringManager(hiringManager) {
        this.model.hiringManager = hiringManager;
        this.updateTailorEnabled();
        this.model.save();
    }

    async setGoogleSheetName(googleSheetName) {
        this.model.googleSheetName = googleSheetName;
        await this.updateLogSheetLink();
        this.model.save();
    }

    updateCreateResumeEnabled() {
        this.model.createResumeEnabled = Boolean(
            this.model.googleRefreshEnabled &&
            this.model.companyName &&
            this.model.companyName != "");
        this.model.save();
    }

    updateScanEnabled() {
        this.model.scanEnabled = Boolean(this.model.resumeId && this.model.minimumRequirements);
    }

    updateTailorEnabled() {
        this.model.tailorEnabled = Boolean(this.model.resumeId &&
                                          this.model.coverLetterId &&
                                          this.model.date &&
                                          this.model.companyName &&
                                          this.model.companyNamePossessive &&
                                          this.model.companyAddress &&
                                          this.model.hiringManager &&
                                          this.model.jobTitle &&
                                          this.model.completeJobTitle &&
                                          this.model.shortJobTitle &&
                                          this.model.companyValues &&
                                          this.model.relevantExperience
                                          )
    }

    async updateDocLinks() {
        const gdocPrefix = "https://docs.google.com/document/d/";
        const gdocSuffix = "/edit";
        if (this.model.companyName && this.model.resumeId) {
            this.model.tailoredResumeLink = gdocPrefix + this.model.resumeId + gdocSuffix;
            this.model.tailoredResumeDlButtonEnabled = true;
            this.model.resumePdfLink = await this.workspace.getPdfLink(this.model.resumeId);
        } else {
            this.model.tailoredResumeLink = "";
            this.model.tailoredResumeDlButtonEnabled = false;
            this.model.resumePdfLink = null;
        }

        if (this.model.companyName && this.model.coverLetterId) {
            this.model.tailoredCoverLetterLink = gdocPrefix + this.model.coverLetterId + gdocSuffix;
            this.model.tailoredCoverLetterDlButtonEnabled = true;
            this.model.coverLetterPdfLink = await this.workspace.getPdfLink(this.model.coverLetterId);
        } else {
            this.model.tailoredCoverLetterLink = "";
            this.model.tailoredCoverLetterDlButtonEnabled = false;
            this.model.coverLetterPdfLink = null;
        }

        this.model.save();
    }

    async updateLogSheetLink() {
        let sheetsPrefix = "https://docs.google.com/spreadsheets/d/";
        let sheetSuffix = "/edit";
        this.model.googleSheetId = await this.workspace.getDocumentIdByName(this.model.googleSheetName);
        if (this.model.googleSheetId) {
            this.model.logApplicationEnabled = true;
            this.model.googleSheetLink = sheetsPrefix + this.model.googleSheetId + sheetSuffix;
        } else {
            this.model.logApplicationEnabled = false;
            this.model.googleSheetLink = "";
        }

        this.model.save();
    }

    updateDocumentNames() {
        if (this.model.companyName && this.model.resumeTemplateName) {
            this.model.resumeName = this.model.companyName + " " + this.model.resumeTemplateName;
        } else {
            this.model.resumeName = "";
        }
        this.model.resumeName = this.model.resumeName.replace(" Template", "");

        if (this.model.companyName && this.model.coverLetterTemplateName) {
            this.model.coverLetterName = this.model.companyName + " " + this.model.coverLetterTemplateName;
        } else {
            this.model.coverLetterName = "";
        }
        this.model.coverLetterName = this.model.coverLetterName.replace(" Template", "");

        this.model.save();
    }

    /* Complex functions
        - Handles
    */
    async googleAuthorize() {
        try {
            await this.workspace.init();
            await this.workspace.authorize();
            this.model.googleSignInEnabled = false;
            this.model.googleRefreshEnabled = true;
            this.model.googleSignOutEnabled = true;
        } catch(err) {
            console.error("Failed to authorize Google: " + err.message);
            this.model.googleSignInEnabled = false;
            this.model.googleRefreshEnabled = false;
            this.model.googleSignOutEnabled = false;
        }

        this.updateCreateResumeEnabled();
        this.updateLogSheetLink();
        this.model.save();
    }

    googleSignOut() {}

    async extractJobSections() {
//
//        Promise.all([
//            this.chatgpt.extractCompanyName(this.model.jobDescription),
//            this.chatgpt.extractJobTitle(this.model.jobDescription),
//            this.chatgpt.extractMinimumRequirements(this.model.jobDescription),
//            this.chatgpt.extractPreferredRequirements(this.model.jobDescription),
//            this.chatgpt.extractJobDuties(this.model.jobDescription),
//            this.chatgpt.extractCompanyInfo(this.model.jobDescription)
//        ]).then( values => console.log(values));

        let companyName = await this.chatgpt.extractCompanyName(this.model.jobDescription);

        if (this.model.companyName != companyName) {
            this.model.companyName = companyName;
            this.model.resumeLink = "";
            this.model.resumeId = null;
            this.model.coverLetterLink = "";
            this.model.coverLetterId = null;
        }

        await this.updateCompanyNamePossessive();
        await this.updateCreateResumeEnabled();
        await this.updateDocLinks();

        this.model.jobTitle = await this.chatgpt.extractJobTitle(this.model.jobDescription);
        this.model.completeJobTitle = this.model.jobTitle;
        this.model.shortJobTitle = this.model.jobTitle;

        this.model.minimumRequirements = await this.chatgpt.extractMinimumRequirements(this.model.jobDescription);
        this.model.preferredRequirements = await this.chatgpt.extractPreferredRequirements(this.model.jobDescription);
        this.model.jobDuties = await this.chatgpt.extractJobDuties(this.model.jobDescription);
        this.model.companyInfo = await this.chatgpt.extractCompanyInfo(this.model.jobDescription);

        await this.updateTailorEnabled();

        this.model.save();
    }

    async createResumeAndCoverLetter() {
        this.model.createResumeEnabled = false;
        this.model.save();

        try {
            await this.workspace.createResumeAndCoverLetter();
            await this.updateScanEnabled();
            await this.updateTailorEnabled();
            await this.updateDocLinks();
            this.model.save();
        } catch(err) {
            console.error("Encountered error while creating resume and cover letter: " + err.message);
        }

    }

    async scanResume() {
        console.warn("Scan button Handler not implemented");

        this.model.resumeContent = await this.workspace.getPlaintextFileContents(this.model.resumeId);

        let results;
        let jobDescription = "";

        jobDescription = jobDescription + this.model.minimumRequirements;
        results = await this.jobscan.scan(this.model.resumeContent, jobDescription);
        this.model.minimumRequirementsScore = results['matchRate']['score'];
        this.model.minimumRequirementsKeywords = results;

        if (this.model.includePreferredRequirements && this.model.preferredRequirements) {
            jobDescription = jobDescription + this.model.preferredRequirements;
            results = await this.jobscan.scan(this.model.resumeContent, jobDescription);
            this.model.preferredRequirementsScore = results['matchRate']['score'];
            this.model.preferredRequirementsKeywords = results;
        }

        if (this.model.includeJobDuties && this.model.jobDuties) {
            jobDescription = jobDescription + this.model.jobDuties;
            results = await this.jobscan.scan(this.model.resumeContent, jobDescription);
            this.model.jobDutiesScore = results['matchRate']['score'];
            this.model.jobDutiesKeywords = results;
        }

        if (this.model.includeCompanyInfo && this.model.companyInfo) {
            jobDescription = jobDescription + this.model.companyInfo;
            results = await this.jobscan.scan(this.model.resumeContent, jobDescription);
            this.model.companyInfoScore = results['matchRate']['score'];
            this.model.companyInfoKeywords = results;
        }

    }

    async tailorDocuments() {
        console.log("Tailoring documents");
        await this.workspace.mergeTextInTemplate(this.model.resumeId);
        await this.workspace.mergeTextInTemplate(this.model.coverLetterId);
        await this.updateTailorEnabled();
        this.model.save();
        console.log("Document tailoring complete");
    }

    async logApplication() {
        console.debug("Logging job application to Google Sheets");
        await this.workspace.appendApplicationLog();
        this.model.logApplicationEnabled = false;
        this.model.save();
    }

    async reset() {
        this.model.jobDescription = "";
        this.model.companyName = "";
        this.model.jobTitle = "";
        this.model.minimumRequirements = "";
        this.model.preferredRequirements = "";
        this.model.jobDuties = "";
        this.model.companyInfo = "";
        this.model.resumeName = "";
        this.model.resumeId = null;
        this.model.coverLetterName = "";
        this.model.coverLetterId = null;
        this.model.companyNamePossessive = "";
        this.model.companyAddress = "";
        this.model.hiringManager = "Hiring Manager";
        this.model.completeJobTitle = "";
        this.model.shortJobTitle = "";
        this.model.companyValues = "";
        this.model.relevantExperience = "";
        this.model.minimumRequirementsScore = "";
        this.model.preferredRequirementsScore = "";
        this.model.jobDutiesScore = "";
        this.model.companyInfoScore = "";
        this.model.minimumRequirementsKeywords = "";
        this.model.preferredRequirementsKeywords = "";
        this.model.jobDutiesKeywords = "";
        this.model.companyInfoKeywords = "";
        this.model.resumePdfLink = "";
        this.model.coverLetterPdfLink = "";

        this.model.extractJobSectionsEnabled = false;
        this.model.createResumeEnabled = false;
        this.model.scanEnabled = false;
        this.model.tailorEnabled = false;
        this.model.logApplicationEnabled = true;
        await this.model.save();
    }

}

export default Controller;