
function formatScanResults(jobscanResults) {
    let ul = document.createElement('ul');

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

    render() {
        console.debug("Rendering");

//        this.selectNavigationPage(this.model.navigationPage);

        document.getElementById("resume-template-name").value = this.model.resumeTemplateName;
        document.getElementById("cover-letter-template-name").value = this.model.coverLetterTemplateName;
        document.getElementById("linkedin-query").value = this.model.linkedInQuery;
        document.getElementById("company-name").value = this.model.companyName;
        document.getElementById("job-description-textarea").value = this.model.jobDescription;

        if (this.model.googleSignInEnabled) {
            this.enableGoogleSignInButton();
        }
    
        if (this.model.googleRefreshEnabled) {
            this.enableGoogleRefreshButton();
        }
    
        if (this.model.googleSignOutEnabled) {
            this.enableGoogleSignOutButton();
        }

        let extractButton = document.getElementById("extract-sections-button");
        if (this.model.extractJobSectionsEnabled) {
            extractButton.className = "big-button button";
            extractButton.disabled = false;
        } else {
            extractButton.className = "big-button button disabled-button";
            extractButton.disabled = true;
        }
    
        document.getElementById("application-date").value = this.model.date;
        document.getElementById("job-title").value = this.model.jobTitle;
        document.getElementById("minimum-requirements").value = this.model.minimumRequirements;
        document.getElementById("preferred-requirements").value = this.model.preferredRequirements;
        document.getElementById("job-duties").value = this.model.jobDuties;
        document.getElementById("company-information").value = this.model.companyInfo;
        document.getElementById("company-name-tailor").value = this.model.companyName;
        document.getElementById("company-name-possessive").value = this.model.companyNamePossessive;
        document.getElementById("company-address").value = this.model.companyAddress;
        document.getElementById("hiring-manager-name").value = this.model.hiringManager;
        document.getElementById("complete-job-title").value = this.model.completeJobTitle;
        document.getElementById("short-job-title").value = this.model.shortJobTitle;
        document.getElementById("company-values").value = this.model.companyValues;
        document.getElementById("relevant-experience").value = this.model.relevantExperience;

        if (this.model.createResumeEnabled) {
            document.getElementById("create-resume-button").disabled = false;
            document.getElementById("create-resume-button").className = "big-button button";
            console.log("Create resume button is ready");
        } else {
            console.log("Create resume button is not ready");
            document.getElementById("create-resume-button").disabled = true;
            document.getElementById("create-resume-button").className = "big-button disabled-button button";
        }

        if (this.model.scanEnabled) {
            document.getElementById("scan-button").disabled = false;
            document.getElementById("scan-button").className = "big-button button";
        } else {
            document.getElementById("scan-button").disabled = true;
            document.getElementById("scan-button").className = "big-button button disabled-button";
        }

        document.getElementById("minimum-score").innerHTML = this.model.minimumRequirementsScore;
        if (this.model.minimumRequirementsKeywords) {
            let keywordsDiv = document.getElementById("minimum-requirements-keywords");
            keywordsDiv.innerHTML = '';
            let ul = formatScanResults(this.model.minimumRequirementsKeywords);
            keywordsDiv.appendChild(ul);
        } else {
            document.getElementById("minimum-requirements-keywords").innerHTML = '';
        }

        document.getElementById("preferred-score").innerHTML = this.model.preferredRequirementsScore;
        if (this.model.preferredRequirementsKeywords) {
            let keywordsDiv = document.getElementById("preferred-requirements-keywords");
            keywordsDiv.innerHTML = '';
            let ul = formatScanResults(this.model.preferredRequirementsKeywords);
            keywordsDiv.appendChild(ul);
        } else {
            document.getElementById("preferred-requirements-keywords").innerHTML = '';
        }

        document.getElementById("job-duties-score").innerHTML = this.model.jobDutiesScore;
        if (this.model.jobDutiesKeywords) {
            let keywordsDiv = document.getElementById("job-duties-keywords");
            keywordsDiv.innerHTML = '';
            let ul = formatScanResults(this.model.jobDutiesKeywords);
            keywordsDiv.appendChild(ul);
        } else {
            document.getElementById("job-duties-keywords").innerHTML = '';
        }

        document.getElementById("company-information-score").innerHTML = this.model.companyInfoScore;
        if (this.model.companyInfoKeywords) {
            let keywordsDiv = document.getElementById("company-information-keywords");
            keywordsDiv.innerHTML = '';
            let ul = formatScanResults(this.model.companyInfoKeywords);
            keywordsDiv.appendChild(ul);
        } else {
            document.getElementById("company-information-keywords").innerHTML = '';
        }
    
        document.getElementById("profile-link-linkedin").value = this.model.linkedInProfileLink;
        document.getElementById("profile-link-github").value = this.model.githubProfileLink;
        document.getElementById("profile-link-website").value = this.model.websiteProfileLink;

        if (this.model.tailoredResumeLink) {
            document.getElementById('tailored-resume-link').innerHTML = this.model.resumeName;
            document.getElementById('tailored-resume-link').href = this.model.tailoredResumeLink;
        } else {
            document.getElementById('tailored-resume-link').innerHTML = "Tailored Resume Not Ready";
            document.getElementById('tailored-resume-link').href = "";
        }

        if (this.model.tailoredCoverLetterLink) {
            document.getElementById('tailored-cover-letter-link').innerHTML = this.model.coverLetterName;
            document.getElementById('tailored-cover-letter-link').href = this.model.tailoredCoverLetterLink;
        } else {
            document.getElementById('tailored-cover-letter-link').innerHTML = "Tailored Cover Letter Not Ready";
            document.getElementById('tailored-cover-letter-link').href = "";
        }

//        debugger;
        if (this.model.resumePdfLink) {
            document.getElementById('resume-download-button').disabled = false;
            document.getElementById('resume-download-button').className = "button fa fa-download";
        } else {
            document.getElementById('resume-download-button').disabled = true;
            document.getElementById('resume-download-button').className = "disabled-button button fa fa-download";
        }

        if (this.model.coverLetterPdfLink) {
            document.getElementById('cover-letter-download-button').disabled = false;
            document.getElementById('cover-letter-download-button').className = "button fa fa-download";
        } else {
            document.getElementById('cover-letter-download-button').disabled = true;
            document.getElementById('cover-letter-download-button').className = "disabled-button button fa fa-download";
        }

        document.getElementById("application-log-sheet-name").value = this.model.googleSheetName;
        document.getElementById("application-log-sheet-link").href = this.model.googleSheetLink;
        document.getElementById("application-log-sheet-link").innerHTML = this.model.googleSheetLinkText;

        if (this.model.logApplicationEnabled) {
            document.getElementById("log-application-button").disabled = false;
            document.getElementById("log-application-button").className = "button";
        } else {
            document.getElementById("log-application-button").disabled = true;
            document.getElementById("log-application-button").className = "button disabled-button";
        }

        if (this.model.tailorEnabled) {
            document.getElementById("tailor-documents-button").disabled = false;
            document.getElementById("tailor-documents-button").className = "big-button button button";
        } else {
            document.getElementById("tailor-documents-button").disabled = true;
            document.getElementById("tailor-documents-button").className = "big-button button disabled-button";
        }

        document.getElementById("status-message").innerHTML = this.model.statusMessage;
    }

}

export default View;