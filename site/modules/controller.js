import Model from './model.js'
import ChatGpt from './chatgptExtractor.js'
import Jobscan from './jobscan.js'
import GoogleWorkspace from './googleWorkspace.js'

const GDOC_PREFIX = "https://docs.google.com/document/d/";
const GDOC_SUFFIX = "/edit";

class Controller {

    constructor(model, view, gapi, google) {
        this.model = model;
        this.view = view;
        this.model.load();
        this.workspace = new GoogleWorkspace(model, gapi, google);
        this.workspace.setAuthenticatedCallback( () => {
            this.onGoogleAuthorized();
        });
        this.jobscan = new Jobscan(model);
        this.chatgpt = new ChatGpt(model);
    }

    handleSave() {
        this.model.statusMessage = "Application saved to local storage";
        this.save();
        this.render();
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

    async updateResumeId() {
        this.model.resumeId = await this.workspace.getDocumentIdByName(this.model.resumeName());
        this.save();
        this.render();
        this.updateResumePdfLink();
        this.updateResumeContent();
    }


    async updateCoverLetterId() {
        this.model.coverLetterId = await this.workspace.getDocumentIdByName(this.model.coverLetterName());
        this.save();
        this.render();
        this.updateCoverLetterPdfLink();
    }

    async setCompanyName(companyName) {
        this.model.companyName = companyName;

        this.save();
        this.render();

        this.updateCompanyNamePossessive();
        this.updateResumeId();
        this.updateCoverLetterId();
        this.updateCompanyCorrespondence();
    }
    
    setResumeTemplateName(resumeTemplateName) {
        this.model.resumeTemplateName = resumeTemplateName;
        this.save();
        this.render();
        this.updateResumeTemplateId();
        this.updateResumeId();
    }

    setKeywordResumeName(keywordResumeName) {
        this.model.keywordResumeName = keywordResumeName;
        this.save();
        this.render();

        this.updateKeywordResumeId();
    }
    
    setCoverLetterTemplateName(coverLetterTemplateName) {
        this.model.coverLetterTemplateName = coverLetterTemplateName;
        this.save();
        this.render();
        this.updateCoverLetterTemplateId();
        this.updateCoverLetterId();
    }
    
    setApplicationLogName(applicationLogName) { 
        this.model.applicationLogName = applicationLogName;
        this.save();
        this.render();
    }

    async setJobPostUrl(jobPostUrl) {
        this.model.jobPostUrl = jobPostUrl;
        this.save();
    }

    async getJobDescription() {
        console.debug("Fetching job description");

        if (!this.model.jobPostUrl || this.model.jobPostUrl == "") {
            this.model.statusMessage = "Provide a job post url first";
        } else {
            this.model.statusMessage = "Looking up job description";
        }
        this.save();
        this.render();

        let requestBody = { "job_post_url": this.model.jobPostUrl }
        console.debug(requestBody);
        console.debug(JSON.stringify(requestBody));

        try {
            const request = new Request("http://localhost:8080/job-post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            console.debug(request);

            const response = await fetch(request);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const text = await response.text();
            this.model.statusMessage = "Job description found";

            this.setJobDescription(text);
            this.save();
            this.render();

        } catch (error) {
            console.error(error.message);
            this.model.statusMessage = "Unable to retrieve job description";
        }
    }
    
    async setJobDescription(jobDescription) {
        if (this.model.jobDescription == jobDescription) {
            return;
        }

        this.model.jobDescription = jobDescription;
        this.save();

        this.model.statusMessage = "Updated job description"

        if (this.model.jobDescription && this.model.jobDescription != "" && this.model.resumeContent && this.model.resumeContent != "") {
            this.scan();
        }
        this.save();
        this.render();

        if (!this.model.minimumRequirements && !this.model.preferredRequirements && !this.model.companyName && !this.model.jobDuties && !this.model.companyName){
            this.extractJobSections();
        }
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
        this.updateGoogleSheetId();
    }

    async updateResumePdfLink() {
        if (this.model.resumeId && this.model.resumeId != 'undefined') {
            this.model.resumePdfLink = await this.workspace.getPdfLink(this.model.resumeId);
        } else {
            this.model.resumePdfLink = null;
        }
        this.save();
        this.render();
    }

    async updateCoverLetterPdfLink() {
        if (this.model.coverLetterId && this.model.coverLetterId != 'undefined') {
            this.model.coverLetterPdfLink = await this.workspace.getPdfLink(this.model.coverLetterId);
        } else {
            this.model.coverLetterPdfLink = null;
        }
        this.save();
        this.render();
    }

    async updateGoogleSheetId() {
        if (this.model.googleSheetName && this.model.googleSheetName != "undefined" && this.model.googleSheetName != "") {
            this.model.googleSheetId = await this.workspace.getDocumentIdByName(this.model.googleSheetName);
        }
        this.save();
        this.render();

        this.updateCompanyCorrespondence();
    }

    onGoogleAuthorized() {
        this.updateGoogleSheetId();
        this.updateResumeTemplateId();
        this.updateResumeId();
        this.updateCoverLetterTemplateId();
        this.updateCoverLetterId();
    }

    async googleAuthorize() {
        try {
            await this.workspace.init();
            await this.workspace.authorize();
        } catch(err) {
            console.error("Failed to authorize Google: " + err.message);
        }

        this.save();
        this.render();

        this.onGoogleAuthorized();
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
                this.scan();
        });

    }

    async createResume() {
        this.model.resumeTemplateId = await this.workspace.getDocumentIdByName(this.model.resumeTemplateName);
        this.model.resumeId = await this.workspace.getDocumentIdByName(this.model.resumeName());

        this.model.statusMessage = "Document not found, creating...";
        this.render();

        if (this.model.resumeTemplateId && !this.model.resumeId) {
            this.model.resumeId = await this.workspace.copyFile(this.model.resumeTemplateId, this.model.resumeName());
        }
        this.save();
        this.render();
    }

    async createCoverLetter() {
        this.model.coverLetterTemplateId = await this.workspace.getDocumentIdByName(this.model.coverLetterTemplateName);
        this.model.coverLetterId = await this.workspace.getDocumentIdByName(this.model.coverLetterName());

        this.model.statusMessage = "Document not found, creating...";
        this.render();

        if (this.model.coverLetterTemplateId && !this.model.coverLetterId) {
            this.model.coverLetterId = await this.workspace.copyFile(this.model.coverLetterTemplateId, this.model.coverLetterName());
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
            });

        } catch(err) {
            console.error("Encountered error while creating resume and cover letter: " + err.message);
            this.model.statusMessage = "Problem finding/creating documents";
            this.render();
        }

    }

    async updateKeywordResumeId(){
        if (this.model.keywordResumeName && this.model.keywordResumeName != "" && this.model.keywordResumeName != "undefined"){
            this.model.keywordResumeId = await this.workspace.getDocumentIdByName(this.model.keywordResumeName);
            this.model.statusMessage = "Updated keyword resume"
            this.save();
            this.render();
        }

    }

    async updateResumeTemplateId() {
        this.model.resumeTemplateId = await this.workspace.getDocumentIdByName(this.model.resumeTemplateName);
        this.save();
        this.render();
    }

    async updateCoverLetterTemplateId() {
        this.model.coverLetterTemplateId = await this.workspace.getDocumentIdByName(this.model.coverLetterTemplateName);
        this.save();
        this.render();
    }

    async updateResumeContent() {
        this.model.statusMessage = "Fetching resume or template contents";
        this.render();

        if (this.model.resumeId && this.model.resumeId != "" && this.model.resumeId != "undefined") {
            this.model.resumeContent = await this.workspace.getPlaintextFileContents(this.model.resumeId);
            this.model.statusMessage = "Resume content updated based on company copy";
        } else if (this.model.keywordResumeId && this.model.keywordResumeId != "" && this.model.keywordResumeId != "undefined") {
            this.model.resumeContent = await this.workspace.getPlaintextFileContents(this.model.keywordResumeId);
            this.model.statusMessage = "Resume content updated based on keyword resume";
        } else if (this.model.resumeTemplateId && this.model.resumeTemplateId != "" && this.model.resumeTemplateId != "undefined") {
            this.model.resumeContent = await this.workspace.getPlaintextFileContents(this.model.resumeTemplateId);
            this.model.statusMessage = "Resume content updated based on template";
        }

        this.render();

        this.save();
        this.render();
        this.scan();
    }

    async scanButton() {
        await this.updateResumeContent();
        this.scan();
    }

    async scan() {
        if (!this.model.resumeContent) {
            this.model.statusMessage = "Skipping scan due to missing resume";
            return;
        } else if (!this.model.jobDescription) {
            this.model.statusMessage = "Skipping scan due to missing job description";
            return;
        }
        this.model.statusMessage = "Scanning resume...";
        this.render();

        let promises = [];

        let regularScanPromise = this.jobscan.scan(this.model.resumeContent, this.model.jobDescription);
        promises.push(regularScanPromise);
        regularScanPromise.then( results => {
            if (!results) {
                return;
            }
            this.model.regularScore = results['matchRate']['score'];
            this.model.regularKeywords = results;
            this.save();
            this.render();
        });

        // This allows us to accumulate more content to help the user anticipate unknown ATS behavior
        let jobDescription = "";
        jobDescription = jobDescription + this.model.minimumRequirements;

        if (this.model.minimumRequirements) {
            let minimumScanPromise = this.jobscan.scan(this.model.resumeContent, jobDescription);
            promises.push(minimumScanPromise);
            minimumScanPromise.then( results => {
                if (!results) {
                    return;
                }
                this.model.minimumRequirementsScore = results['matchRate']['score'];
                this.model.minimumRequirementsKeywords = results;
                this.save();
                this.render();
            });
        }


        if (this.model.preferredRequirements) {
            jobDescription = jobDescription + this.model.preferredRequirements;

            let preferredRequirementsPromise = this.jobscan.scan(this.model.resumeContent, jobDescription);
            promises.push(preferredRequirementsPromise);
            preferredRequirementsPromise.then( results => {
                if (!results) {
                    return;
                }
                this.model.preferredRequirementsScore = results['matchRate']['score'];
                this.model.preferredRequirementsKeywords = results;
                this.save();
                this.render();
            });
        }

        if (this.model.jobDuties) {
            jobDescription = jobDescription + this.model.preferredRequirements;

            let jobDutiesPromise = this.jobscan.scan(this.model.resumeContent, jobDescription);
            promises.push(jobDutiesPromise);
            jobDutiesPromise.then( results => {
                if (!results) {
                    return;
                }
                this.model.jobDutiesScore = results['matchRate']['score'];
                this.model.jobDutiesKeywords = results;
                this.save();
                this.render();
            });
        }

        if (this.model.companyInfo) {
            jobDescription = jobDescription + this.model.preferredRequirements;

            let companyInfoPromise = this.jobscan.scan(this.model.resumeContent, jobDescription);
            promises.push(companyInfoPromise);
            companyInfoPromise.then( results => {
                if (!results) {
                    return;
                }
                this.model.companyInfoScore = results['matchRate']['score'];
                this.model.companyInfoKeywords = results;
                this.save();
                this.render();
            });
        }

        Promise.all(promises).then( results =>{
            if (!this.model.resumeId && !this.model.keywordResumeId) {
                this.model.statusMessage = "All resume scans completed against resume template";
            } else if (!this.model.resumeId) {
                this.model.statusMessage = "All resume scans completed against keyword resume";
            } else {
                this.model.statusMessage = "All resume scans completed against company copy";
            }

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
        this.model.resumeId = null;
        this.model.coverLetterId = null;
        this.model.companyNamePossessive = "";
        this.model.hiringManager = "Hiring Manager";
        this.model.completeJobTitle = "";
        this.model.shortJobTitle = "";
        this.model.companyValues = "";
        this.model.relevantExperience = "";
        this.model.regularScore = "";
        this.model.minimumRequirementsScore = "";
        this.model.preferredRequirementsScore = "";
        this.model.jobDutiesScore = "";
        this.model.companyInfoScore = "";
        this.model.regularKeywords = "";
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

    copyLinkedInQueryToClipboard(){
        this.model.statusMessage = "Query copied to clipboard";
        navigator.clipboard.writeText(this.model.linkedInQuery);
        this.save();
        this.render();
    }

    copyLinkedInProfileLinkToClipboard() {
        this.model.statusMessage = "LinkedIn profile copied to clipboard";
        navigator.clipboard.writeText(this.model.linkedInProfileLink);
        this.save();
        this.render();
    }

    copyGithubProfileLinkToClipboard() {
        this.model.statusMessage = "Github profile copied to clipboard";
        navigator.clipboard.writeText(this.model.githubProfileLink);
        this.save();
        this.render();
    }

    copyWebsiteProfileLinkToClipboard() {
        this.model.statusMessage = "Website link copied to clipboard";
        navigator.clipboard.writeText(this.model.websiteProfileLink);
        this.save();
        this.render();
    }

    setSearchTerms(searchTerms) {
        this.model.searchTerms = searchTerms;
        this.save();
    }
}

export default Controller;