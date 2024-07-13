class Session {

    constructor() {
        this.resumeTemplateName = null;
        this.resumeTemplateId = null;
        this.coverLetterTemplateName = null;
        this.coverLetterTemplateId = null;
        this.companyName = null;
        this.newResumeName = null;
        this.newResumeId = null;
        this.newCoverLetterName = null;
        this.newCoverLetterId = null;
        this.minimumRequirements = null;
        this.preferredRequirements = null;
        this.jobDuties = null;
        this.companyInformation = null;

        this.credentialFile = null;

        this.jobscanCookie = null;
        this.jobscanXsrfToken = null;

        this.googleClientId = null;
        this.googleApiKey = null;
        this.googleApiToken = null;

        this.chatGptApiKey = null;
    }

    save() {
        sessionStorage.setItem('session-data', JSON.stringify(this));
        console.log("Session was saved");
    }

    tryLoad() {
        if (sessionStorage.getItem('session-data')) {
            console.log("Found session in storage.");
            this.load();
            return true;
        } else {
            console.log("No session found in storage.");
            return false;
        }
    }

    load() {
        let sessionData = JSON.parse(sessionStorage.getItem('session-data'));

        this.resumeTemplateName = sessionData.resumeTemplateName;
        this.resumeTemplateId = sessionData.resumeTemplateId;
        this.coverLetterTemplateName = sessionData.coverLetterTemplateName;
        this.coverLetterTemplateId = sessionData.companyName;
        this.companyName = sessionData.companyName;
        this.newResumeName = sessionData.newResumeName;
        this.newResumeId = sessionData.newResumeId;
        this.newCoverLetterName = sessionData.newCoverLetterName;
        this.newCoverLetterId = sessionData.newCoverLetterId;
        this.minimumRequirements = sessionData.minimumRequirements;
        this.preferredRequirements = sessionData.preferredRequirements;
        this.jobDuties = sessionData.jobDuties;
        this.companyInformation = sessionData.companyInformation;

        this.credentialFile = sessionData.credentialFile;

        this.jobscanCookie = sessionData.jobscanCookie;
        this.jobscanXsrfToken = sessionData.jobscanXsrfToken;

        this.googleClientId = sessionData.googleClientId;
        this.googleApiKey = sessionData.googleApiKey;
        this.googleApiToken = sessionData.googleApiToken;

        this.chatGptApiKey = sessionData.chatGptApiKey;

        console.log("Session loaded");
    }

}