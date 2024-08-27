const DEFAULT_LINKEDIN_QUERY = "(software OR data) AND (founding OR senior OR principal OR staff OR L4 OR L5) AND (engineer OR architect)";
const DEFAULT_LINKEDIN_PROFILE = "https://www.linkedin.com/in/christophershumaker/";
const DEFAULT_GITHUB_PROFILE = "https://github.com/Shumakriss";
const DEFAULT_WEBSITE = "https://www.makerconsulting.llc/maker-consulting";
const GDOC_PREFIX = "https://docs.google.com/document/d/";
const GDOC_SUFFIX = "/edit";
const GSHEET_PREFIX = "https://docs.google.com/spreadsheets/d/";
const GSHEET_SUFFIX = "/edit";

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

class Model {

    constructor() {

        this.lastSave = null;

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

        /* Globally visible Fields */
        this.linkedInQuery = DEFAULT_LINKEDIN_QUERY;

        this.keywordResumeName = "";
        this.keywordResumeId = null;

        this.resumeTemplateName = "";
        this.resumeTemplateId = null;
        this.coverLetterTemplateName = "";
        this.coverLetterTemplateId = null;

        this.resumeId = null;
        this.coverLetterId = null;

        this.resumeContent = "";

        this.googleSheetName = "";
        this.googleSheetId = null;
        this.logApplicationButtonText = "Log Application";

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
        this.hiringManager = "Hiring Manager";
        this.completeJobTitle = "";
        this.shortJobTitle = "";
        this.companyValues = "";
        this.relevantExperience = "";

        /* Scan results fields */
        this.regularScore = "";
        this.minimumRequirementsScore = "";
        this.preferredRequirementsScore = "";
        this.jobDutiesScore = "";
        this.companyInfoScore = "";
        
        this.regularKeywords = "";  // This is currently a raw json response payload from jobscan
        this.minimumRequirementsKeywords = "";  // This is currently a raw json response payload from jobscan
        this.preferredRequirementsKeywords = ""; // This is currently a raw json response payload from jobscan
        this.jobDutiesKeywords = ""; // This is currently a raw json response payload from jobscan
        this.companyInfoKeywords = ""; // This is currently a raw json response payload from jobscan

        this.resumePdfLink = "";
        this.coverLetterPdfLink = "";

        this.statusMessage = "Start your application!";

        this.searchTerms = "";

        this.jobPostUrl = "";
    }

    /* Save-load */
    save() {
        console.debug("Saving model", this);

        localStorage.setItem("lastSave", JSON.stringify(Date.now()));

        localStorage.setItem("googleToken", JSON.stringify(this.googleToken));
        localStorage.setItem("regularKeywords", JSON.stringify(this.regularKeywords));
        localStorage.setItem("minimumRequirementsKeywords", JSON.stringify(this.minimumRequirementsKeywords));
        localStorage.setItem("preferredRequirementsKeywords", JSON.stringify(this.preferredRequirementsKeywords));
        localStorage.setItem("jobDutiesKeywords", JSON.stringify(this.jobDutiesKeywords));
        localStorage.setItem("companyInfoKeywords", JSON.stringify(this.companyInfoKeywords));
        localStorage.setItem("companyCorrespondence", JSON.stringify(this.companyCorrespondence));

        localStorage.setItem("googleApiKey", this.googleApiKey);
        localStorage.setItem("googleClientId", this.googleClientId);
        localStorage.setItem("googleConsentRequested", this.googleConsentRequested);
        localStorage.setItem("jobscanCookie", this.jobscanCookie);
        localStorage.setItem("jobscanXsrfToken", this.jobscanXsrfToken);
        localStorage.setItem("chatgptApiKey", this.chatgptApiKey);
        localStorage.setItem("linkedInQuery", this.linkedInQuery);
        localStorage.setItem("keywordResumeName", this.keywordResumeName);
        localStorage.setItem("resumeTemplateName", this.resumeTemplateName);
        localStorage.setItem("keywordResumeId", this.keywordResumeId)
        localStorage.setItem("resumeTemplateId", this.resumeTemplateId);
        localStorage.setItem("coverLetterTemplateName", this.coverLetterTemplateName);
        localStorage.setItem("coverLetterTemplateId", this.coverLetterTemplateId);
        localStorage.setItem("resumeId", this.resumeId);
        localStorage.setItem("resumeContent", this.resumeContent);
        localStorage.setItem("coverLetterId", this.coverLetterId);
        localStorage.setItem("googleSheetName", this.googleSheetName);
        localStorage.setItem("googleSheetId", this.googleSheetId);
        localStorage.setItem("logApplicationButtonText", this.logApplicationButtonText);
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
        localStorage.setItem("hiringManager", this.hiringManager);
        localStorage.setItem("completeJobTitle", this.completeJobTitle);
        localStorage.setItem("shortJobTitle", this.shortJobTitle);
        localStorage.setItem("companyValues", this.companyValues);
        localStorage.setItem("relevantExperience", this.relevantExperience);
        localStorage.setItem("regularScore", this.regularScore);
        localStorage.setItem("minimumRequirementsScore", this.minimumRequirementsScore);
        localStorage.setItem("preferredRequirementsScore", this.preferredRequirementsScore);
        localStorage.setItem("jobDutiesScore", this.jobDutiesScore);
        localStorage.setItem("companyInfoScore", this.companyInfoScore);
        localStorage.setItem("linkedInProfileLink", this.linkedInProfileLink);
        localStorage.setItem("githubProfileLink", this.githubProfileLink);
        localStorage.setItem("websiteProfileLink", this.websiteProfileLink);

        localStorage.setItem("resumePdfLink", this.resumePdfLink);
        localStorage.setItem("coverLetterPdfLink", this.coverLetterPdfLink);

        localStorage.setItem("statusMessage", this.statusMessage);

        localStorage.setItem("searchTerms", this.searchTerms);

        localStorage.setItem("jobPostUrl", this.jobPostUrl);

        console.debug("Saved application state to local storage");
    }

    load() {
        console.debug("Loading model");

        this.lastSave = localStorage.getItem("lastSave");

        this.linkedInQuery = getItemWithDefault("linkedInQuery", this.linkedInQuery);
        this.navigationPage = getItemWithDefault("navigationPage", this.navigationPage);

        try {
            let loadedToken = localStorage.getItem("googleToken");
            this.googleToken = JSON.parse(loadedToken);
        } catch(err) {
            console.warn("Google token in storage was not parseable");
        }

        try {
            this.regularKeywords = JSON.parse(getItemWithDefault("regularKeywords", this.regularKeywords));
            this.minimumRequirementsKeywords = JSON.parse(getItemWithDefault("minimumRequirementsKeywords", this.minimumRequirementsKeywords));
            this.preferredRequirementsKeywords = JSON.parse(getItemWithDefault("preferredRequirementsKeywords", this.preferredRequirementsKeywords));
            this.jobDutiesKeywords = JSON.parse(getItemWithDefault("jobDutiesKeywords", this.jobDutiesKeywords));
            this.companyInfoKeywords = JSON.parse(getItemWithDefault("companyInfoKeywords", this.companyInfoKeywords));
        } catch(err) {
            console.warn("Scan results were not parseable");
        }

        try {
            this.companyCorrespondence = JSON.parse(getItemWithDefault("companyCorrespondence", this.companyCorrespondence));
        } catch(err) {
            console.warn("Company correspondence were not parseable");
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
        this.keywordResumeName = getItemWithDefault("keywordResumeName", this.keywordResumeName);
        this.keywordResumeId = getItemWithDefault("keywordResumeId", this.keywordResumeId);
        this.resumeTemplateName = getItemWithDefault("resumeTemplateName", this.resumeTemplateName);
        this.resumeTemplateId = getItemWithDefault("resumeTemplateId", this.resumeTemplateId);
        this.coverLetterTemplateName = getItemWithDefault("coverLetterTemplateName", this.coverLetterTemplateName);
        this.coverLetterTemplateId = getItemWithDefault("coverLetterTemplateId", this.coverLetterTemplateId);
        this.resumeId = getItemWithDefault("resumeId", this.resumeId);
        this.resumeContent = getItemWithDefault("resumeContent", this.resumeContent);
        this.coverLetterId = getItemWithDefault("coverLetterId", this.coverLetterId);
        this.googleSheetName = getItemWithDefault("googleSheetName", this.googleSheetName);
        this.googleSheetId = getItemWithDefault("googleSheetId", this.googleSheetId);
        this.logApplicationButtonText = getItemWithDefault("logApplicationButtonText", this.logApplicationButtonText);
        this.jobDescription = getItemWithDefault("jobDescription", this.jobDescription);
        this.companyName = getItemWithDefault("companyName", this.companyName);
        this.jobTitle = getItemWithDefault("jobTitle", this.jobTitle);
        this.minimumRequirements = getItemWithDefault("minimumRequirements", this.minimumRequirements);
        this.preferredRequirements = getItemWithDefault("preferredRequirements", this.preferredRequirements);
        this.jobDuties = getItemWithDefault("jobDuties", this.jobDuties);
        this.companyInfo = getItemWithDefault("companyInfo", this.companyInfo);
        this.companyNamePossessive = getItemWithDefault("companyNamePossessive", this.companyNamePossessive);
        this.hiringManager = getItemWithDefault("hiringManager", this.hiringManager);
        this.completeJobTitle = getItemWithDefault("completeJobTitle", this.completeJobTitle);
        this.shortJobTitle = getItemWithDefault("shortJobTitle", this.shortJobTitle);
        this.companyValues = getItemWithDefault("companyValues", this.companyValues);
        this.relevantExperience = getItemWithDefault("relevantExperience", this.relevantExperience);
        this.regularScore = getItemWithDefault("regularScore", this.regularScore);
        this.minimumRequirementsScore = getItemWithDefault("minimumRequirementsScore", this.minimumRequirementsScore);
        this.preferredRequirementsScore = getItemWithDefault("preferredRequirementsScore", this.preferredRequirementsScore);
        this.jobDutiesScore = getItemWithDefault("jobDutiesScore", this.jobDutiesScore);
        this.companyInfoScore = getItemWithDefault("companyInfoScore", this.companyInfoScore);
        this.resumePdfLink = getItemWithDefault("resumePdfLink", this.resumePdfLink);
        this.coverLetterPdfLink = getItemWithDefault("coverLetterPdfLink", this.coverLetterPdfLink);
        this.linkedInProfileLink = getItemWithDefault("linkedInProfileLink", this.linkedInProfileLink);
        this.githubProfileLink = getItemWithDefault("githubProfileLink", this.githubProfileLink);
        this.websiteProfileLink = getItemWithDefault("websiteProfileLink", this.websiteProfileLink);

        this.statusMessage = getItemWithDefault("statusMessage", this.statusMessage);

        this.searchTerms = getItemWithDefault("searchTerms", this.searchTerms);

        this.jobPostUrl = getItemWithDefault("jobPostUrl", this.jobPostUrl);

        // Excluded date so that it's always current
//        this.date = localStorage.getItem("date");

        console.debug("Loaded model: ", this);
    }

    searchLinkIdealist() {
        let url = "https://www.idealist.org/en/jobs?q="
        url += encodeURIComponent(this.searchTerms);
        return url
    }

    searchLinkUsaJobs() {
        let url = "https://www.usajobs.gov/search/results/?k="
        url += encodeURIComponent(this.searchTerms);
        return url
    }

    searchLinkOuterjoin() {
        let url = "https://outerjoin.us/?q="
        url += encodeURIComponent(this.searchTerms);
        return url
    }

    searchLinkLinkedIn() {
        let url = "https://www.linkedin.com/jobs/search/?currentJobId=3981860422&origin=JOBS_HOME_SEARCH_BUTTON&refresh=true&keywords="
        url += encodeURIComponent(this.searchTerms);
        return url
    }

    resumeName() {
        if (this.companyName && this.resumeTemplateName) {
            return this.companyName + " " + this.resumeTemplateName.replace(" Template", "");
        } else {
            return "";
        }
    }

    coverLetterName() {
        if (this.companyName && this.coverLetterTemplateName) {
            return this.companyName + " " + this.coverLetterTemplateName.replace(" Template", "");
        } else {
            return "";
        }
    }

    tailoredResumeLink() {
        if (this.resumeId) {
            return GDOC_PREFIX + this.resumeId + GDOC_SUFFIX;
        } else {
            return "";
        }
    }

    glassdoorSearchLink() {
        if (this.companyName) {
            return "https://www.glassdoor.com/Search/results.htm?keyword=" + this.companyName;
        } else {
            return "https://www.glassdoor.com/Reviews/index.htm";
        }
    }

    levelsFyiLink() {
        if (this.companyName) {
            return "https://www.levels.fyi/?compare=iRobot,HubSpot," + this.companyName + "&track=Software%20Engineer";
        } else {
            return "https://www.levels.fyi/?compare=iRobot,HubSpot,Wayfair&track=Software%20Engineer";
        }
    }

    googleSheetLink() {
        if (this.googleSheetName && this.googleSheetId && this.googleSheetId != "undefined") {
            return GSHEET_PREFIX + this.googleSheetId + GSHEET_SUFFIX;
        } else {
            return "";
        }
    }

    googleDocLink(fileid) {
        if (fileid && fileid != "" && fileid != "undefined") {
            return GDOC_PREFIX + fileid + GDOC_SUFFIX;
        } else {
            return "";
        }
    }

    tailoredResumeLinkText() {
        if(this.companyName && this.resumeTemplateName && this.resumeId && this.resumeId != 'undefined') {
            return "Resume";
        } else if (this.companyName && this.resumeTemplateName && (!this.resumeId || this.resumeId == 'undefined')) {
            return "Resume not found"
        } else if (!this.companyName && this.resumeTemplateName) {
            return "Missing company name";
        } else if (this.companyName && !this.resumeTemplateName) {
            return "Missing resume template name";
        } else {
            return "";
        }
    }

    tailoredCoverLetterLink() {
        if (this.coverLetterId) {
            return GDOC_PREFIX + this.coverLetterId + GDOC_SUFFIX;
        } else {
            return "";
        }
    }
    
    tailoredCoverLetterLinkText() {
        if(this.companyName && this.coverLetterTemplateName && this.coverLetterId && this.coverLetterId != 'undefined') {
            return "Cover Letter";
        } else if (this.companyName && this.coverLetterTemplateName && (!this.coverLetterId || this.coverLetterId == 'undefined')) {
            return "Cover Letter not found"
        } else if (!this.companyName && this.coverLetterTemplateName) {
            return "Missing company name";
        } else if (this.companyName && !this.coverLetterTemplateName) {
            return "Missing cover letter template name";
        } else {
            return "";
        }
    }

    tailoredResumeDlButtonEnabled() {
        if(this.tailoredResumeLink() && this.tailoredResumeLink() != 'undefined') {
            return true;
        } else {
            return false;
        }
    }

    tailoredCoverLetterDlButtonEnabled() {
        if(this.tailoredCoverLetterLink() && this.tailoredCoverLetterLink() != 'undefined') {
            return true;
        } else {
            return false;
        }
    }

    isGoogleSignInEnabled() {
        if (this.googleApiKey && this.googleClientId &&
            !this.googleConsentRequested && !this.model.googleToken) {
            return true;
        } else {
            return false;
        }
    }

    isGoogleRefreshEnabled() {
        if (this.googleApiKey && this.googleClientId &&
            this.googleConsentRequested && this.googleToken) {
            return true;
        } else {
            return false;
        }
    }

    isGoogleSignOutEnabled() {
        if (this.googleApiKey && this.googleClientId &&
            this.googleConsentRequested && this.googleToken) {
            return true;
        } else {
            return false;
        }
    }

    isExtractJobSectionsEnabled() {
        if (this.chatgptApiKey && this.jobDescription) {
            return true;
        } else {
            return false;
        }
    }

    isTailorApplyEnabled() {
        return this.isGoogleRefreshEnabled() &&
            this.resumeId &&
            this.resumeId != "" &&
            this.resumeId != "undefined" &&
            this.coverLetterId &&
            this.coverLetterId != "" &&
            this.coverLetterId != "undefined" &&
            this.date &&
            this.companyName &&
            this.companyName != "not found" &&
            this.companyNamePossessive &&
            this.hiringManager &&
            this.jobTitle &&
            this.jobTitle != "not found" &&
            this.completeJobTitle &&
            this.shortJobTitle &&
            this.companyValues &&
            this.relevantExperience;
    }

    isCreateResumeEnabled() {
        return this.isGoogleRefreshEnabled() &&
            this.resumeTemplateName &&
            this.coverLetterTemplateName &&
            this.resumeTemplateId &&
            this.coverLetterTemplateId &&
            this.companyName &&
            this.companyName != "" &&
            (!this.resumeId ||
            this.resumeId == "" ||
            this.resumeId == "undefined") &&
            (!this.coverLetterId ||
            this.coverLetterId == "" ||
            this.coverLetterId == "undefined")
    }

    isScanEnabled() {
        return this.isGoogleRefreshEnabled() &&
            this.resumeContent &&
            this.minimumRequirements;
    }

    isApplicationLoggedToday() {

        if (this.companyCorrespondence) {
            for (let i=0; i<this.companyCorrespondence.length; i++) {
                let companyName = this.companyCorrespondence[i][0];
                let status = this.companyCorrespondence[i][1];
                let date = this.companyCorrespondence[i][2];
                let month;
                let day;

                try{
                    month = date.split("/")[0];
                    day = date.split("/")[1];
                } catch(err) {
                    continue;
                }

                let today = new Date();
                let thisDay = String(today.getDate());
                let thisMonth = String(today.getMonth() + 1);

                if (companyName == this.companyName &&
                    status == "Applied" &&
                    month == thisMonth &&
                    day == thisDay
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    isLogApplicationEnabled() {
        return !this.isApplicationLoggedToday() &&
            this.isGoogleRefreshEnabled() &&
            this.googleSheetId &&
            this.companyName;
    }

    activeScanningDocument() {
        if (!this.resumeId && !this.keywordResumeId) {
            return this.resumeTemplateName;
        } else if (!this.resumeId) {
            return this.keywordResumeName;
        } else {
            return this.resumeName();
        }
    }

}

export default Model;