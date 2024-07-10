var resumeTemplateName;
var resumeTemplateId;
var coverLetterTemplateName;
var coverLetterTemplateId;
var companyName;
var newResumeName;
var newResumeId;
var newCoverLetterName;
var newCoverLetterId;
var jobscanCookie;
var jobscanXsrfToken;
var minimumRequirements;
var preferredRequirements;
var jobDuties;
var companyInformation;
var googleClientId;
var googleApiKey;
var credentialFile;

function setCloneVars() {
    resumeTemplateName = document.getElementById('resume-template-name').value;
    coverLetterTemplateName = document.getElementById('cover-letter-template-name').value;
    companyName = document.getElementById('company-name').value;
    newResumeName = companySpecificName(companyName, resumeTemplateName);
    newCoverLetterName = companySpecificName(companyName, coverLetterTemplateName);
}

function checkCloneVars() {
    return companyName && resumeTemplateName && coverLetterTemplateName;
}

function initCloneVars() {
    if (!checkCloneVars()) {
        setCloneVars();
    }
}

function disableCloneButton() {
    let cloneButton = document.getElementById('clone-button');
    cloneButton.disabled = true;
    cloneButton.className = "disabled-button button";
}

function hideButtonInstruction() {
    let elements = document.getElementsByClassName("button-instruction");
    for (let i=0; i < elements.length; i++) {
        elements[i].hidden = true;
    }
}

function enableScanButton() {
    let scanButton = document.getElementById('scan-button');
    scanButton.disabled = false;
    scanButton.className = "scan-button button";

    hideButtonInstruction();
}

function updateNewResumeData(newResumeId) {
    document.getElementById('tailored-resume-link').innerHTML = newResumeName;
    document.getElementById('tailored-resume-link').href = gDocLinkFromId(newResumeId);

    let resumeDownloadButton = document.getElementById('resume-download-button');
    resumeDownloadButton.disabled = false;
    resumeDownloadButton.className = "button fa fa-download";
}

function updateNewCoverLetterData(newCoverLetterId) {
    document.getElementById('tailored-cover-letter-link').innerHTML = newCoverLetterName;
    document.getElementById('tailored-cover-letter-link').href = gDocLinkFromId(newCoverLetterId);

//    document.getElementById('cover-letter-download-button').disabled = false;
    let coverLetterDownloadButton = document.getElementById('cover-letter-download-button');
    coverLetterDownloadButton.disabled = false;
    coverLetterDownloadButton.className = "button fa fa-download";
}

async function reloadClones() {
    console.log("Attempting to reload cloned templates");

    initCloneVars();

    newResumeId = await getDocumentIdByName(newResumeName);
    if (newResumeId) {
        updateNewResumeData(newResumeId);
    }

    newCoverLetterId = await getDocumentIdByName(newCoverLetterName);
    if (newCoverLetterId) {
        updateNewCoverLetterData(newCoverLetterId);
    }

    disableCloneButton();
    enableScanButton();
}

async function cloneTemplates() {
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


function initCredentialFileListener() {
    document.getElementById('credential-file').addEventListener('change', function (event) {
        let fr = new FileReader();
        fr.onload = function () {

            credentials = JSON.parse(fr.result);
            googleApiKey = credentials['google-api-key'];
            googleClientId = credentials['google-client-id'];
            jobscanXsrfToken = credentials['jobscan-xsrf-token'];
            jobscanCookie = credentials['jobscan-cookie'];
            sessionStorage.setItem('google-api-key', googleApiKey);
            sessionStorage.setItem('google-client-id', googleClientId);
            sessionStorage.setItem('jobscan-xsrf-token', jobscanXsrfToken);
            sessionStorage.setItem('jobscan-cookie', jobscanCookie);
            if (googleApiKey && googleClientId) {
                gapiLoaded(googleApiKey);
                gisLoaded(googleClientId);
            }
            console.log("Finished loading credentials");
        }

        fr.readAsText(this.files[0]);
    });

    console.log("Registered event listener for credential file");
}

function loadCredentialsFromSession() {
    console.log("Loading credentials from session");

    if (sessionStorage.getItem("google-client-id")) {
        googleClientId = sessionStorage.getItem("google-client-id");
        console.log("Loaded Google Client ID from session");
    }

    if (sessionStorage.getItem("google-api-key")) {
        googleApiKey = sessionStorage.getItem("google-api-key");
        console.log("Loaded Google API key from session");
    }

    if (sessionStorage.getItem("jobscan-cookie")) {
        jobscanCookie = sessionStorage.getItem("jobscan-cookie");
        console.log("Loaded Jobscan Cookie from session");
    }

    if (sessionStorage.getItem("jobscan-xsrf-token")) {
        jobscanXsrfToken = sessionStorage.getItem("jobscan-xsrf-token");
        console.log("Loaded Jobscan XSRF Token from session");
    }

    if (googleClientId && googleApiKey) {
        gapiLoaded(googleApiKey);
        gisLoaded(googleClientId);
    }
}

async function initialize() {
    initCredentialFileListener();
    loadCredentialsFromSession();
}

async function handleSaveGoogleCredentials() {
    sessionStorage.setItem("google-client-id", document.getElementById('google-client-id').value);
    sessionStorage.setItem("google-api-key", document.getElementById('google-api-key').value);
}
/**
*  Sign in the user upon button click.
*/
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw (resp);
      }
      document.getElementById('signout_button').style.visibility = 'visible';
      document.getElementById('authorize_button').innerText = 'Refresh';
      sessionStorage.setItem("gapi-token", JSON.stringify(gapi.client.getToken()));
//      await listFiles();
    };

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({prompt: ''});
    }

}

/**
*  Sign out the user upon button click.
*/
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
//        document.getElementById('content').innerText = '';
        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

function checkJobscanVars() {
    return companyName && resumeTemplateId && jobscanCookie && jobscanXsrfToken && minimumRequirements;
}


function getPreferredRequirements() {
   let minReqs = document.getElementById("minimum-requirements").value;
   let prefReqs = document.getElementById("preferred-requirements").value;
   return minReqs + prefReqs;
}

async function handleScanButton() {
    console.log("Scanning resume against minimum requirements");

    resumePlainText = await getPlaintextFileContents(newResumeId);

    let jobDescription = document.getElementById("minimum-requirements").value;;
    let results = await jobscan(jobscanCookie, jobscanXsrfToken, resumePlainText, jobDescription);
    let score = results.matchRate.score;
    document.getElementById("minimum-score").innerHTML = "Score: " + score;

    preferredRequirements = document.getElementById("preferred-requirements").value;
    includePreferred = document.getElementById("include-preferred-checkbox").checked;
    if (includePreferred && preferredRequirements) {
        jobDescription = jobDescription + preferredRequirements;
        results = await jobscan(jobscanCookie, jobscanXsrfToken, resumePlainText, jobDescription);
        score = results.matchRate.score;
        document.getElementById("preferred-score").innerHTML = "Score: " + score;
    }

    jobDuties = document.getElementById("job-duties").value;
    includeJobDuties = document.getElementById("include-job-duties-checkbox").checked;
    if ( includeJobDuties && jobDuties ) {
        jobDescription = jobDescription + jobDuties;
        results = await jobscan(jobscanCookie, jobscanXsrfToken, resumePlainText, jobDescription);
        score = results.matchRate.score;
        document.getElementById("job-duties-score").innerHTML = "Score: " + score;
    }

    companyInformation = document.getElementById("company-information").value;
    includeCompanyInformation = document.getElementById("include-company-information-checkbox").checked;
    if ( includeCompanyInformation && companyInformation ) {
        jobDescription = jobDescription + document.getElementById("company-information").value;
        results = await jobscan(jobscanCookie, jobscanXsrfToken, resumePlainText, jobDescription);
        score = results.matchRate.score;
        document.getElementById("company-information-score").innerHTML = "Score: " + score;
    }
}

function companySpecificName(companyName, templateName) {
    return companyName + " " + templateName;
}


function downloadLink(filename, url) {
    const a = document.createElement('a')
    a.href = url
    a.download = url.split('/').pop()
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

async function handleDownloadResumeButton() {
    console.log("Downloading resume");
    let pdfLink = await getPdfLink(newResumeId);
    downloadLink(newResumeName +".pdf", pdfLink);
}

async function handleDownloadCoverLetterButton() {
    console.log("Downloading cover letter");
    let pdfLink = await getPdfLink(newCoverLetterId);
    downloadLink(newCoverLetterName +".pdf", pdfLink);
}

function tailorResume   () {

}

function tailorLetter() {

}


function updateGoogleSheet() {

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
