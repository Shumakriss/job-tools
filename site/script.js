/*  The initialize() function is called when index.html finishes loading the script.
    All initialization functions can be found in this file, though they may refer
    to other functions outside this file.
*/
var googleApi;
var session = new Session();

/*
*  Initializiation functions
*/

async function initialize() {
    session.tryLoad();

    googleApi = new GoogleApi(session.googleApiKey,
        session.googleClientId,
        JSON.parse(session.googleApiToken),
        onGoogleApiAuthenticated);

    await googleApi.init();
    console.log("Google Drive initialized");
    setGoogleButtonState();

    updateUserInputFromSession(session);
    initListeners();
}

async function initListeners() {
    initCredentialFileListener();
    initCompanyNameListener();
    initResumeTemplateNameListener();
    initCoverLetterTemplateNameListener();
    initJobDescriptionListener();
    initApplicationLogSheetNameListener();
    console.log("Registered listeners");
}

/*
*  Event Listeners
*/

async function onDocumentInputChange(resumeTemplateName, coverLetterTemplateName, companyName) {

    if (companyName && resumeTemplateName && coverLetterTemplateName) {
        console.log("Checking for templates", resumeTemplateName, coverLetterTemplateName);
        let resumeId = await getDocumentIdByName(resumeTemplateName);
        let coverLetterId = await getDocumentIdByName(coverLetterTemplateName);

        console.log("Template doc ids:", resumeId, coverLetterId);

        if (resumeId && coverLetterId) {
            console.log("Template documents found in Google Drive");
            newResumeName = companySpecificName(companyName, resumeTemplateName);
            newCoverLetterName = companySpecificName(companyName, coverLetterTemplateName);

            let newResumeId = await getDocumentIdByName(newResumeName);
            let newCoverLetterId = await getDocumentIdByName(newCoverLetterName);

            if (newResumeId && coverLetterId) {
                console.log("Customized documents found in Google Drive");

                document.getElementById("create-resume-button").disabled = true;
                document.getElementById('create-resume-button').className = "big-button button disabled-button";
                document.getElementById('tailored-resume-link').innerHTML = newResumeName;
                document.getElementById('tailored-resume-link').href = gDocLinkFromId(newResumeId);
                document.getElementById('tailored-cover-letter-link').innerHTML = newCoverLetterName;
                document.getElementById('tailored-cover-letter-link').href = gDocLinkFromId(newCoverLetterId);

                let resumeDownloadButton = document.getElementById('resume-download-button');
                resumeDownloadButton.disabled = false;
                resumeDownloadButton.className = "button fa fa-download";

                let coverLetterDownloadButton = document.getElementById('cover-letter-download-button');
                coverLetterDownloadButton.disabled = false;
                coverLetterDownloadButton.className = "button fa fa-download";
            } else {
                console.log("Customized documents not found in Google Drive");
                document.getElementById("create-resume-button").disabled = false;
                document.getElementById('create-resume-button').className = "big-button button";
                document.getElementById('tailored-resume-link').innerHTML = "Not Ready";
                document.getElementById('tailored-resume-link').href = "";
                document.getElementById('tailored-cover-letter-link').innerHTML = "Not Ready";
                document.getElementById('tailored-cover-letter-link').href = "";

                let resumeDownloadButton = document.getElementById('resume-download-button');
                resumeDownloadButton.disabled = true;
                resumeDownloadButton.className = "disabled-button button fa fa-download";

                let coverLetterDownloadButton = document.getElementById('cover-letter-download-button');
                coverLetterDownloadButton.disabled = true;
                coverLetterDownloadButton.className = "disabled-button button fa fa-download";
            }
        } else {
            console.log("Template documents not found in Google Drive");
        }
    } else {
        console.log("Missing input to document tailoring");
    }
}

function initCoverLetterTemplateNameListener() {
    document.getElementById('cover-letter-template-name').addEventListener('change', debounce( (event) => {
        session.coverLetterTemplateName = event.target.value;
        session.save();
        onDocumentInputChange(session.resumeTemplateName,
            session.coverLetterTemplateName,
            session.companyName);
    }, 100));

    console.debug("Registered event listener for resume template name");
}

function initResumeTemplateNameListener() {
    document.getElementById('resume-template-name').addEventListener('change', debounce( (event) => {
        session.resumeTemplateName = event.target.value;
        session.save();
        onDocumentInputChange(session.resumeTemplateName,
            session.coverLetterTemplateName,
            session.companyName);
    }, 100));

    console.debug("Registered event listener for resume template name");
}

function initCompanyNameListener() {
    document.getElementById('company-name').addEventListener('change', debounce( (event) => {
        session.companyName = event.target.value;
        session.save();
        onDocumentInputChange(session.resumeTemplateName,
            session.coverLetterTemplateName,
            session.companyName);
    }, 100));

    console.debug("Registered event listener for company Name");
}

function initJobDescriptionListener() {
    document.getElementById('job-description-textarea').addEventListener('keydown', debounce( () => {
        updateExtractWithChatGptButton();
    }, 200));
    console.debug("Registered event listener for job description");
}

async function initCredentialFileListener() {
    document.getElementById('credential-file').addEventListener('change', function (event) {
        let fr = new FileReader();
        fr.onload = async function () {
            console.log("Credential file changed");
            let credentials = JSON.parse(fr.result);
            updateSessionCredentials(credentials);
            console.log("Attempting to reload Google Drive Client.");

            googleApi.apiKey = session.googleApiKey;
            googleApi.clientId = session.googleClientId;

            await googleApi.init();
            setGoogleButtonState();
        }

        fr.readAsText(this.files[0]);
    });

    console.debug("Registered event listener for credential file");
}

function initApplicationLogSheetNameListener() {
    document.getElementById('application-log-sheet-name').addEventListener('change', debounce( (event) => {
        console.log("Application log sheet name changed");
        session.applicationLogSheetName = event.target.value;
        session.save();
        onApplicationLogStateChange(true);
    }, 100));

    console.debug("Registered event listener for application log Google Sheet name");
}

/*
*  DOM interaction functions
*/
function updateSessionFromUserInput() {
    resumeTemplateName = document.getElementById("resume-template-name").value;
    coverLetterTemplateName = document.getElementById("cover-letter-name").value;
    companyName = document.getElementById("company-name").value;
    minimumRequirements = document.getElementById("minimum-requirements").value;
    preferredRequirements = document.getElementById("preferred-requirements").value;
    jobDuties = document.getElementById("job-duties").value;
    companyInformation = document.getElementById("company-information").value;
    credentialFile = document.getElementById("credential-file").value;
    session.save();
}

function updateUserInputFromSession(session) {
    document.getElementById("resume-template-name").value = session.resumeTemplateName;
    document.getElementById("cover-letter-template-name").value = session.coverLetterTemplateName;
    document.getElementById("company-name").value = session.companyName;
    document.getElementById("minimum-requirements").value = session.minimumRequirements;
    document.getElementById("preferred-requirements").value = session.preferredRequirements;
    document.getElementById("job-duties").value = session.jobDuties;
    document.getElementById("company-information").value = session.companyInformation;
    document.getElementById("credential-file").value = session.credentialFile;
    document.getElementById("application-log-sheet-name").value = session.applicationLogSheetName;
}


function setGoogleButtonState() {
    console.debug("Updating Google Buttons based on Drive client state: " + googleApi.state.toString());
    switch (googleApi.state) {
        case  GoogleApiStates.AUTHORIZED:
            console.debug("Updating Google Buttons based on Drive client state 'AUTHORIZED'");
            document.getElementById("google-authorize-button").innerText = "Google Refresh";
            document.getElementById("google-authorize-button").disabled = false;
            document.getElementById("google-authorize-button").className = "button"

            document.getElementById("google-signout-button").disabled = false;
            document.getElementById("google-signout-button").className = "button"
            break;
        case  GoogleApiStates.UNAUTHORIZED:
            console.debug("Updating Google Buttons based on Drive client state 'UNAUTHORIZED'");
            document.getElementById("google-authorize-button").innerText = "Google Sign In";
            document.getElementById("google-authorize-button").disabled = false;
            document.getElementById("google-authorize-button").className = "button"

            document.getElementById("google-signout-button").disabled = true;
            document.getElementById("google-signout-button").className = "disabled-button button"
            break;
        default:
            console.debug("Updating Google Buttons based on Drive client state 'UNKNOWN'");
            document.getElementById("google-authorize-button").innerText = "Google Sign In";
            document.getElementById("google-authorize-button").className = "disabled-button button"
            document.getElementById("google-authorize-button").disabled = true;

            document.getElementById("google-signout-button").disabled = true;
            document.getElementById("google-signout-button").className = "disabled-button button"
    }
}

/*
*  Page-specific button and session-handling code
*/

async function handleAuthClick() {
    console.log("Google Sign In / Refresh button clicked");
    await googleApi.authorize();
}


function handleSignoutClick() {
    console.log("Google Sign Out button clicked");
    googleApi.signOut();
    setGoogleButtonState();
    session.googleApiToken = null;
    session.save();
}

async function onApplicationLogStateChange(enable) {
    let sheetId = await getDocumentIdByName(session.applicationLogSheetName);
    if (enable && sheetId) {
        document.getElementById("application-log-sheet-link").href = gSheetsLinkFromId(sheetId);
        document.getElementById("application-log-sheet-link").innerText = "Open Google Sheet";

        document.getElementById("log-application-button").innerHTML = "Log Application";
        document.getElementById("log-application-button").disabled = false;
        document.getElementById("log-application-button").className = "button";
    } else if (sheetId) {
        document.getElementById("application-log-sheet-link").href = "";
        document.getElementById("application-log-sheet-link").innerText = "Google Sheet Link Not Ready";

        document.getElementById("log-application-button").innerHTML = "Application Already Logged This Session";
        document.getElementById("log-application-button").disabled = true;
        document.getElementById("log-application-button").className = "disabled-button button";
    } else {
        document.getElementById("log-application-button").innerHTML = "Application Already Logged This Session";
        document.getElementById("log-application-button").disabled = true;
        document.getElementById("log-application-button").className = "disabled-button button";
    }
}

async function handleLogApplicationButton() {
    console.log("Log application button clicked");
    let sheetId = await getDocumentIdByName(session.applicationLogSheetName);
    appendApplicationLog(sheetId, session.companyName);
    onApplicationLogStateChange(false);
}

function onGoogleApiAuthenticated() {
    session.googleApiToken = JSON.stringify(googleApi.token);
    setGoogleButtonState();
    session.save();
    onDocumentInputChange(session.resumeTemplateName,
        session.coverLetterTemplateName,
        session.companyName);

    onApplicationLogStateChange(true);
}

function updateSessionCredentials(credentialFileObject) {
    console.log("Updating session storage from credential file");
    session.googleApiKey = credentialFileObject['google-api-key'];
    session.googleClientId = credentialFileObject['google-client-id'];
    session.jobscanXsrfToken = credentialFileObject['jobscan-xsrf-token'];
    session.jobscanCookie = credentialFileObject['jobscan-cookie'];
    session.chatGptApiKey = credentialFileObject['chatgpt-api-key'];
    session.save();
    console.log("Saved credential file contents to session");
}
