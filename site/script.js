
async function reloadClones() {
    let resumeTemplateName = document.getElementById('resume-template-name').value;
    let coverLetterTemplateName = document.getElementById('cover-letter-template-name').value;
    let companyName = document.getElementById('company-name').value;

    if (!companyName || !resumeTemplateName || !coverLetterTemplateName) {
        console.log("Must supply company name, resume template, and cover letter template names!");
        return;
    }

    let newResumeName = companySpecificName(companyName, resumeTemplateName);
    let newResumeId = await getDocumentIdByName(newResumeName);
    document.getElementById('tailored-resume-link').innerHTML = newResumeName;
    document.getElementById('tailored-resume-link').href = gDocLinkFromId(newResumeId);
    document.getElementById('clone-status').innerHTML = "Templates cloned. Scroll to bottom for links."
    document.getElementById('clone-button').disabled = true;
    enableScanButtons();

    let newCoverLetterName = companySpecificName(companyName, coverLetterTemplateName);
    let newCoverLetterId = await getDocumentIdByName(newCoverLetterName);
    document.getElementById('tailored-cover-letter-link').innerHTML = newCoverLetterName;
    document.getElementById('tailored-cover-letter-link').href = gDocLinkFromId(newCoverLetterId);
    document.getElementById('clone-status').innerHTML = "Templates cloned. Scroll to bottom for links.";
    document.getElementById('clone-button').disabled = true;
}

async function cloneTemplates() {
    console.log("Handling tailor resume")
    let resumeTemplateName = document.getElementById('resume-template-name').value;
    let coverLetterTemplateName = document.getElementById('cover-letter-template-name').value;
    let companyName = document.getElementById('company-name').value;

    if (!companyName || !resumeTemplateName || !coverLetterTemplateName) {
        console.log("Must supply company name, resume template, and cover letter template names!");
        return;
    }

    let newResumeName = companySpecificName(companyName, resumeTemplateName);
    let resumeTemplateId = await getDocumentIdByName(resumeTemplateName);
    let newResumeId = await copyFile(resumeTemplateId, newResumeName);
    document.getElementById('tailored-resume-link').innerHTML = newResumeName;
    document.getElementById('tailored-resume-link').href = gDocLinkFromId(newResumeId);
    document.getElementById('clone-status').innerHTML = "Templates cloned. Scroll to bottom for links."
    document.getElementById('clone-button').disabled = true;
    enableScanButtons();

    let newCoverLetterName = companySpecificName(companyName, coverLetterTemplateName);
    let coverLetterId = await getDocumentIdByName(coverLetterTemplateName);
    let newCoverLetterId = await copyFile(coverLetterId, newCoverLetterName);

    document.getElementById('tailored-cover-letter-link').innerHTML = newCoverLetterName;
    document.getElementById('tailored-cover-letter-link').href = gDocLinkFromId(newCoverLetterId);
    document.getElementById('clone-status').innerHTML = "Templates cloned. Scroll to bottom for links.";
    document.getElementById('clone-button').disabled = true;
}

function loadJobScanCredentials() {
    console.log("Loading jobscan credentials");
    if (sessionStorage.getItem("jobscan-xsrf-token") ) {
        document.getElementById('jobscan-xsrf-token').value = sessionStorage.getItem("jobscan-xsrf-token");
    } else {
        console.log("Did not find token");
    }

    if (sessionStorage.getItem("jobscan-cookie") ) {
        document.getElementById('jobscan-cookie').value = sessionStorage.getItem("jobscan-cookie");
    } else {
        console.log("Did not find cookie");
    }
}

loadJobScanCredentials();

function saveJobScanCredentials() {
    sessionStorage.setItem("jobscan-cookie", document.getElementById('jobscan-cookie').value);
    sessionStorage.setItem("jobscan-xsrf-token", document.getElementById('jobscan-xsrf-token').value);
}

async function minScan() {
    let resumeTemplateName = document.getElementById('resume-template-name').value;
    let coverLetterTemplateName = document.getElementById('cover-letter-template-name').value;
    let companyName = document.getElementById('company-name').value;
    let jobscanCookie = document.getElementById("jobscan-cookie").value;
    let jobscanXsrfToken = document.getElementById("jobscan-xsrf-token").value;
    let minimumRequirements = document.getElementById("minimum-requirements").value;

    if (!companyName || !resumeTemplateName || !coverLetterTemplateName || !jobscanCookie || !jobscanXsrfToken || !minimumRequirements) {
        console.log("Must supply company name, resume template name, cover letter template name, jobscan cookie and xsrf token, and minimum requirements");
        return;
    }

    let newResumeName = companySpecificName(companyName, resumeTemplateName)
    let newResumeId = await getDocumentIdByName(newResumeName);
    let resumePlainText = await getPlaintextFileContents(newResumeId);
    let scanResult = await jobscan(jobscanCookie, jobscanXsrfToken, resumePlainText, minimumRequirements);

    console.log("Received scan results");
    document.getElementById("min-reqs-score").innerHTML = "Score: " + scanResult.matchRate.score;
}

function minPrefScan() {

}

function minPrefDutyScan() {

}

function completeScan() {

}

function companySpecificName(companyName, templateName) {
    return companyName + " " + templateName;
}

function enableScanButtons() {

    let scanButtons = document.getElementsByClassName("scan-button");
    for (let i=0; i<scanButtons.length; i++) {
        scanButtons[i].disabled = false;
    }
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
