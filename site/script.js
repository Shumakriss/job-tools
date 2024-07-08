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
    getDocumentIdByName(resumeTemplateName).then(function (fileId) {
        newFileId = copyFile(fileId, newResumeName);
        newFileId.then(function (newFileId) {
            newResumeId = newFileId;
            document.getElementById('tailored-resume-link').innerHTML = newResumeName;
            document.getElementById('tailored-resume-link').href = gDocLinkFromId(newFileId);
            document.getElementById('clone-status').innerHTML = "Templates cloned. Scroll to bottom for links."
            let scanButtons = document.getElementsByClassName("scan-button");
            for (let i=0; i<scanButtons.length; i++) {
                scanButtons[i].disabled = false;
            }
        })
    });

    let newCoverLetterName = companySpecificName(companyName, coverLetterTemplateName)
    getDocumentIdByName(coverLetterTemplateName).then(function (fileId) {
        newFileId = copyFile(fileId, newCoverLetterName);
        newFileId.then(function (newFileId) {
            document.getElementById('tailored-cover-letter-link').innerHTML = newCoverLetterName;
            document.getElementById('tailored-cover-letter-link').href = gDocLinkFromId(newFileId);
            document.getElementById('clone-status').innerHTML = "Templates cloned. Scroll to bottom for links."
        })
    });

    document.getElementById('clone-button').disabled = true;
}

function exportResume() {
    console.log("Function exportResume() is not yet implemented.");
}

function tailorResume   () {

}

function tailorLetter() {

}

function minScan() {
    let contents = getPlaintextFileContents(newResumeId);
    // Retrieve resume plaintext
    // Retrieve jd from text field
    // Format API request to jobscan.co
    // Render score to page
}

function minPrefScan() {

}

function minPrefDutyScan() {

}

function completeScan() {

}

function updateGoogleSheet() {

}