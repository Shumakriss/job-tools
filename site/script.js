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

function updateNewResumeData(newResumeId) {
    document.getElementById('tailored-resume-link').innerHTML = newResumeName;
    document.getElementById('tailored-resume-link').href = gDocLinkFromId(newResumeId);
    document.getElementById('clone-button').disabled = true;
    enableScanButtons();
    document.getElementById('resume-download-button').disabled = false;
}

function updateNewCoverLetterData(newCoverLetterId) {
    document.getElementById('tailored-cover-letter-link').innerHTML = newCoverLetterName;
    document.getElementById('tailored-cover-letter-link').href = gDocLinkFromId(newCoverLetterId);
    document.getElementById('clone-button').disabled = true;
    document.getElementById('cover-letter-download-button').disabled = false;
}

async function reloadClones() {
    console.log("Attempting to reload cloned templates");

    initCloneVars();

    newResumeId = await getDocumentIdByName(newResumeName);
    updateNewResumeData(newResumeId);

    newCoverLetterId = await getDocumentIdByName(newCoverLetterName);
    updateNewCoverLetterData(newCoverLetterId);
}

async function cloneTemplates() {
    console.log("Cloning templates");

    await reloadClones();
    console.log(newResumeId);

    if ( !newResumeId ) {
        resumeTemplateId = await getDocumentIdByName(resumeTemplateName);
        newResumeName = companySpecificName(companyName, resumeTemplateName);
        newResumeId = await copyFile(resumeTemplateId, newResumeName);
        updateNewResumeData(newResumeId);
        console.log("Resume was not reloaded so it was created");
    } else {
        console.log("Reloaded resume clone");
    }

    if ( !newCoverLetterId ) {
        newCoverLetterName = companySpecificName(companyName, coverLetterTemplateName);
        coverLetterId = await getDocumentIdByName(coverLetterTemplateName);
        newCoverLetterId = await copyFile(coverLetterId, newCoverLetterName);
        updateNewCoverLetterData(newCoverLetterId);
        console.log("Cover letter was not reloaded so it was created");
    } else {
        console.log("Reloaded cover letter clone");
    }

    console.log("All files cloned");
}

function loadJobScanCredentials() {
    console.log("Loading jobscan credentials");
    if ( sessionStorage.getItem("jobscan-xsrf-token" ) ) {
        jobscanXsrfToken = sessionStorage.getItem("jobscan-xsrf-token" );
        document.getElementById('jobscan-xsrf-token').value = jobscanXsrfToken;
    } else {
        console.log("Did not find jobscan token");
    }

    if ( sessionStorage.getItem("jobscan-cookie") ) {
        jobscanCookie = sessionStorage.getItem("jobscan-cookie");
        document.getElementById('jobscan-cookie').value = jobscanCookie;
    } else {
        console.log("Did not find jobscan cookie");
    }
}

function loadGoogleCredentials() {
    console.log("Loading google credentials");

    let clientId = sessionStorage.getItem("google-client-id");
    if (clientId) {
        googleClientId = clientId;
        document.getElementById('google-client-id').value = googleClientId;
    } else {
        console.log("Google client ID not found in session storage");
    }

    let apiKey = sessionStorage.getItem("google-api-key");
    if (apiKey) {
        googleApiKey = apiKey;
        document.getElementById('google-api-key').value = apiKey;
    } else {
        console.log("Google API key not found in session storage");
    }
}

async function initialize() {
    loadJobScanCredentials();
    loadGoogleCredentials();
    if (googleApiKey && googleClientId) {
        await gapiLoaded(googleApiKey);
        await gisLoaded(googleClientId);
    }
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

function saveJobScanCredentials() {
    jobscanCookie = document.getElementById('jobscan-cookie').value;
    jobscanXsrfToken = document.getElementById('jobscan-xsrf-token').value;
    sessionStorage.setItem("jobscan-cookie", jobscanCookie);
    sessionStorage.setItem("jobscan-xsrf-token", jobscanXsrfToken);
}

function checkJobscanVars() {
    return companyName && resumeTemplateId && jobscanCookie && jobscanXsrfToken && minimumRequirements;
}

function initJobscanVars() {
    if ( !checkJobscanVars() ) {
        initCloneVars();
        saveJobScanCredentials();
        minimumRequirements = document.getElementById("minimum-requirements").value;
    }
}

function getPreferredRequirements() {
   let minReqs = document.getElementById("minimum-requirements").value;
   let prefReqs = document.getElementById("preferred-requirements").value;
   return minReqs + prefReqs;
}

async function doSingleScan(jobDescription) {
    console.log("Scanning resume");
    let scanResults = await jobscan(jobscanCookie, jobscanXsrfToken, resumePlainText, jobDescription);
    return scanResults;
}

async function handleScanButton() {
    console.log("Scanning resume against minimum requirements");

    initJobscanVars();
    resumePlainText = await getPlaintextFileContents(newResumeId);

    let jobDescription = minimumRequirements;
    let results = await doSingleScan(jobDescription);
    let score = results.matchRate.score;
    document.getElementById("minimum-score").innerHTML = "Score: " + score;

    preferredRequirements = document.getElementById("preferred-requirements").value;
    includePreferred = document.getElementById("include-preferred-checkbox").checked;
    if (includePreferred && preferredRequirements) {
        jobDescription = jobDescription + preferredRequirements;
        results = await doSingleScan(jobDescription);
        score = results.matchRate.score;
        document.getElementById("preferred-score").innerHTML = "Score: " + score;
    }

    jobDuties = document.getElementById("job-duties").value;
    includeJobDuties = document.getElementById("include-job-duties-checkbox").checked;
    if ( includeJobDuties && jobDuties ) {
        jobDescription = jobDescription + jobDuties;
        results = await doSingleScan(jobDescription);
        score = results.matchRate.score;
        document.getElementById("job-duties-score").innerHTML = "Score: " + score;
    }

    companyInformation = document.getElementById("company-information").value;
    includeCompanyInformation = document.getElementById("include-company-information-checkbox").checked;
    if ( includeCompanyInformation && companyInformation ) {
        jobDescription = jobDescription + document.getElementById("company-information").value;
        results = await doSingleScan(jobDescription);
        score = results.matchRate.score;
        document.getElementById("company-information-score").innerHTML = "Score: " + score;
    }
}

function companySpecificName(companyName, templateName) {
    return companyName + " " + templateName;
}

function enableScanButtons() {
//    let scanButtons = document.getElementsByClassName("scan-button");
//    for (let i=0; i<scanButtons.length; i++) {
//        scanButtons[i].disabled = false;
//    }
    document.getElementById("scan-button").disabled = false;
}


function updateGoogleSheet() {

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
