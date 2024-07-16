/*  The initialize() function is called when index.html finishes loading the script.
    All initialization functions can be found in this file, though they may refer
    to other functions outside this file.
*/
var googleApi;
var app = new WebApplication();

async function initialize() {

    app.googleApi.apiInitCallback = () => {
        console.debug("App callback invoked by Google init");
        app.save();
        redraw();
    };

    app.googleApi.clientInitCallback = ()=>{
        console.debug("App callback invoked by Google client init");
        app.save();
        redraw();
    };

    app.googleApi.authenticatedCallback = () => {
        console.debug("App callback invoked by Google authentication");
        app.save();
        redraw();
    };

    app.googleApi.tokenClientCallback = () => {
        console.debug("App callback invoked by Google token client");
        app.save();
        redraw();
    };

    app.tryLoad();

    app.googleApi.init();
    addEventListeners();

    redraw();
}

/*
*  Event Listeners
*/

function debounce(callback, wait) {
  let timeout;
  return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(function () { callback.apply(this, args); }, wait);
  };
}

async function addEventListeners() {
    document.getElementById('credential-file').addEventListener('change', async function () {
        let fr = new FileReader();
        fr.onload = async function () {
            console.log("Credential file changed");
            let credentials = JSON.parse(fr.result);

            app.chatGpt.apiKey = credentials.chatGpt.apiKey;
            app.googleApi.apiKey = credentials.google.apiKey;
            app.googleApi.clientId = credentials.google.clientId;
            app.jobscan.xsrfToken = credentials.jobscan.xsrfToken;
            app.jobscan.cookie = credentials.jobscan.cookie;
            app.save();

            console.debug("Attempting to reload Google Drive Client.");
            await app.googleApi.init();
        }

        fr.readAsText(this.files[0]);
        redraw();
    });

    document.getElementById("company-name").addEventListener("change", debounce( (event) => {
        console.log("Invoked event listener for company-name");
        app.setCompanyName(event.target.value);
        app.save();
        redraw();
    }, 100));

    document.getElementById("resume-template-name").addEventListener("change", debounce( (event) => {
        console.debug("Invoked event listener for resume-template-name");
        app.resume.template.setName(event.target.value);
        app.save();
        redraw();
    }, 100));

    document.getElementById("cover-letter-template-name").addEventListener("change", debounce( (event) => {
        console.debug("Invoked event listener for cover-letter-template-name");
        app.coverLetter.template.setName(event.target.value);
        app.save();
        redraw();
    }, 100));

    document.getElementById('job-description-textarea').addEventListener('keydown', debounce( (event) => {
        app.job.setDescription(event.target.value);
        app.save();
        redraw();
    }, 200));

    document.getElementById('minimum-requirements').addEventListener('keydown', debounce( (event) => {
        app.job.minimumRequirements = event.target.value;
        redraw();
    }, 200));

    document.getElementById('application-log-sheet-name').addEventListener('change', debounce( (event) => {
        console.log("Application log sheet name changed");
        app.applicationLog.setName(event.target.value);
        redraw();
    }, 100));

    // job title
    // min reqs
    // pref reqs
    // job duties
    // company info
    // All the tailor fields

    console.debug("Registered listeners");
}


/*
*  Click handlers
*/

async function handleAuthClick() {
    console.debug("Google Sign In / Refresh button clicked");
    app.googleApi.authorize();
    redraw();
}

function handleSignoutClick() {
    console.debug("Google Sign Out button clicked");
    app.googleApi.signOut();
    redraw();
}

async function handleLogApplicationButton() {
    console.debug("Log application button clicked");
    app.applicationLog.append(app.company.getName());
    redraw();
}

async function handleSaveGoogleCredentials() {
    sessionStorage.setItem("google-client-id", document.getElementById('google-client-id').value);
    sessionStorage.setItem("google-api-key", document.getElementById('google-api-key').value);
}

async function handleScanButton(newResumeName) {
    console.log("Scanning resume against minimum requirements");

    let companySpecificName = session.companyName + " " + session.resumeTemplateName;
    let companySpecificDocId = await getDocumentIdByName(companySpecificName);
    let resumePlainText = await getPlaintextFileContents(companySpecificDocId);

    let jobDescription = document.getElementById("minimum-requirements").value;;
    let results = await jobscan(session.jobscanCookie,
        session.jobscanXsrfToken,
        resumePlainText,
        jobDescription);
    let score = results.matchRate.score;
    document.getElementById("minimum-score").innerHTML = score;
    document.getElementById("minimum-requirements-keywords").innerHTML = '';
    document.getElementById("minimum-requirements-keywords").appendChild(formatResults(results));
    document.getElementById("minimum-requirements-display").value = document.getElementById("minimum-requirements");

    preferredRequirements = document.getElementById("preferred-requirements").value;
    includePreferred = document.getElementById("include-preferred-checkbox").checked;
    if (includePreferred && preferredRequirements) {
        jobDescription = jobDescription + preferredRequirements;
        results = await jobscan(session.jobscanCookie,
            session.jobscanXsrfToken,
            resumePlainText,
            jobDescription);
        score = results.matchRate.score;
        document.getElementById("preferred-score").innerHTML = score;
        document.getElementById("preferred-requirements-keywords").innerHTML = '';
        document.getElementById("preferred-requirements-keywords").appendChild(formatResults(results));
    }

    jobDuties = document.getElementById("job-duties").value;
    includeJobDuties = document.getElementById("include-job-duties-checkbox").checked;
    if ( includeJobDuties && jobDuties ) {
        jobDescription = jobDescription + jobDuties;
        results = await jobscan(session.jobscanCookie,
            session.jobscanXsrfToken,
            resumePlainText,
            jobDescription);
        score = results.matchRate.score;
        document.getElementById("job-duties-score").innerHTML = score;
        document.getElementById("job-duties-keywords").innerHTML = '';
        document.getElementById("job-duties-keywords").appendChild(formatResults(results));
    }

    companyInformation = document.getElementById("company-information").value;
    includeCompanyInformation = document.getElementById("include-company-information-checkbox").checked;
    if ( includeCompanyInformation && companyInformation ) {
        jobDescription = jobDescription + document.getElementById("company-information").value;
        results = await jobscan(session.jobscanCookie,
            session.jobscanXsrfToken,
            resumePlainText,
            jobDescription);
        score = results.matchRate.score;
        document.getElementById("company-information-score").innerHTML = score;
        document.getElementById("company-information-keywords").innerHTML = '';
        document.getElementById("company-information-keywords").appendChild(formatResults(results));
    }
}

async function handleDownloadResumeButton() {
    console.log("Downloading resume");
    let elementName = "resume-template-name";
    let docName = document.getElementById(elementName).value;
    let companyName = document.getElementById("company-name").value;
    let newDocName = companySpecificName(companyName, docName);
    let newDocId = await getDocumentIdByName(newDocName);
    let pdfLink = await getPdfLink(newDocId);
    downloadLink(pdfLink);
    session.resumePdfLink = pdfLink;
    session.save()
}

async function handleDownloadCoverLetterButton() {
    console.log("Downloading cover letter");
    let elementName = "cover-letter-template-name";
    let docName = document.getElementById(elementName).value;
    let companyName = document.getElementById("company-name").value;
    let newDocName = companySpecificName(companyName, docName);
    let newDocId = await getDocumentIdByName(newDocName);
    let pdfLink = await getPdfLink(newDocId);
    downloadLink(pdfLink);
    session.coverLetterPdfLink = pdfLink;
    session.save()
}

function handleNavButtonClick(button, pageName) {
    let pages = document.getElementsByClassName("page");
    for (let i = 0; i < pages.length; i++) {
        pages[i].hidden = true;
    }

    document.getElementById(pageName).hidden = false;

    let activeButtons = document.getElementsByClassName("nav-active");
    for (let i = 0; i < activeButtons.length; i++) {
        activeButtons[i].className = "nav-inactive nav-button";
    }

    button.className = "nav-active nav-button";
}

async function handleExtractSectionsButton() {
    console.log("Extracting sections from job description");
    await app.extractJobDescriptionSections();
    app.save();
    redraw();
}


async function handleCreateResumeButton() {
    console.log("Cloning templates");

    await reloadClones();
    console.log(newResumeId);

    if ( !newResumeId ) {
        resumeTemplateId = await getDocumentIdByName(resumeTemplateName);
        if (resumeTemplateId) {
            newResumeName = companySpecificName(companyName, resumeTemplateName);
            newResumeId = await copyFile(resumeTemplateId, newResumeName);
            updateNewResumeData(newResumeId);
            console.log("Resume was not reloaded so it was created");
        } else {
            console.log("Resume Template ID not found. Are you authenticated with Google?");
        }

    } else {
        console.log("Reloaded resume clone");
    }

    if ( !newCoverLetterId ) {
        coverLetterId = await getDocumentIdByName(coverLetterTemplateName);
        if (coverLetterId) {
            newCoverLetterName = companySpecificName(companyName, coverLetterTemplateName);
            newCoverLetterId = await copyFile(coverLetterId, newCoverLetterName);
            updateNewCoverLetterData(newCoverLetterId);
            console.log("Cover letter was not reloaded so it was created");
        } else {
            console.log("Cover Letter Template ID not found. Are you authenticated with Google?");
        }
    } else {
        console.log("Reloaded cover letter clone");
    }

    console.log("All files cloned");
}

