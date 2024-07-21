
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


//function downloadLink(url) {
//    const a = document.createElement('a')
//    a.href = url
//    a.download = url.split('/').pop()
//    document.body.appendChild(a)
//    a.click()
//    document.body.removeChild(a)
//}

// TODO: Rename to View
class Renderer {
    constructor(view) {
        this.view = view;
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

        this.selectNavigationPage(this.view.navigationPage);

        document.getElementById("resume-template-name").value = this.view.resumeTemplateName;
        document.getElementById("cover-letter-template-name").value = this.view.coverLetterTemplateName;
        document.getElementById("linkedin-query").value = this.view.linkedInQuery;
        document.getElementById("company-name").value = this.view.companyName;
        document.getElementById("job-description-textarea").value = this.view.jobDescription;

        if (this.view.googleSignInEnabled) {
            this.enableGoogleSignInButton();
        }
    
        if (this.view.googleRefreshEnabled) {
            this.enableGoogleRefreshButton();
        }
    
        if (this.view.googleSignOutEnabled) {
            this.enableGoogleSignOutButton();
        }

        let extractButton = document.getElementById("extract-sections-button");
        if (this.view.extractJobSectionsEnabled) {
            extractButton.className = "big-button button";
            extractButton.disabled = false;
        } else {
            extractButton.className = "big-button button disabled-button";
            extractButton.disabled = true;
        }
    
        document.getElementById("application-date").value = this.view.date;

        document.getElementById("job-title").value = this.view.jobTitle;
        document.getElementById("minimum-requirements").value = this.view.minimumRequirements;
        document.getElementById("preferred-requirements").value = this.view.preferredRequirements;
        document.getElementById("job-duties").value = this.view.jobDuties;
        document.getElementById("company-information").value = this.view.companyInfo;

        document.getElementById("company-name-tailor").value = this.view.companyName;
        document.getElementById("company-name-possessive").value = this.view.companyNamePossessive;
        document.getElementById("company-address").value = this.view.companyAddress;
        document.getElementById("hiring-manager-name").value = this.view.hiringManager;
        document.getElementById("complete-job-title").value = this.view.completeJobTitle;
        document.getElementById("short-job-title").value = this.view.shortJobTitle;
        document.getElementById("company-values").value = this.view.values;
        document.getElementById("relevant-experience").value = this.view.relevantExperience;

        if (this.view.createResumeEnabled) {
            document.getElementById("create-resume-button").disabled = false;
            document.getElementById("create-resume-button").className = "big-button button";
            console.log("Create resume button is ready");
        } else {
            console.log("Create resume button is not ready");
            document.getElementById("create-resume-button").disabled = true;
            document.getElementById("create-resume-button").className = "big-button disabled-button button";
        }

        if (this.view.scanEnabled) {
            document.getElementById("scan-button").disabled = false;
            document.getElementById("scan-button").className = "big-button button";
        } else {
            document.getElementById("scan-button").disabled = true;
            document.getElementById("scan-button").className = "big-button button disabled-button";
        }

        document.getElementById("minimum-score").innerHTML = this.view.minimumRequirementsScore;
        if (this.view.minimumRequirementsKeywords) {
            let keywordsDiv = document.getElementById("minimum-requirements-keywords");
            keywordsDiv.innerHTML = '';
            let ul = formatScanResults(this.view.minimumRequirementsKeywords);
            keywordsDiv.appendChild(ul);
        }

        document.getElementById("preferred-score").innerHTML = this.view.preferredRequirementsScore;
        if (this.view.preferredRequirementsKeywords) {
            let keywordsDiv = document.getElementById("preferred-requirements-keywords");
            keywordsDiv.innerHTML = '';
            let ul = formatScanResults(this.view.preferredRequirementsKeywords);
            keywordsDiv.appendChild(ul);
        }

        document.getElementById("job-duties-score").innerHTML = this.view.jobDutiesScore;
        if (this.view.jobDutiesKeywords) {
            let keywordsDiv = document.getElementById("job-duties-keywords");
            keywordsDiv.innerHTML = '';
            let ul = formatScanResults(this.view.jobDutiesKeywords);
            keywordsDiv.appendChild(ul);
        }

        document.getElementById("company-information-score").innerHTML = this.view.companyInfoScore;
        if (this.view.companyInfoKeywords) {
            let keywordsDiv = document.getElementById("company-information-keywords");
            keywordsDiv.innerHTML = '';
            let ul = formatScanResults(this.view.companyInfoKeywords);
            keywordsDiv.appendChild(ul);
        }

//        if (this.view.isTailorReady()) {
//            document.getElementById("tailor-documents-button").disabled = false;
//            document.getElementById("tailor-documents-button").className = "big-button button";
//        } else {
//            document.getElementById("tailor-documents-button").disabled = true;
//            document.getElementById("tailor-documents-button").className = "big-button button disabled-button";
//        }
    
        document.getElementById("profile-link-linkedin").value = this.view.linkedInProfileLink;
        document.getElementById("profile-link-github").value = this.view.githubProfileLink;
        document.getElementById("profile-link-website").value = this.view.websiteProfileLink;
    
        // TODO: sheet name
        // TODO: sheet link
        // TODO: log app button

    //    // resume link
    //    // TODO: Open the google doc, not the PDF link
    //    let docLink = this.view.getResumeDocLink();
    //    if (docLink) {
    //        console.log("Updating pdf link: " + docLink);
    //        document.getElementById('tailored-resume-link').innerHTML = this.view.getResumeName();
    //        document.getElementById('tailored-resume-link').href = docLink;
    //    } else {
    //        console.log("Cannot update pdf link: " + pdfLink);
    //        document.getElementById('tailored-resume-link').innerHTML = "Not ready";
    //        document.getElementById('tailored-resume-link').href = "";
    //    }
    //
    //    // cover letter link
    //    // TODO: Open the google doc, not the PDF link
    //    pdfLink = await this.view.coverLetter.getPdfLink();
    //    if (pdfLink) {
    //        console.log("Updating cover letter pdf link: " + pdfLink);
    //        document.getElementById('tailored-cover-letter-link').innerHTML = this.view.coverLetter.getName();
    //        document.getElementById('tailored-cover-letter-link').href = pdfLink;
    //    } else {
    //        console.log("Cannot update cover letter pdf link: " + pdfLink);
    //        document.getElementById('tailored-cover-letter-link').innerHTML = "Not ready";
    //        document.getElementById('tailored-cover-letter-link').href = "";
    //    }
    
        // TODO: pdf button 1
        // TODO: pdf button 2
    }

}

export default Renderer;