const DEFAULT_LINKEDIN_QUERY = "(software OR data) AND (founding OR senior OR principal OR staff OR L4 OR L5) AND (engineer OR architect)";
const DEFAULT_LINKEDIN_PROFILE = "https://www.linkedin.com/in/christophershumaker/";
const DEFAULT_GITHUB_PROFILE = "https://github.com/Shumakriss";
const DEFAULT_WEBSITE = "https://www.makerconsulting.llc/maker-consulting";

const MONTHS = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December"
}

function getItemWithDefault(itemName, defaultValue) {
    let item = localStorage.getItem(itemName);
    if (!item || item == "null") {
        return defaultValue;
    } else {
        return item;
    }
}

function getBooleanItem(itemName, defaultValue) {
    let item = localStorage.getItem(itemName);
    if (item == "true") {
        return true;
    } else if (item == "false") {
        return false;
    } else {
        return defaultValue;
    }
}

// TODO: Rename to "Model"
class View {

    constructor() {

        /* Third Party configuration
            - Provided to other tools
            - Managed in save/load
        */
        this.googleApiKey = null;
        this.googleClientId = null;
        this.googleToken = null;
        this.googleConsentRequested = false;
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

        this.resumeName = "";
        this.resumeId = null;
        this.resumeContent = "";

        this.coverLetterName = "";
        this.coverLetterId = null;

        this.tailoredResumeLink = "";
        this.tailoredResumeLinkText = "Tailored Resume Not Ready";
        this.tailoredResumeDlButtonEnabled = false;
        
        this.tailoredCoverLetterLink = "";
        this.tailoredCoverLetterLinkText = "Tailored CoverLetter Not Ready";
        this.tailoredCoverLetterDlButtonEnabled = false;
        
        this.googleSheetName = "";
        this.googleSheetLink = "";
        this.googleSheetLinkText = "Log Sheet Not Ready";
        this.logApplicationButtonText = "Log Application";
        this.logApplicationEnabled = false;

        this.navigationPage = "job-description";

        this.linkedInProfileLink = DEFAULT_LINKEDIN_PROFILE;
        this.githubProfileLink = DEFAULT_GITHUB_PROFILE;
        this.websiteProfileLink = DEFAULT_WEBSITE;

        /* Other fields */
        this.jobDescription = "";
        this.companyName = "";
        this.jobTitle = "";
        this.minimumRequirements = "";
        this.preferredRequirements = "";
        this.jobDuties = "";
        this.companyInfo = "";

        /* Template merge fields */
        const date = new Date();  // Today
        this.date = MONTHS[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
        this.companyNamePossessive = "";
        this.companyAddress = "";
        this.hiringManager = "Hiring Manager";
        this.completeJobTitle = "";
        this.shortJobTitle = "";
        this.companyValues = "";
        this.relevantExperience = "";

        /* Scan results fields */
        this.includePreferredRequirements = true;
        this.includeJobDuties = true;
        this.includeCompanyInfo = true;
        this.scanEnabled = false;
        this.minimumRequirementsScore = "";
        this.preferredRequirementsScore = "";
        this.jobDutiesScore = "";
        this.companyInfoScore = "";
        
        this.minimumRequirementsKeywords = "";  // This is current a raw json response payload from jobscan
        this.preferredRequirementsKeywords = ""; // This is current a raw json response payload from jobscan
        this.jobDutiesKeywords = ""; // This is current a raw json response payload from jobscan
        this.companyInfoKeywords = ""; // This is current a raw json response payload from jobscan

        this.resumePdfLink = "";
        this.coverLetterPdfLink = "";

    }

    /* Save-load */
    save() {
        console.debug("Saving view", this);

        localStorage.setItem("googleToken", JSON.stringify(this.googleToken));
        localStorage.setItem("minimumRequirementsKeywords", JSON.stringify(this.minimumRequirementsKeywords));
        localStorage.setItem("preferredRequirementsKeywords", JSON.stringify(this.preferredRequirementsKeywords));
        localStorage.setItem("jobDutiesKeywords", JSON.stringify(this.jobDutiesKeywords));
        localStorage.setItem("companyInfoKeywords", JSON.stringify(this.companyInfoKeywords));

        localStorage.setItem("googleApiKey", this.googleApiKey);
        localStorage.setItem("googleClientId", this.googleClientId);
        localStorage.setItem("googleConsentRequested", this.googleConsentRequested);
        localStorage.setItem("jobscanCookie", this.jobscanCookie);
        localStorage.setItem("jobscanXsrfToken", this.jobscanXsrfToken);
        localStorage.setItem("chatgptApiKey", this.chatgptApiKey);
        localStorage.setItem("googleSignInEnabled", this.googleSignInEnabled);
        localStorage.setItem("googleRefreshEnabled", this.googleRefreshEnabled);
        localStorage.setItem("googleSignOutEnabled", this.googleSignOutEnabled);
        localStorage.setItem("extractJobSectionsEnabled", this.extractJobSectionsEnabled);
        localStorage.setItem("createResumeEnabled", this.createResumeEnabled);
        localStorage.setItem("linkedInQuery", this.linkedInQuery);
        localStorage.setItem("resumeTemplateName", this.resumeTemplateName);
        localStorage.setItem("resumeTemplateId", this.resumeTemplateId);
        localStorage.setItem("coverLetterTemplateName", this.coverLetterTemplateName);
        localStorage.setItem("coverLetterTemplateId", this.coverLetterTemplateId);
        localStorage.setItem("resumeName", this.resumeName);
        localStorage.setItem("coverLetterName", this.coverLetterName);
        localStorage.setItem("resumeId", this.resumeId);
        localStorage.setItem("resumeContent", this.resumeContent);
        localStorage.setItem("coverLetterId", this.coverLetterId);
        localStorage.setItem("tailoredResumeLink", this.tailoredResumeLink);
        localStorage.setItem("tailoredResumeLinkText", this.tailoredResumeLinkText);
        localStorage.setItem("tailoredResumeDlButtonEnabled", this.tailoredResumeDlButtonEnabled);
        localStorage.setItem("tailoredCoverLetterLink", this.tailoredCoverLetterLink);
        localStorage.setItem("tailoredCoverLetterLinkText", this.tailoredCoverLetterLinkText);
        localStorage.setItem("tailoredCoverLetterDlButtonEnabled", this.tailoredCoverLetterDlButtonEnabled);
        localStorage.setItem("googleSheetName", this.googleSheetName);
        localStorage.setItem("googleSheetLink", this.googleSheetLink);
        localStorage.setItem("googleSheetLinkText", this.googleSheetLinkText);
        localStorage.setItem("logApplicationButtonText", this.logApplicationButtonText);
        localStorage.setItem("logApplicationEnabled", this.logApplicationEnabled);
        localStorage.setItem("navigationPage", this.navigationPage);
        localStorage.setItem("jobDescription", this.jobDescription);
        localStorage.setItem("companyName", this.companyName);
        localStorage.setItem("jobTitle", this.jobTitle);
        localStorage.setItem("minimumRequirements", this.minimumRequirements);
        localStorage.setItem("preferredRequirements", this.preferredRequirements);
        localStorage.setItem("jobDuties", this.jobDuties);
        localStorage.setItem("companyInfo", this.companyInfo);
        // Excluded date so that it's always current
//        localStorage.setItem("date", this.date);
        localStorage.setItem("companyNamePossessive", this.companyNamePossessive);
        localStorage.setItem("companyAddress", this.companyAddress);
        localStorage.setItem("hiringManager", this.hiringManager);
        localStorage.setItem("completeJobTitle", this.completeJobTitle);
        localStorage.setItem("shortJobTitle", this.shortJobTitle);
        localStorage.setItem("companyValues", this.companyValues);
        localStorage.setItem("relevantExperience", this.relevantExperience);
        localStorage.setItem("includePreferredRequirements", this.includePreferredRequirements);
        localStorage.setItem("includeJobDuties", this.includeJobDuties);
        localStorage.setItem("includeCompanyInfo", this.includeCompanyInfo);
        localStorage.setItem("scanEnabled", this.scanEnabled);
        localStorage.setItem("minimumRequirementsScore", this.minimumRequirementsScore);
        localStorage.setItem("preferredRequirementsScore", this.preferredRequirementsScore);
        localStorage.setItem("jobDutiesScore", this.jobDutiesScore);
        localStorage.setItem("companyInfoScore", this.companyInfoScore);
        localStorage.setItem("linkedInProfileLink", this.linkedInProfileLink);
        localStorage.setItem("githubProfileLink", this.githubProfileLink);
        localStorage.setItem("websiteProfileLink", this.websiteProfileLink);

        localStorage.setItem("resumePdfLink", this.resumePdfLink);
        localStorage.setItem("coverLetterPdfLink", this.coverLetterPdfLink);

        console.debug("Saved application state to local storage");
    }

    load() {
        console.debug("Loading view");

        this.linkedInQuery = getItemWithDefault("linkedInQuery", this.linkedInQuery);
        this.navigationPage = getItemWithDefault("navigationPage", this.navigationPage);

        try {
            let loadedToken = localStorage.getItem("googleToken");
            this.googleToken = JSON.parse(loadedToken);
        } catch(err) {
            console.warn("Google token in storage was not parseable");
        }

        try {
            this.minimumRequirementsKeywords = JSON.parse(getItemWithDefault("minimumRequirementsKeywords", this.minimumRequirementsKeywords));
            this.preferredRequirementsKeywords = JSON.parse(getItemWithDefault("preferredRequirementsKeywords", this.preferredRequirementsKeywords));
            this.jobDutiesKeywords = JSON.parse(getItemWithDefault("jobDutiesKeywords", this.jobDutiesKeywords));
            this.companyInfoKeywords = JSON.parse(getItemWithDefault("companyInfoKeywords", this.companyInfoKeywords));
        } catch(err) {
            console.warn("Scan results were not parseable");
        }

        this.linkedInProfileLink = getItemWithDefault("linkedInProfileLink", this.linkedInProfileLink);
        this.githubProfileLink = getItemWithDefault("githubProfileLink", this.githubProfileLink);
        this.websiteProfileLink = getItemWithDefault("websiteProfileLink", this.websiteProfileLink);
        this.googleApiKey = getItemWithDefault("googleApiKey", this.googleApiKey);
        this.googleClientId = getItemWithDefault("googleClientId", this.googleClientId);
        this.googleConsentRequested = getItemWithDefault("googleConsentRequested", this.googleConsentRequested);
        this.jobscanCookie = getItemWithDefault("jobscanCookie", this.jobscanCookie);
        this.jobscanXsrfToken = getItemWithDefault("jobscanXsrfToken", this.jobscanXsrfToken);
        this.chatgptApiKey = getItemWithDefault("chatgptApiKey", this.chatgptApiKey);
        this.resumeTemplateName = getItemWithDefault("resumeTemplateName", this.resumeTemplateName);
        this.resumeTemplateId = getItemWithDefault("resumeTemplateId", this.resumeTemplateId);
        this.coverLetterTemplateName = getItemWithDefault("coverLetterTemplateName", this.coverLetterTemplateName);
        this.coverLetterTemplateId = getItemWithDefault("coverLetterTemplateId", this.coverLetterTemplateId);
        this.resumeName = getItemWithDefault("resumeName", this.resumeName);
        this.resumeId = getItemWithDefault("resumeId", this.resumeId);
        this.resumeContent = getItemWithDefault("resumeContent", this.resumeContent);
        this.coverLetterName = getItemWithDefault("coverLetterName", this.coverLetterName);
        this.coverLetterId = getItemWithDefault("coverLetterId", this.coverLetterId);
        this.tailoredResumeLink = getItemWithDefault("tailoredResumeLink", this.tailoredResumeLink);
        this.tailoredResumeLinkText = getItemWithDefault("tailoredResumeLinkText", this.tailoredResumeLinkText);
        this.tailoredResumeDlButtonEnabled = getItemWithDefault("tailoredResumeDlButtonEnabled", this.tailoredResumeDlButtonEnabled);
        this.tailoredCoverLetterLink = getItemWithDefault("tailoredCoverLetterLink", this.tailoredCoverLetterLink);
        this.tailoredCoverLetterLinkText = getItemWithDefault("tailoredCoverLetterLinkText", this.tailoredCoverLetterLinkText);
        this.tailoredCoverLetterDlButtonEnabled = getItemWithDefault("tailoredCoverLetterDlButtonEnabled", this.tailoredCoverLetterDlButtonEnabled);
        this.googleSheetName = getItemWithDefault("googleSheetName", this.googleSheetName);
        this.googleSheetLink = getItemWithDefault("googleSheetLink", this.googleSheetLink);
        this.googleSheetLinkText = getItemWithDefault("googleSheetLinkText", this.googleSheetLinkText);
        this.logApplicationButtonText = getItemWithDefault("logApplicationButtonText", this.logApplicationButtonText);
        this.logApplicationEnabled = getItemWithDefault("logApplicationEnabled", this.logApplicationEnabled);
        this.jobDescription = getItemWithDefault("jobDescription", this.jobDescription);
        this.companyName = getItemWithDefault("companyName", this.companyName);
        this.jobTitle = getItemWithDefault("jobTitle", this.jobTitle);
        this.minimumRequirements = getItemWithDefault("minimumRequirements", this.minimumRequirements);
        this.preferredRequirements = getItemWithDefault("preferredRequirements", this.preferredRequirements);
        this.jobDuties = getItemWithDefault("jobDuties", this.jobDuties);
        this.companyInfo = getItemWithDefault("companyInfo", this.companyInfo);
        this.companyNamePossessive = getItemWithDefault("companyNamePossessive", this.companyNamePossessive);
        this.companyAddress = getItemWithDefault("companyAddress", this.companyAddress);
        this.hiringManager = getItemWithDefault("hiringManager", this.hiringManager);
        this.completeJobTitle = getItemWithDefault("completeJobTitle", this.completeJobTitle);
        this.shortJobTitle = getItemWithDefault("shortJobTitle", this.shortJobTitle);
        this.companyValues = getItemWithDefault("companyValues", this.companyValues);
        this.relevantExperience = getItemWithDefault("relevantExperience", this.relevantExperience);
        this.minimumRequirementsScore = getItemWithDefault("minimumRequirementsScore", this.minimumRequirementsScore);
        this.preferredRequirementsScore = getItemWithDefault("preferredRequirementsScore", this.preferredRequirementsScore);
        this.jobDutiesScore = getItemWithDefault("jobDutiesScore", this.jobDutiesScore);
        this.companyInfoScore = getItemWithDefault("companyInfoScore", this.companyInfoScore);
        this.linkedInProfileLink = getItemWithDefault("linkedInProfileLink", this.linkedInProfileLink);
        this.githubProfileLink = getItemWithDefault("githubProfileLink", this.githubProfileLink);
        this.websiteProfileLink = getItemWithDefault("websiteProfileLink", this.websiteProfileLink);

        /* Boolean fields */
        this.googleSignInEnabled = getBooleanItem("googleSignInEnabled", this.googleSignInEnabled);
        this.googleRefreshEnabled = getBooleanItem("googleRefreshEnabled", this.googleRefreshEnabled);
        this.googleSignOutEnabled = getBooleanItem("googleSignOutEnabled", this.googleSignOutEnabled);
        this.extractJobSectionsEnabled = getBooleanItem("extractJobSectionsEnabled", this.extractJobSectionsEnabled);
        this.createResumeEnabled = getBooleanItem("createResumeEnabled", this.createResumeEnabled);
        this.scanEnabled = getBooleanItem("scanEnabled", this.scanEnabled);
        this.includePreferredRequirements = getBooleanItem("includePreferredRequirements", this.includePreferredRequirements );
        this.includeJobDuties = getBooleanItem("includeJobDuties", this.includeJobDuties);
        this.includeCompanyInfo = getBooleanItem("includeCompanyInfo", this.includeCompanyInfo);

        this.resumePdfLink = getItemWithDefault("resumePdfLink", this.resumePdfLink);
        this.coverLetterPdfLink = getItemWithDefault("coverLetterPdfLink", this.coverLetterPdfLink);

        // Excluded date so that it's always current
//        this.date = localStorage.getItem("date");

        console.debug("Loaded view: ", this);
    }

}

export default View;