/* This is a catch-all module and should not be extended. All of these functions need
    new homes as their usage patterns become more clear or obsolete.
*/

function checkJobscanVars() {
    return companyName && resumeTemplateId && jobscanCookie && jobscanXsrfToken && minimumRequirements;
}


function getPreferredRequirements() {
   let minReqs = document.getElementById("minimum-requirements").value;
   let prefReqs = document.getElementById("preferred-requirements").value;
   return minReqs + prefReqs;
}

function formatResults(jobscanResults) {
    let ul = document.createElement('ul');

    let highValueSkills = jobscanResults['highValueSkills'];
    for (let i=0; i<highValueSkills.length; i++){
        if (highValueSkills[i].cvCount == 0){
            let li = document.createElement("li");
            let text = highValueSkills[i]['skill'] + " (" + highValueSkills[i]['type'] + ")"
            li.appendChild(document.createTextNode(text));
            ul.appendChild(li);
        }
    }

    return ul
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


function updateExtractWithChatGptButton() {
    let jobDescription = document.getElementById("job-description-textarea").value;
    if (jobDescription) {
        document.getElementById("extract-sections-button").disabled = false;
        document.getElementById("extract-sections-button").className = "big-button button";
    } else {
        document.getElementById("extract-sections-button").disabled = true;
        document.getElementById("extract-sections-button").className = "big-button disabled-button button";
    }
}

function debounce(callback, wait) {
  let timeout;
  return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(function () { callback.apply(this, args); }, wait);
  };
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

    if (sessionStorage.getItem("chatgpt-api-key")) {
        chatGptApiKey = sessionStorage.getItem("chatgpt-api-key");
        console.log("Loaded ChatGPT API Key from session");
    }


    if (googleClientId && googleApiKey) {
        gapiLoaded(googleApiKey);
        gisLoaded(googleClientId);
    }
}

async function onCompanyNameChange(newCompanyName) {
    console.log("Company named changed");
    companyName = newCompanyName;

    resumeTemplateName = document.getElementById('resume-template-name').value;
    coverLetterTemplateName = document.getElementById('cover-letter-template-name').value;

    newResumeName = companySpecificName(companyName, resumeTemplateName);
    newCoverLetterName = companySpecificName(companyName, coverLetterTemplateName);

    let newResumeId = await getDocumentIdByName(newResumeName);
    let newCoverLetterId = await getDocumentIdByName(newCoverLetterName);

    if (newResumeId && newCoverLetterId) {
        console.log("Found company-specific documents");
        document.getElementById('tailored-resume-link').innerHTML = "Searching...";
        reloadClones();
    } else {
        console.log("Company-specific documents not found");
        document.getElementById("create-resume-button").disabled = false;
        document.getElementById('create-resume-button').className = "big-button button";
    }

}


function setCloneVars() {
    console.log("Setting clone variables");
    resumeTemplateName = document.getElementById('resume-template-name').value;
    coverLetterTemplateName = document.getElementById('cover-letter-template-name').value;
    companyName = document.getElementById('company-name').value;
    newResumeName = companySpecificName(companyName, resumeTemplateName);
    newCoverLetterName = companySpecificName(companyName, coverLetterTemplateName);
}

function checkCloneVars() {
    return companyName && resumeTemplateName && coverLetterTemplateName && newResumeName && newCoverLetterName;
}

function initCloneVars() {
    console.log("Initializing clone variables");
    if (!checkCloneVars()) {
        setCloneVars();
    }
}

function disableCloneButton() {
    let cloneButton = document.getElementById('create-resume-button');
    cloneButton.disabled = true;
    cloneButton.className = "disabled-button big-button button";
    handleNavButtonClick(document.getElementById("nav-button-scan"), "scan");
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
    scanButton.className = "scan-button button big-button";

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
    } else {
        console.log("Resume ID not found for name: " + newResumeName);
    }

    newCoverLetterId = await getDocumentIdByName(newCoverLetterName);
    if (newCoverLetterId) {
        updateNewCoverLetterData(newCoverLetterId);
    }

    disableCloneButton();
    enableScanButton();
}


function tailorResume   () {

}

function tailorLetter() {

}


function updateGoogleSheet() {

}
