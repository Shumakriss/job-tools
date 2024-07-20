const DEFAULT_LINKEDIN_QUERY = "(software OR data) AND (founding OR senior OR principal OR staff OR L4 OR L5) AND (engineer OR architect)";

class View {

    constructor() {

        /* Third Party configuration
            - Provided to other tools
            - Managed in save/load
        */
        this.googleApiKey = null;
        this.googleClientId = null;
        this.googleToken = null;
        this.googleConsentReceived = false;
        this.jobscanCookie = null;
        this.jobscanXsrfToken = null;
        this.chatgptApiKey = null;

        /* Button states */
        this.googleSignInEnabled = true;
        this.googleRefreshEnabled = false;
        this.googleSignOutEnabled = false
        this.extractJobSectionsEnabled = false;
        this.createResumeEnabled = false;
        // ....

        /* Globally visible Fields */
        this.linkedInQuery = DEFAULT_LINKEDIN_QUERY;
        this.resumeTemplateName = "";
        this.resumeTemplateId = null;
        this.coverLetterTemplateName = "";
        this.coverLetterTemplateId = null;

        this.tailoredResumeLink = null;
        this.tailoredResumeLinkText = "Tailored Resume Not Ready";
        this.tailoredResumeDlButtonEnabled = false;
        
        this.tailoredCoverLetterLink = null;
        this.tailoredCoverLetterLinkText = "Tailored CoverLetter Not Ready";
        this.tailoredCoverLetterDlButtonEnabled = false;
        
        this.googleSheetName = "";
        this.googleSheetLink = null;
        this.googleSheetLinkText = "Log Sheet Not Ready";
        this.logApplicationButtonText = "Log Application";
        this.logApplicationEnabled = false;

        /* Other fields */
        this.jobDescription = "";
        this.companyName = "";
        this.jobTitle = "";
        this.minimumRequirements = "";
        this.preferredRequirements = "";
        this.jobDuties = "";
        this.companyInfo = "";

        /* Template merge fields */

        /* Scan results fields */

        /* Profile links fields */
    }

    /* Save-load */

    save() {
        console.debug("Saving view", this);
        
        localStorage.setItem("linkedin-query", this.linkedInQuery);
        localStorage.setItem("", this.resumeTemplateName);
        localStorage.setItem("", this.resumeTemplateId);
        localStorage.setItem("", this.coverLetterTemplateName);
        localStorage.setItem("", this.coverLetterTemplateId);
        localStorage.setItem("", this.googleApiKey);
        localStorage.setItem("", this.googleClientId);
        localStorage.setItem("", this.googleToken);
        localStorage.setItem("", this.googleConsentReceived);
        localStorage.setItem("", this.jobscanCookie);
        localStorage.setItem("", this.jobscanXsrfToken);
        localStorage.setItem("", this.chatgptApiKey);
        localStorage.setItem("", this.googleSignInEnabled);
        localStorage.setItem("", this.googleRefreshEnabled);
        localStorage.setItem("", this.googleSignOutEnabled);
        localStorage.setItem("", this.jobDescription);
        localStorage.setItem("", this.extractJobSectionsEnabled);
        
        console.debug("Saved application state to local storage");
    }

    load() {

    }

}

export default View;