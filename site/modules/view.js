function formatSearchResults(searchResults) {

    if (!searchResults || typeof searchResults != "object") {
       return;
    }

    document.getElementById('search-results-container').innerHTML = "";

    for (let i=0; i< searchResults["results"].length; i++){
        let card = document.createElement("div");
        card.className = "search-results-card";

        let strong = document.createElement("strong");
        strong.innerHTML = "Score: " + searchResults["results"][i]["score"];

        let body = document.createElement("div");
        body.innerHTML = searchResults["results"][i]["job_description"];

        card.appendChild(strong);
        card.appendChild(body);

        document.getElementById('search-results-container').appendChild(card);
    }

}

function formatCorrespondence(companyCorrespondence) {

    let ul = document.createElement('ul');

    for (let i=0; i< companyCorrespondence.length; i++){
        let correspondence = companyCorrespondence[i];
        let category = correspondence[1];
        let date = correspondence[2];
        let li = document.createElement("li");
        let text = category + ": " + date
        li.appendChild(document.createTextNode(text));
        ul.appendChild(li);
    }

    return ul
}

function fileLinkText(filename, fileid) {
    if (!filename || filename == "" || filename == "undefined") {
        return "";
    } else if (fileid && fileid != "undefined" && fileid != "") {
        return "View File";
    } else if (fileid) {
        return "File not found";
    } else {
        return "Missing file name";
    }
}


class View {
    constructor(model) {
        this.model = model;
        this.jobSections = [];
    }

    selectNavigationPage(buttonId) {
        let button = document.getElementById(buttonId);
        let pages = document.getElementsByClassName("page");
        let pageName = buttonId.replace("nav-button-", "");

        for (let i = 0; i < pages.length; i++) {
            pages[i].hidden = true;
        }

        document.getElementById(pageName).hidden = false;

        let activeButtons = document.getElementsByClassName("nav-active");
        for (let i = 0; i < activeButtons.length; i++) {
            activeButtons[i].className = "nav-inactive nav-button";
        }

        document.getElementById("nav-button-" + pageName).className = "nav-active nav-button";
    }

    disableGoogleSignInButton() {
        document.getElementById("google-authorize-button").innerText = "Google Sign In";
        document.getElementById("google-authorize-button").className = "disabled-button button"
        document.getElementById("google-authorize-button").disabled = true;
    }

    enableGoogleSignInButton() {
        document.getElementById("google-authorize-button").innerText = "Google Sign In";
        document.getElementById("google-authorize-button").className = "button"
        document.getElementById("google-authorize-button").disabled = false;
    }

    enableGoogleRefreshButton() {
        document.getElementById("google-authorize-button").innerText = "Google Refresh";
        document.getElementById("google-authorize-button").className = "button"
        document.getElementById("google-authorize-button").disabled = false;
    }

    enableGoogleSignOutButton() {
        document.getElementById("google-signout-button").innerText = "Google Sign Out";
        document.getElementById("google-signout-button").className = "button"
        document.getElementById("google-signout-button").disabled = false;
    }

    markupJobDescription(text, keywords, className) {
        console.debug("Marking up job description");
        if (!text || text == "" || text == "undefined"){
            return "";
        }

        if (!keywords || keywords == "" || keywords == "undefined"){
            return text;
        }

        let markedupJobDescription = text;
        let alreadyMarked = [];

        for (let i=0; i<keywords['highValueSkills'].length; i++) {
            let keyword = keywords['highValueSkills'][i]['skill'];
            if (alreadyMarked.includes(keyword) || keywords['highValueSkills'][i].cvCount > 0) {
                continue;
            } else {
                alreadyMarked.push(keyword);
                let regEx = new RegExp(keyword, 'ig');
                let replaceMask = `<span class="${className}">${keyword}</span>`;
                markedupJobDescription = markedupJobDescription.replaceAll(regEx, replaceMask)
            }
        }

        return markedupJobDescription;
    }

    render() {
        console.debug("Rendering");

        document.getElementById("keyword-resume-name").value = this.model.keywordResumeName;
        if (!this.model.keywordResumeName || this.model.keywordResumeName == "" || this.model.keywordResumeName == "undefined") {
            document.getElementById("file-status-keyword-resume").src = "";
            document.getElementById("file-status-keyword-resume").style = "display: none;";
        } else if (this.model.keywordResumeId && this.model.keywordResumeId != "" && this.model.keywordResumeId != "undefined") {
            document.getElementById("file-status-keyword-resume").src = "assets/Green_check.svg";
            document.getElementById("file-status-keyword-resume").style = "";
        } else {
            document.getElementById("file-status-keyword-resume").src = "assets/Question_mark_alternate.svg";
            document.getElementById("file-status-keyword-resume").style = "";
        }
        document.getElementById("keyword-resume-link").href = this.model.googleDocLink(this.model.keywordResumeId);
        document.getElementById("keyword-resume-link").innerHTML = fileLinkText(this.model.keywordResumeName, this.model.keywordResumeId);

        document.getElementById("resume-template-name").value = this.model.resumeTemplateName;
        if (!this.model.resumeTemplateName || this.model.resumeTemplateName == "" || this.model.resumeTemplateName == "undefined") {
            document.getElementById("file-status-resume-template").src = "";
            document.getElementById("file-status-resume-template").style = "display: none;";
        } else if (this.model.resumeTemplateId && this.model.resumeTemplateId != "" && this.model.resumeTemplateId != "undefined") {
            document.getElementById("file-status-resume-template").src = "assets/Green_check.svg";
            document.getElementById("file-status-resume-template").style = "";
        } else {
            document.getElementById("file-status-resume-template").src = "assets/Question_mark_alternate.svg";
            document.getElementById("file-status-resume-template").style = "";
        }
        document.getElementById("resume-template-link").href = this.model.googleDocLink(this.model.resumeTemplateId);
        document.getElementById("resume-template-link").innerHTML = fileLinkText(this.model.resumeTemplateName, this.model.resumeTemplateId);


        document.getElementById("cover-letter-template-name").value = this.model.coverLetterTemplateName;
        if (!this.model.coverLetterTemplateName || this.model.coverLetterTemplateName == "" || this.model.coverLetterTemplateName == "undefined") {
            document.getElementById("file-status-cover-letter-template").src = "";
            document.getElementById("file-status-cover-letter-template").style = "display: none;";
        } else if (this.model.coverLetterTemplateId && this.model.coverLetterTemplateId != "" && this.model.coverLetterTemplateId != "undefined") {
            document.getElementById("file-status-cover-letter-template").src = "assets/Green_check.svg";
            document.getElementById("file-status-cover-letter-template").style = "";
        } else {
            document.getElementById("file-status-cover-letter-template").src = "assets/Question_mark_alternate.svg";
            document.getElementById("file-status-cover-letter-template").style = "";
        }
        document.getElementById("cover-letter-template-link").href = this.model.googleDocLink(this.model.coverLetterTemplateId);
        document.getElementById("cover-letter-template-link").innerHTML = fileLinkText(this.model.coverLetterTemplateName, this.model.coverLetterTemplateId);

        document.getElementById("linkedin-query").value = this.model.linkedInQuery;
        document.getElementById("company-name").value = this.model.companyName;
        document.getElementById("job-description-div-editable").innerHTML = this.model.jobDescription;

        document.getElementById("glassdoor-search-link").href = this.model.glassdoorSearchLink();
        document.getElementById("levels-fyi-link").href = this.model.levelsFyiLink();

        if (this.model.isGoogleSignInEnabled()) {
            this.enableGoogleSignInButton();
        }
    
        if (this.model.isGoogleRefreshEnabled()) {
            this.enableGoogleRefreshButton();
        }
    
        if (this.model.isGoogleSignOutEnabled()) {
            this.enableGoogleSignOutButton();
        }
    
        document.getElementById("application-date").value = this.model.date;
        document.getElementById("job-title").value = this.model.jobTitle;
        document.getElementById("job-minimum-requirements-div-editable").innerText = this.model.minimumRequirements;
        document.getElementById("job-preferred-requirements-div-editable").innerText = this.model.preferredRequirements;
        document.getElementById("job-duties-div-editable").innerText = this.model.jobDuties;
        document.getElementById("job-company-info-div-editable").innerText = this.model.companyInfo;
        document.getElementById("company-name-tailor").value = this.model.companyName;
        document.getElementById("company-name-possessive").value = this.model.companyNamePossessive;
        document.getElementById("hiring-manager-name").value = this.model.hiringManager;
        document.getElementById("complete-job-title").value = this.model.completeJobTitle;
        document.getElementById("short-job-title").value = this.model.shortJobTitle;
        document.getElementById("company-values").value = this.model.companyValues;
        document.getElementById("relevant-experience").value = this.model.relevantExperience;

        if (this.model.isCreateResumeEnabled()) {
            document.getElementById("create-resume-button").disabled = false;
            document.getElementById("create-resume-button").className = "big-button button";
            console.log("Create resume button is ready");
        } else {
            console.log("Create resume button is not ready");
            document.getElementById("create-resume-button").disabled = true;
            document.getElementById("create-resume-button").className = "big-button disabled-button button";
        }

        if (this.model.isScanEnabled()) {
            document.getElementById("scan-button").disabled = false;
            document.getElementById("scan-button").className = "big-button button";
        } else {
            document.getElementById("scan-button").disabled = true;
            document.getElementById("scan-button").className = "big-button button disabled-button";
        }

        document.getElementById("regular-score").innerHTML = this.model.regularScore;
        if(this.model.regularScore > 70) {
            document.getElementById("regular-score-container").className = "scan-result-score-container score-good"
        } else if(this.model.regularScore > 0 && this.model.regularScore < 50) {
            document.getElementById("regular-score-container").className = "scan-result-score-container score-bad"
        } else {
            document.getElementById("regular-score-container").className = "scan-result-score-container score-neutral"
        }

        document.getElementById("minimum-score").innerHTML = this.model.minimumRequirementsScore;
        if(this.model.minimumRequirementsScore > 70) {
            document.getElementById("minimum-score-container").className = "scan-result-score-container score-good"
        } else if(this.model.minimumRequirementsScore > 0 && this.model.minimumRequirementsScore < 50) {
            document.getElementById("minimum-score-container").className = "scan-result-score-container score-bad"
        } else {
            document.getElementById("minimum-score-container").className = "scan-result-score-container score-neutral"
        }

        document.getElementById("preferred-score").innerHTML = this.model.preferredRequirementsScore;
        if(this.model.preferredRequirementsScore > 70) {
            document.getElementById("preferred-score-container").className = "scan-result-score-container score-good"
        } else if(this.model.preferredRequirementsScore > 0 && this.model.preferredRequirementsScore < 50) {
            document.getElementById("preferred-score-container").className = "scan-result-score-container score-bad"
        } else {
            document.getElementById("preferred-score-container").className = "scan-result-score-container score-neutral"
        }

        document.getElementById("job-duties-score").innerHTML = this.model.jobDutiesScore;
        if(this.model.jobDutiesScore > 70) {
            document.getElementById("job-duties-score-container").className = "scan-result-score-container score-good"
        } else if(this.model.jobDutiesScore > 0 && this.model.jobDutiesScore < 50) {
            document.getElementById("job-duties-score-container").className = "scan-result-score-container score-bad"
        } else {
            document.getElementById("job-duties-score-container").className = "scan-result-score-container score-neutral"
        }

        document.getElementById("company-info-score").innerHTML = this.model.companyInfoScore;
        if(this.model.companyInfoScore > 70) {
            document.getElementById("company-info-score-container").className = "scan-result-score-container score-good"
        } else if(this.model.jobDutiesScore > 0 && this.model.jobDutiesScore < 50) {
            document.getElementById("company-info-score-container").className = "scan-result-score-container score-bad"
        } else {
            document.getElementById("company-info-score-container").className = "scan-result-score-container score-neutral"
        }

        document.getElementById("profile-link-linkedin").value = this.model.linkedInProfileLink;
        document.getElementById("profile-link-github").value = this.model.githubProfileLink;
        document.getElementById("profile-link-website").value = this.model.websiteProfileLink;

        document.getElementById('tailored-resume-link').innerHTML = this.model.tailoredResumeLinkText();
        document.getElementById('tailored-resume-link').href = this.model.tailoredResumeLink();

        document.getElementById('tailored-cover-letter-link').innerHTML = this.model.tailoredCoverLetterLinkText();
        document.getElementById('tailored-cover-letter-link').href = this.model.tailoredCoverLetterLink();

        if (this.model.tailoredResumeDlButtonEnabled()) {
            document.getElementById('resume-download-button').disabled = false;
            document.getElementById('resume-download-button').className = "button fa fa-download";
        } else {
            document.getElementById('resume-download-button').disabled = true;
            document.getElementById('resume-download-button').className = "disabled-button button fa fa-download";
        }

        if (this.model.tailoredCoverLetterDlButtonEnabled()) {
            document.getElementById('cover-letter-download-button').disabled = false;
            document.getElementById('cover-letter-download-button').className = "button fa fa-download";
        } else {
            document.getElementById('cover-letter-download-button').disabled = true;
            document.getElementById('cover-letter-download-button').className = "disabled-button button fa fa-download";
        }

        document.getElementById("application-log-sheet-name").value = this.model.googleSheetName;
        document.getElementById("application-log-sheet-link").href = this.model.googleSheetLink();
        document.getElementById("application-log-sheet-link").innerHTML = fileLinkText(this.model.googleSheetName, this.model.googleSheetId);

        if (!this.model.googleSheetName || this.model.googleSheetName == "" || this.model.googleSheetName == "undefined") {
            document.getElementById("file-status-application-log-sheet").src = "";
            document.getElementById("file-status-application-log-sheet").style = "display: none;";
        } else if (this.model.googleSheetId && this.model.googleSheetId != "" && this.model.googleSheetId != "undefined") {
            document.getElementById("file-status-application-log-sheet").src = "assets/Green_check.svg";
            document.getElementById("file-status-application-log-sheet").style = "";
        } else {
            document.getElementById("file-status-application-log-sheet").src = "assets/Question_mark_alternate.svg";
            document.getElementById("file-status-application-log-sheet").style = "";
        }

        if (this.model.isLogApplicationEnabled()) {
            document.getElementById("log-application-button").disabled = false;
            document.getElementById("log-application-button").className = "button big-button";
        } else {
            document.getElementById("log-application-button").disabled = true;
            document.getElementById("log-application-button").className = "button disabled-button big-button";
        }

        if (this.model.isTailorApplyEnabled()) {
            document.getElementById("tailor-documents-button").disabled = false;
            document.getElementById("tailor-documents-button").className = "big-button button button";
        } else {
            document.getElementById("tailor-documents-button").disabled = true;
            document.getElementById("tailor-documents-button").className = "big-button button disabled-button";
        }

        document.getElementById("status-message").innerHTML = this.model.statusMessage;

        if (this.model.companyCorrespondence) {
            let keywordsDiv = document.getElementById("company-correspondence");
            keywordsDiv.innerHTML = '';
            let ul = formatCorrespondence(this.model.companyCorrespondence);
            keywordsDiv.appendChild(ul);
        } else {
            document.getElementById("company-correspondence").innerHTML = '';
        }

        this.jobSections.map((section) => {section.markupDiv.innerHTML = ""});
        document.getElementById("job-description-div-markup").innerHTML = this.markupJobDescription(
            this.model.jobDescription,
            this.model.regularKeywords,
            "missing-keyword-regular");
        document.getElementById("score-reminder-regular").innerHTML = this.model.regularScore;

        document.getElementById("job-minimum-requirements-div-markup").innerHTML = this.markupJobDescription(
            this.model.minimumRequirements,
            this.model.minimumRequirementsKeywords,
            "missing-keyword-minimum");
        document.getElementById("score-reminder-minimum").innerHTML = this.model.minimumRequirementsScore;

        document.getElementById("job-preferred-requirements-div-markup").innerHTML = this.markupJobDescription(
            this.model.preferredRequirements,
            this.model.preferredRequirementsKeywords,
            "missing-keyword-preferred");
        document.getElementById("score-reminder-preferred").innerHTML = this.model.preferredRequirementsScore;

        document.getElementById("job-duties-div-markup").innerHTML = this.markupJobDescription(
            this.model.jobDuties,
            this.model.jobDutiesKeywords,
            "missing-keyword-duties");
        document.getElementById("score-reminder-duties").innerHTML = this.model.jobDutiesScore;

        document.getElementById("job-company-info-div-markup").innerHTML = this.markupJobDescription(
            this.model.companyInfo,
            this.model.companyInfoKeywords,
            "missing-keyword-company");
        document.getElementById("score-reminder-company").innerHTML = this.model.companyInfoScore;

        document.getElementById("search-terms").value = this.model.searchTerms;

        document.getElementById("job-post-url").value = this.model.jobPostUrl;

        document.getElementById("active-scanning-document").innerText = this.model.activeScanningDocument();

        formatSearchResults(this.model.searchResults);
    }

    showJobSectionKeywords() {
        this.jobSections.map((section) => {
            if (section.sectionName != "job-description"){
                section.showMarkup();
            }
        });
    }

    showJobSectionEdits() {
        this.jobSections.map((section) => {section.showEditable();});
    }

}

export default View;