function liToClip() {
    navigator.clipboard.writeText("https://www.linkedin.com/in/christophershumaker/");
}

function ghToClip() {
    navigator.clipboard.writeText("https://github.com/Shumakriss");
}

function siteToClip() {
    navigator.clipboard.writeText("https://www.makerconsulting.llc/maker-consulting");
}

function gDocLinkFromId(gDocId) {
    return "https://docs.google.com/document/d/" + gDocId + "/edit";
}

function companySpecificName(companyName, templateName) {
    return companyName + " " + templateName;
}

let newFileId;
let newResumeId;

function enableScanButtons() {

    let scanButtons = document.getElementsByClassName("scan-button");
    for (let i=0; i<scanButtons.length; i++) {
        scanButtons[i].disabled = false;
    }
}

function reloadClones() {
    let resumeTemplateName = document.getElementById('resume-template-name').value;
    let coverLetterTemplateName = document.getElementById('cover-letter-template-name').value;
    let companyName = document.getElementById('company-name').value;

    if (!companyName || !resumeTemplateName || !coverLetterTemplateName) {
        console.log("Must supply company name, resume template, and cover letter template names!");
        return;
    }

    let newResumeName = companySpecificName(companyName, resumeTemplateName)
    getDocumentIdByName(newResumeName).then(function (newResumeId) {
        document.getElementById('tailored-resume-link').innerHTML = newResumeName;
        document.getElementById('tailored-resume-link').href = gDocLinkFromId(newResumeId);
        document.getElementById('clone-status').innerHTML = "Templates cloned. Scroll to bottom for links."
        document.getElementById('clone-button').disabled = true;
        enableScanButtons();
    });

    let newCoverLetterName = companySpecificName(companyName, coverLetterTemplateName)
    getDocumentIdByName(newCoverLetterName).then(function (newCoverLetterId) {
        document.getElementById('tailored-cover-letter-link').innerHTML = newCoverLetterName;
        document.getElementById('tailored-cover-letter-link').href = gDocLinkFromId(newCoverLetterId);
        document.getElementById('clone-status').innerHTML = "Templates cloned. Scroll to bottom for links.";
        document.getElementById('clone-button').disabled = true;
    });
}

function cloneTemplates() {
    console.log("Handling tailor resume")
    let resumeTemplateName = document.getElementById('resume-template-name').value;
    let coverLetterTemplateName = document.getElementById('cover-letter-template-name').value;
    let companyName = document.getElementById('company-name').value;

    if (!companyName || !resumeTemplateName || !coverLetterTemplateName) {
        console.log("Must supply company name, resume template, and cover letter template names!");
        return;
    }

    let newResumeName = companySpecificName(companyName, resumeTemplateName)
    getDocumentIdByName(resumeTemplateName).then(function (resumeTemplateId) {
        copyFile(resumeTemplateId, newResumeName).then(function (newResumeId) {
            newResumeId = newFileId;
            document.getElementById('tailored-resume-link').innerHTML = newResumeName;
            document.getElementById('tailored-resume-link').href = gDocLinkFromId(newResumeId);
            document.getElementById('clone-status').innerHTML = "Templates cloned. Scroll to bottom for links."
            document.getElementById('clone-button').disabled = true;
            enableScanButtons();
        })
    });

    let newCoverLetterName = companySpecificName(companyName, coverLetterTemplateName)
    getDocumentIdByName(coverLetterTemplateName).then(function (coverLetterId) {
        copyFile(coverLetterId, newCoverLetterName).then(function (newCoverLetterId) {
            document.getElementById('tailored-cover-letter-link').innerHTML = newCoverLetterName;
            document.getElementById('tailored-cover-letter-link').href = gDocLinkFromId(newCoverLetterId);
            document.getElementById('clone-status').innerHTML = "Templates cloned. Scroll to bottom for links.";
            document.getElementById('clone-button').disabled = true;
        })
    });
}

function exportResume() {
    console.log("Function exportResume() is not yet implemented.");
}

function tailorResume   () {

}

function tailorLetter() {

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

function minScan() {
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
    getDocumentIdByName(newResumeName).then(function (fileId) {
        getPlaintextFileContents(fileId).then(function (resumePlainText) {
            jobscan(jobscanCookie, jobscanXsrfToken, resumePlainText, minimumRequirements).then((scanResult) => {
                console.log("Received scan results");
                document.getElementById("min-reqs-score").innerHTML = "Score: " + scanResult.matchRate.score;
                });
        });
    });

}

function minPrefScan() {

}

function minPrefDutyScan() {

}

function completeScan() {

}

function updateGoogleSheet() {

}