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

        this.view.save();
    }
    
    setJobTitle(jobTitle) {
        this.view.jobTitle = jobTitle;
        this.view.completeJobTitle = jobTitle;
        this.view.shortJobTitle = jobTitle;
        this.view.save();
    }
    
    setMinimumRequirements(minimumRequirements) {
        this.view.minimumRequirements = minimumRequirements;
        this.view.save();
    }

    updateCreateResumeEnabled() {
//        debugger;
        this.view.createResumeEnabled = Boolean(
            this.view.googleRefreshEnabled &&
            this.view.companyName &&
            this.view.companyName != "");
        this.view.save();
    }

    updateScanEnabled() {
        this.view.scanEnabled = Boolean(this.view.resumeId && this.view.minimumRequirements);
    }

    /* Complex functions
        - Handles
    */
    async googleAuthorize() {
        try {
            await this.workspace.init();
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

        this.view.save();
    }

    googleRefresh() {}
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
            this.updateScanEnabled();
        } catch(err) {

        }
    }
    mergeTemplateFields() {}

    async scanResume() {
        console.warn("Scan button Handler not implemented");
        this.view.resumeContent = await this.workspace.getPlaintextFileContents(this.view.resumeId);
        let results = await this.jobscan.scan(this.view.resumeContent, this.view.minimumRequirements);
        debugger;
    }

    logApplication() {}
}

export default Controller;