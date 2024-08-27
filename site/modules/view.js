
function formatScanResults(jobscanResults) {

    let ul = document.createElement('ul');

    if (!jobscanResults || typeof jobscanResults != 'object' || !('highValueSkills' in jobscanResults)) {
       return ul;
    }

    let highValueSkills = jobscanResults['highValueSkills'];

    for (let i=0; i< highValueSkills.length; i++){
        if (highValueSkills[i].cvCount == 0){
            let li = document.createElement("li");
            let text = highValueSkills[i]['skill'] + " (" + highValueSkills[i]['type'] + ")"
            li.appendChild(document.createTextNode(text));
            ul.appendChild(li);
        }
    }

    return ul
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

    markupJobDescription() {
        console.debug("Marking up job description");
        let markedupJobDescription = this.model.jobDescription;
        let alreadyMarked = [];

        if (this.model.minimumRequirementsKeywords) {
            for (let i=0; i< this.model.minimumRequirementsKeywords['highValueSkills'].length; i++) {
                let keyword = this.model.minimumRequirementsKeywords['highValueSkills'][i]['skill'];
                if (alreadyMarked.includes(keyword) || this.model.minimumRequirementsKeywords['highValueSkills'][i].cvCount > 0) {
                    continue;
                } else {
                    alreadyMarked.push(keyword);
                    let regEx = new RegExp(keyword, 'ig');
                    let replaceMask = `<span class="missing-keyword-minimum">${keyword}</span>`;
                    markedupJobDescription = markedupJobDescription.replaceAll(regEx, replaceMask)
                }
            }
        }

        if (this.model.preferredRequirementsKeywords) {
            for (let i=0; i<this.model.preferredRequirementsKeywords['highValueSkills'].length; i++) {
                let keyword = this.model.preferredRequirementsKeywords['highValueSkills'][i]['skill'];
                if (alreadyMarked.includes(keyword) || this.model.preferredRequirementsKeywords['highValueSkills'][i].cvCount > 0) {
                    continue;
                } else {
                    alreadyMarked.push(keyword);
                    let regEx = new RegExp(keyword, 'ig');
                    let replaceMask = `<span class="missing-keyword-preferred">${keyword}</span>`;
                    markedupJobDescription = markedupJobDescription.replaceAll(regEx, replaceMask)
                }
            }
        }

        if (this.model.jobDutiesKeywords) {
            for (let i=0; i<this.model.jobDutiesKeywords['highValueSkills'].length; i++) {
                let keyword = this.model.jobDutiesKeywords['highValueSkills'][i]['skill'];
                if (alreadyMarked.includes(keyword) || this.model.jobDutiesKeywords['highValueSkills'][i].cvCount > 0) {
                    continue;
                } else {
                    alreadyMarked.push(keyword);
                    let regEx = new RegExp(keyword, 'ig');
                    let replaceMask = `<span class="missing-keyword-duties">${keyword}</span>`;
                    markedupJobDescription = markedupJobDescription.replaceAll(regEx, replaceMask)
                }
            }
        }

        if (this.model.companyInfoKeywords) {
            for (let i=0; i<this.model.companyInfoKeywords['highValueSkills'].length; i++) {
                let keyword = this.model.companyInfoKeywords['highValueSkills'][i]['skill'];
                if (alreadyMarked.includes(keyword) || this.model.companyInfoKeywords['highValueSkills'][i].cvCount > 0) {
                    continue;
                } else {
                    alreadyMarked.push(keyword);
                    let regEx = new RegExp(keyword, 'ig');
                    let replaceMask = `<span class="missing-keyword-company">${keyword}</span>`;
                    markedupJobDescription = markedupJobDescription.replaceAll(regEx, replaceMask)
                }
            }
        }

        if (this.model.regularKeywords) {
            for (let i=0; i<this.model.regularKeywords['highValueSkills'].length; i++) {
                let keyword = this.model.regularKeywords['highValueSkills'][i]['skill'];
                if (alreadyMarked.includes(keyword) || this.model.regularKeywords['highValueSkills'][i].cvCount > 0) {
                    continue;
                } else {
                    alreadyMarked.push(keyword);
                    let regEx = new RegExp(keyword, 'ig');
                    let replaceMask = `<span class="missing-keyword-regular">${keyword}</span>`;
                    markedupJobDescription = markedupJobDescription.replaceAll(regEx, replaceMask)
                }
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
        document.getElementById("job-description-textarea").value = this.model.jobDescription;

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
        document.getElementById("minimum-requirements").value = this.model.minimumRequirements;
        document.getElementById("preferred-requirements").value = this.model.preferredRequirements;
        document.getElementById("job-duties").value = this.model.jobDuties;
        document.getElementById("company-information").value = this.model.companyInfo;
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

        document.getElementById("company-information-score").innerHTML = this.model.companyInfoScore;
        if(this.model.companyInfoScore > 70) {
            document.getElementById("company-information-score-container").className = "scan-result-score-container score-good"
        } else if(this.model.jobDutiesScore > 0 && this.model.jobDutiesScore < 50) {
            document.getElementById("company-information-score-container").className = "scan-result-score-container score-bad"
        } else {
            document.getElementById("company-information-score-container").className = "scan-result-score-container score-neutral"
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

        document.getElementById("scanned-job-description").innerHTML = "";
        document.getElementById("scanned-job-description").innerHTML = this.markupJobDescription();

        document.getElementById("search-terms").value = this.model.searchTerms;

        document.getElementById("job-post-url").value = this.model.jobPostUrl;

        document.getElementById("active-scanning-document").innerText = this.model.activeScanningDocument();
    }

}

export default View;