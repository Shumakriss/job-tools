import Model from './model.js'
import ChatGpt from './chatgptExtractor.js'
import Jobscan from './jobscan.js'
import GoogleWorkspace from './googleWorkspace.js'


class Controller {

    constructor(model, view, gapi, google) {
        this.model = model;
        this.view = view;
        this.model.load();
        this.workspace = new GoogleWorkspace(model, gapi, google);
        this.jobscan = new Jobscan(model);
        this.chatgpt = new ChatGpt(model);
    }
    
    save() {
        this.model.save();
    }
    
    render() {
        this.view.render();
    }

    setCredentials(credentials) {
        this.model.chatgptApiKey = credentials.chatGpt.apiKey;
        this.model.googleApiKey = credentials.google.apiKey;
        this.model.googleClientId = credentials.google.clientId;
        this.model.jobscanCookie = credentials.jobscan.cookie;
        this.model.jobscanXsrfToken = credentials.jobscan.xsrfToken;
        this.save();
        this.render();
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
        this.save();
        this.render();
    }

    async updateCompanyCorrespondence() {
        if (!this.model.companyName || !this.model.googleSheetId){
            this.model.companyCorrespondence = "";
        } else {
            this.model.companyCorrespondence = await this.workspace.getCompanyCorrespondence(this.model.companyName);
        }

        this.save();
        this.render();
    }

    async setCompanyName(companyName) {
        this.model.companyName = companyName;
        this.save();
        this.render();

        this.updateDocumentNames();
        this.updateCompanyNamePossessive();
        this.updateDocLinks();
        this.updateCompanyCorrespondence();
    }
    
    setResumeTemplateName(resumeTemplateName) {
        this.model.resumeTemplateName = resumeTemplateName;
        this.save();
        this.render();
        this.updateDocLinks();
    }
    
    setCoverLetterTemplateName(coverLetterTemplateName) {
        this.model.coverLetterTemplateName = coverLetterTemplateName;
        this.save();
        this.render();
        this.updateDocLinks();
    }
    
    setApplicationLogName(applicationLogName) { 
        this.model.applicationLogName = applicationLogName;
        this.save();
        this.render();
    }
    
    setJobDescription(jobDescription) {
        this.model.jobDescription = jobDescription;
        this.save();
        if (jobDescription && jobDescription != "" && this.model.resumeTemplateName) {
            this.scanResumeTemplate();
        }
        this.save();
        this.render();
    }
    
    setJobTitle(jobTitle) {
        this.model.jobTitle = jobTitle;
        this.model.completeJobTitle = jobTitle;
        this.model.shortJobTitle = jobTitle;
        this.save();
        this.render();
    }

    setCompanyValues(companyValues) {
        this.model.companyValues = companyValues;
        this.save();
        this.render();
    }

    setRelevantExperience(relevantExperience) {
        this.model.relevantExperience = relevantExperience;
        this.save();
        this.render();
    }
    
    setMinimumRequirements(minimumRequirements) {
        this.model.minimumRequirements = minimumRequirements;
        this.save();
        this.render();
    }

    setPreferredRequirements(preferredRequirements) {
        this.model.preferredRequirements = preferredRequirements;
        this.save();
        this.render();
    }

    setJobDuties(jobDuties) {
        this.model.jobDuties = jobDuties;
        this.save();
        this.render();
    }

    setCompanyInfo(companyInfo) {
        this.model.companyInfo = companyInfo;
        this.save();
        this.render();
    }

    setLinkedInProfileLink(linkedInProfileLink) {
        this.model.linkedInProfileLink = linkedInProfileLink;
        this.save();
    }

    setGithubProfileLink(githubProfileLink) {
        this.model.githubProfileLink = githubProfileLink;
        this.save();
    }

    setWebsiteProfileLink(websiteProfileLink) {
        this.model.websiteProfileLink = websiteProfileLink;
        this.save();
    }

    setHiringManager(hiringManager) {
        this.model.hiringManager = hiringManager;
        this.save();
        this.render();
    }

    async setGoogleSheetName(googleSheetName) {
        this.model.googleSheetName = googleSheetName;
        this.save();
        this.render();
        this.updateLogSheetLink();
    }

    async updateDocLinks() {
        const gdocPrefix = "https://docs.google.com/document/d/";
        const gdocSuffix = "/edit";

        if (this.model.companyName && this.model.resumeId) {
            this.model.tailoredResumeLink = gdocPrefix + this.model.resumeId + gdocSuffix;
            this.model.tailoredResumeDlButtonEnabled = true;
            this.model.resumePdfLink = await this.workspace.getPdfLink(this.model.resumeId);
            this.model.tailoredResumeLinkText = this.model.resumeName;
        } else {
            this.model.tailoredResumeLink = "";
            this.model.tailoredResumeDlButtonEnabled = false;
            this.model.resumePdfLink = null;
            this.model.tailoredResumeLinkText = "Tailored Resume Not Ready";
        }

        if (this.model.companyName && this.model.coverLetterId) {
            this.model.tailoredCoverLetterLink = gdocPrefix + this.model.coverLetterId + gdocSuffix;
            this.model.tailoredCoverLetterDlButtonEnabled = true;
            this.model.coverLetterPdfLink = await this.workspace.getPdfLink(this.model.coverLetterId);
            this.model.tailoredCoverLetterLinkText = this.model.coverLetterName;
        } else {
            this.model.tailoredCoverLetterLink = "";
            this.model.tailoredCoverLetterDlButtonEnabled = false;
            this.model.coverLetterPdfLink = null;
            this.model.tailoredCoverLetterLinkText = "Tailored Cover Letter Not Ready";
        }

        this.save();
        this.render();
    }

    async updateLogSheetLink() {
        let sheetsPrefix = "https://docs.google.com/spreadsheets/d/";
        let sheetSuffix = "/edit";
        this.model.googleSheetLink = "";
        this.model.googleSheetLinkText = "Log Sheet Not Ready";
        this.save();
        this.render();

        this.model.googleSheetId = await this.workspace.getDocumentIdByName(this.model.googleSheetName);

        if (this.model.googleSheetId) {
            this.model.googleSheetLink = sheetsPrefix + this.model.googleSheetId + sheetSuffix;
            this.model.googleSheetLinkText = this.model.googleSheetName;
        } else {
            this.model.googleSheetLink = "";
            this.model.googleSheetLinkText = "Log Sheet Not Ready";
        }

        this.updateCompanyCorrespondence();

        this.save();
        this.render();
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

        this.save();
        this.render();
    }

    /* Complex functions
        - Handles
    */
    async googleAuthorize() {
        try {
            await this.workspace.init();
            await this.workspace.authorize();
        } catch(err) {
            console.error("Failed to authorize Google: " + err.message);
        }

        
        await this.updateLogSheetLink();
        this.save();
        this.render();
    }

    googleSignOut() {}

    async extractJobSections() {
        this.model.statusMessage = "Asking ChatGPT to split up job description...";
        this.render();

        let companyNamePromise = this.chatgpt.extractCompanyName(this.model.jobDescription);
        companyNamePromise.then( companyName => {
            this.setCompanyName(companyName);
            this.updateCompanyNamePossessive();
            
            this.save();
            this.render();
            this.updateDocLinks();
        });
        
        let jobTitlePromise = this.chatgpt.extractJobTitle(this.model.jobDescription);
        jobTitlePromise.then( jobTitle => {
            this.model.jobTitle = jobTitle;
            this.model.completeJobTitle = jobTitle;
            this.model.shortJobTitle = jobTitle;
            this.save();
            this.render();
        });

        let minimumRequirementsPromise = this.chatgpt.extractMinimumRequirements(this.model.jobDescription);
        minimumRequirementsPromise.then( minimumRequirements => {
            this.model.minimumRequirements = minimumRequirements;
            this.save();
            this.render();
        });

        let preferredRequirementsPromise = this.chatgpt.extractPreferredRequirements(this.model.jobDescription);
        preferredRequirementsPromise.then( preferredRequirements => {
            this.model.preferredRequirements = preferredRequirements;
            this.save();
            this.render();
        });

        let jobDutiesPromise = this.chatgpt.extractJobDuties(this.model.jobDescription);
        jobDutiesPromise.then( jobDuties => {
            this.model.jobDuties = jobDuties;
            this.save();
            this.render();
        });

        let companyInfoPromise = this.chatgpt.extractCompanyInfo(this.model.jobDescription);
        companyInfoPromise.then( companyInfo => {
            this.model.companyInfo = companyInfo;
            this.save();
            this.render();
        });

        let companyValuesPromise = this.chatgpt.extractCompanyValues(this.model.companyName);
        companyValuesPromise.then( companyValues => {
            this.model.companyValues = companyValues;
            this.save();
            this.render();
        });

        let relevantExperiencePromise = this.chatgpt.extractRelevantExperience(this.model.jobDescription);
        relevantExperiencePromise.then( relevantExperience => {
            this.model.relevantExperience = relevantExperience;
            this.save();
            this.render();
        });

        Promise.all([
                companyNamePromise,
                jobTitlePromise,
                minimumRequirementsPromise,
                preferredRequirementsPromise,
                jobDutiesPromise,
                companyInfoPromise,
                companyValuesPromise,
                relevantExperiencePromise
            ]).then( results =>{
                this.model.statusMessage = "Job description sections extracted";
                this.save();
                this.render();
        });

    }

    async createResume() {
        this.model.resumeTemplateId = await this.workspace.getDocumentIdByName(this.model.resumeTemplateName);
        this.model.resumeId = await this.workspace.getDocumentIdByName(this.model.resumeName);

        if (this.model.resumeTemplateId && !this.model.resumeId) {
            this.model.resumeId = await this.workspace.copyFile(this.model.resumeTemplateId, this.model.resumeName);
        }
        this.save();
        this.render();
    }

    async createCoverLetter() {
        this.model.coverLetterTemplateId = await this.workspace.getDocumentIdByName(this.model.coverLetterTemplateName);
        this.model.coverLetterId = await this.workspace.getDocumentIdByName(this.model.coverLetterName);

        if (this.model.coverLetterTemplateId && !this.model.coverLetterId) {
            this.model.coverLetterId = await this.workspace.copyFile(this.model.coverLetterTemplateId, this.model.coverLetterName);
        }
        this.save();
        this.render();
    }

    async createResumeAndCoverLetter() {
        this.save();

        this.model.statusMessage = "Checking for resume...";
        this.render();

        try {
            Promise.all([
                this.createResume(),
                this.createCoverLetter()
            ]).then( () => {
                this.model.statusMessage = "Documents ready to scan and tailor";
                this.render();
                this.save();
                this.render();
                this.updateDocLinks();
            });

        } catch(err) {
            console.error("Encountered error while creating resume and cover letter: " + err.message);
            this.model.statusMessage = "Problem finding/creating documents";
            this.render();
        }

    }

    async scanResumeTemplate() {
        this.model.statusMessage = "Scanning resume template...";
        this.render();

        if (this.model.resumeTemplateName && !this.model.resumeTemplateId) {
            this.model.statusMessage = "Looking for resume template...";
            this.render();
            this.model.resumeTemplateId = await this.workspace.getDocumentIdByName(this.model.resumeTemplateName);
        }

        this.model.statusMessage = "Template found, fetching contents...";
        this.render();

        this.model.resumeContent = await this.workspace.getPlaintextFileContents(this.model.resumeTemplateId);

        this.model.statusMessage = "Template contents acquired, scanning against job description";
        this.render();

        let results = await this.jobscan.scan(this.model.resumeContent, this.model.jobDescription);

        this.model.statusMessage = "Resume template scan complete";

        this.model.minimumRequirementsScore = results['matchRate']['score'];
        this.model.minimumRequirementsKeywords = results;
        this.model.preferredRequirementsScore = "";
        this.model.preferredRequirementsKeywords = "";
        this.model.jobDutiesScore = "";
        this.model.jobDutiesKeywords = "";
        this.model.companyInfoScore = "";
        this.model.companyInfoKeywords = "";

        this.save();
        this.render();
    }

    async scanResume() {

        if (!this.model.resumeId) {
            this.model.statusMessage = "Resume scan missing required fields or documents";
            this.render();
            return;
        }

        this.model.statusMessage = "Scanning resume...";
        this.render();

        this.model.resumeContent = await this.workspace.getPlaintextFileContents(this.model.resumeId);

        let jobDescription = "";
        let promises = [];

        jobDescription = jobDescription + this.model.minimumRequirements;

        let minimumScanPromise = this.jobscan.scan(this.model.resumeContent, jobDescription);
        promises.push(minimumScanPromise);
        minimumScanPromise.then( results => {
            this.model.minimumRequirementsScore = results['matchRate']['score'];
            this.model.minimumRequirementsKeywords = results;
            this.save();
            this.render();
        });

        if (this.model.includePreferredRequirements && this.model.preferredRequirements) {
            jobDescription = jobDescription + this.model.preferredRequirements;

            let preferredRequirementsPromise = this.jobscan.scan(this.model.resumeContent, jobDescription);
            promises.push(preferredRequirementsPromise);
            preferredRequirementsPromise.then( results => {
                this.model.preferredRequirementsScore = results['matchRate']['score'];
                this.model.preferredRequirementsKeywords = results;
                this.save();
                this.render();
            });
        }

        if (this.model.includeJobDuties && this.model.jobDuties) {
            jobDescription = jobDescription + this.model.preferredRequirements;

            let jobDutiesPromise = this.jobscan.scan(this.model.resumeContent, jobDescription);
            promises.push(jobDutiesPromise);
            jobDutiesPromise.then( results => {
                this.model.jobDutiesScore = results['matchRate']['score'];
                this.model.jobDutiesKeywords = results;
                this.save();
                this.render();
            });
        }

        if (this.model.includeCompanyInfo && this.model.companyInfo) {
            jobDescription = jobDescription + this.model.preferredRequirements;

            let companyInfoPromise = this.jobscan.scan(this.model.resumeContent, jobDescription);
            promises.push(companyInfoPromise);
            companyInfoPromise.then( results => {
                this.model.companyInfoScore = results['matchRate']['score'];
                this.model.companyInfoKeywords = results;
                this.save();
                this.render();
            });
        }

        Promise.all(promises).then( results =>{
            this.model.statusMessage = "All resume scans complete";
            this.save();
            this.render();
        });

    }

    async tailorDocuments() {
        console.log("Tailoring documents");
        this.model.statusMessage = "Tailoring documents...";
        this.render();

        Promise.all([
            this.workspace.mergeTextInTemplate(this.model.resumeId),
            this.workspace.mergeTextInTemplate(this.model.coverLetterId)
        ]).then( () => {
            this.model.statusMessage = "Finished tailoring documents";
            this.save();
            this.render();
        });

        console.log("Document tailoring complete");
    }

    async logApplication() {
        console.debug("Logging job application to Google Sheets");
        await this.workspace.appendApplicationLog();
        this.updateCompanyCorrespondence();
        this.save();
        this.render();
    }

    reset() {
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
        this.model.companyCorrespondence = "";

        this.model.statusMessage = "Start your application!";
        this.save();
        this.render();
    }

}

export default Controller;