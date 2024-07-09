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
}

function updateNewCoverLetterData(newCoverLetterId) {
    document.getElementById('tailored-cover-letter-link').innerHTML = newCoverLetterName;
    document.getElementById('tailored-cover-letter-link').href = gDocLinkFromId(newCoverLetterId);
    document.getElementById('clone-button').disabled = true;
}

async function reloadClones() {
    console.log("Reloading cloned templates");

    initCloneVars();

    newResumeId = await getDocumentIdByName(newResumeName);
    updateNewResumeData(newResumeId);

    newCoverLetterId = await getDocumentIdByName(newCoverLetterName);
    updateNewCoverLetterData(newCoverLetterId);
}

async function cloneTemplates() {
    console.log("Cloning templates");

    initCloneVars();

    resumeTemplateId = await getDocumentIdByName(resumeTemplateName);
    newResumeName = companySpecificName(companyName, resumeTemplateName);
    newResumeId = await copyFile(resumeTemplateId, newResumeName);
    updateNewResumeData(newResumeId);

    newCoverLetterName = companySpecificName(companyName, coverLetterTemplateName);
    coverLetterId = await getDocumentIdByName(coverLetterTemplateName);
    newCoverLetterId = await copyFile(coverLetterId, newCoverLetterName);
    updateNewCoverLetterData(newCoverLetterId);
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

loadJobScanCredentials();

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

function exportResume() {
    console.log("Function exportResume() is not yet implemented.");
}

function tailorResume   () {

}

function tailorLetter() {

}
