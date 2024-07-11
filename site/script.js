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
var chatGptApiKey;

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
    let cloneButton = document.getElementById('clone-button');
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
            chatGptApiKey = credentials['chatgpt-api-key'];

            sessionStorage.setItem('google-api-key', googleApiKey);
            sessionStorage.setItem('google-client-id', googleClientId);
            sessionStorage.setItem('jobscan-xsrf-token', jobscanXsrfToken);
            sessionStorage.setItem('jobscan-cookie', jobscanCookie);
            sessionStorage.setItem('chatgpt-api-key', chatGptApiKey);

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
        document.getElementById("clone-button").disabled = false;
        document.getElementById('clone-button').className = "big-button button";
    }

}

function initCompanyNameListener() {
    document.getElementById('company-name').addEventListener('change', function (event) {
        onCompanyNameChange(event.target.value);
    });

    console.log("Registered event listener for credential file");
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

function initJobDescriptionListener() {
    document.getElementById('job-description-textarea').addEventListener('keydown', debounce( () => {
        updateExtractWithChatGptButton();
    }, 200));
}

async function initialize() {
    initCredentialFileListener();
    loadCredentialsFromSession();

    initCompanyNameListener();
    initJobDescriptionListener();
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

async function handleScanButton() {
    console.log("Scanning resume against minimum requirements");

    resumePlainText = await getPlaintextFileContents(newResumeId);

    let jobDescription = document.getElementById("minimum-requirements").value;;
    let results = await jobscan(jobscanCookie, jobscanXsrfToken, resumePlainText, jobDescription);
    let score = results.matchRate.score;
    document.getElementById("minimum-score").innerHTML = "Score: " + score;
    document.getElementById("minimum-requirements-keywords").innerHTML = '';
    document.getElementById("minimum-requirements-keywords").appendChild(formatResults(results));
    document.getElementById("minimum-requirements-display").value = document.getElementById("minimum-requirements");

    preferredRequirements = document.getElementById("preferred-requirements").value;
    includePreferred = document.getElementById("include-preferred-checkbox").checked;
    if (includePreferred && preferredRequirements) {
        jobDescription = jobDescription + preferredRequirements;
        results = await jobscan(jobscanCookie, jobscanXsrfToken, resumePlainText, jobDescription);
        score = results.matchRate.score;
        document.getElementById("preferred-score").innerHTML = "Score: " + score;
        document.getElementById("preferred-requirements-keywords").innerHTML = '';
        document.getElementById("preferred-requirements-keywords").appendChild(formatResults(results));
    }

    jobDuties = document.getElementById("job-duties").value;
    includeJobDuties = document.getElementById("include-job-duties-checkbox").checked;
    if ( includeJobDuties && jobDuties ) {
        jobDescription = jobDescription + jobDuties;
        results = await jobscan(jobscanCookie, jobscanXsrfToken, resumePlainText, jobDescription);
        score = results.matchRate.score;
        document.getElementById("job-duties-score").innerHTML = "Score: " + score;
        document.getElementById("job-duties-keywords").innerHTML = '';
        document.getElementById("job-duties-keywords").appendChild(formatResults(results));
    }

    companyInformation = document.getElementById("company-information").value;
    includeCompanyInformation = document.getElementById("include-company-information-checkbox").checked;
    if ( includeCompanyInformation && companyInformation ) {
        jobDescription = jobDescription + document.getElementById("company-information").value;
        results = await jobscan(jobscanCookie, jobscanXsrfToken, resumePlainText, jobDescription);
        score = results.matchRate.score;
        document.getElementById("company-information-score").innerHTML = "Score: " + score;
        document.getElementById("company-information-keywords").innerHTML = '';
        document.getElementById("company-information-keywords").appendChild(formatResults(results));
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

async function handleExtractSectionsButton() {
    console.log("Extracting sections from job description");
    let jobDescription = document.getElementById("job-description-textarea").value;

    handleNavButtonClick(document.getElementById("nav-button-extract"), "extract");

    let prompt;
    let response;

    prompt = COMPANY_NAME_PROMPT + "\n\nJob Description:\n\n"+ jobDescription;
    response = await askChatGpt(chatGptApiKey, prompt);
    document.getElementById("company-name").value = response;
    onCompanyNameChange(response);

    prompt = JOB_TITLE_PROMPT + "\n\nJob Description:\n\n"+ jobDescription;
    response = await askChatGpt(chatGptApiKey, prompt);
    document.getElementById("job-title").value = response;

    prompt = JOB_DUTIES_PROMPT + "\n\nJob Description:\n\n"+ jobDescription;
    response = await askChatGpt(chatGptApiKey, prompt);
    document.getElementById("job-duties").value = response;

    prompt = COMPANY_INFORMATION_PROMPT + "\n\nJob Description:\n\n"+ jobDescription;
    response = await askChatGpt(chatGptApiKey, prompt);
    document.getElementById("company-information").value = response;

    prompt = MINIMUM_JOB_REQUIREMENTS_PROMPT + "\n\nJob Description:\n\n"+ jobDescription;
    response = await askChatGpt(chatGptApiKey, prompt);
    document.getElementById("minimum-requirements").value = response;

    prompt = PREFERRED_JOB_REQUIREMENTS_PROMPT + "\n\nJob Description:\n\n"+ jobDescription;
    response = await askChatGpt(chatGptApiKey, prompt);
    document.getElementById("preferred-requirements").value = response;
}