/*  The initialize() function is called when index.html finishes loading the script.
    All initialization functions can be found in this file, though they may refer
    to other functions outside this file.
*/
var googleApi;
var session = new Session();
var app = new WebApplication();

/*
*  Initializiation functions
*/

async function initialize() {
    session.tryLoad();
    app.tryLoad();

    googleApi = new GoogleApi(session.googleApiKey,
        session.googleClientId,
        JSON.parse(session.googleApiToken),
        onGoogleApiAuthenticated);

    await googleApi.init();
    console.log("Google Drive initialized");

    updateUserInputFromSession(session);
    initListeners();
    redraw();
}

async function initListeners() {
    initCredentialFileListener();
    initCompanyNameListener();
    initResumeTemplateNameListener();
    initCoverLetterTemplateNameListener();
    initJobDescriptionListener();
    initApplicationLogSheetNameListener();
    initMinimumRequirementsListener();
    console.log("Registered listeners");
}

function disableGoogleSignInButton() {
    document.getElementById("google-authorize-button").innerText = "Google Sign In";
    document.getElementById("google-authorize-button").className = "disabled-button button"
    document.getElementById("google-authorize-button").disabled = true;
}

function enableGoogleSignInButton() {
    document.getElementById("google-authorize-button").innerText = "Google Sign In";
    document.getElementById("google-authorize-button").className = "button"
    document.getElementById("google-authorize-button").disabled = false;
}

function enableGoogleRefreshButton() {
    document.getElementById("google-authorize-button").innerText = "Google Refresh";
    document.getElementById("google-authorize-button").className = "button"
    document.getElementById("google-authorize-button").disabled = false;
}

function enableGoogleSignOutButton() {
    document.getElementById("google-signout-button").innerText = "Google Sign Out";
    document.getElementById("google-signout-button").className = "button"
    document.getElementById("google-signout-button").disabled = false;
}

async function redraw() {

    // Google auth button
    // google sign out button

    if (googleApi.isSignInReady()) {
        enableGoogleSignInButton();
    }

    if (googleApi.isRefreshReady()) {
        enableGoogleRefreshButton();
    }

    if (googleApi.isSignOutReady()) {
        enableGoogleSignOutButton();
    }

    let element;

    element = document.getElementById("resume-template-name");
    element.value = app.resume.template.name;

    element = document.getElementById("cover-letter-template-name");
    element.value = app.coverLetter.template.name;

    // linkedin query
    // resume template name
    // cover letter template name
    // job description
    // extract button
    // company name
    // job title
    // min reqs
    // pref reqs
    // duties
    // responsibilities
    // date
    // company name
    // company possessive
    // address
    // hiring manager
    // title
    // short title
    // values
    // experience
    // scan button
    // resume link
    // cover letter link
    // pdf button 1
    // pdf button 2
    // linkedin link
    // github link
    // site link
    // sheet name
    // sheet link
    // log app button
    app.save();
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

            if (newResumeId && newCoverLetterId) {
                console.log("Customized documents found in Google Drive");

                document.getElementById("create-resume-button").disabled = true;
                document.getElementById('create-resume-button').className = "big-button button disabled-button";
                document.getElementById('create-resume-button').innerHTML = "Documents Ready";

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
                document.getElementById('create-resume-button').innerHTML = "Create Resume For This Job";

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
        app.coverLetter.template.name = event.target.value;
        session.coverLetterTemplateName = event.target.value;
        session.save();
        onDocumentInputChange(session.resumeTemplateName,
            session.coverLetterTemplateName,
            session.companyName);
        redraw();
    }, 100));

    console.debug("Registered event listener for resume template name");
}

function initResumeTemplateNameListener() {
    document.getElementById('resume-template-name').addEventListener('change', debounce( (event) => {
        app.resume.template.name = event.target.value;
        session.resumeTemplateName = event.target.value;
        session.save();
        onDocumentInputChange(session.resumeTemplateName,
            session.coverLetterTemplateName,
            session.companyName);
        redraw();
    }, 100));

    console.debug("Registered event listener for resume template name");
}

function initCompanyNameListener() {
    document.getElementById('company-name').addEventListener('change', debounce( (event) => {
        app.company.name = event.target.value;
        session.companyName = event.target.value;
        session.save();
        onDocumentInputChange(session.resumeTemplateName,
            session.coverLetterTemplateName,
            session.companyName);
        redraw();
    }, 100));

    console.debug("Registered event listener for company Name");
}

function initJobDescriptionListener() {
    document.getElementById('job-description-textarea').addEventListener('keydown', debounce( () => {
        updateExtractWithChatGptButton();
        redraw();
    }, 200));
    console.debug("Registered event listener for job description");
}

function initMinimumRequirementsListener() {
    document.getElementById('minimum-requirements').addEventListener('keydown', debounce( (event) => {

        if (event.target.value) {
            enableScanButton();
        } else {
            disableScanButton();
        }
        redraw();
    }, 200));
    console.debug("Registered event listener for minimum requirements");
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
        }

        fr.readAsText(this.files[0]);
        redraw();
    });

    console.debug("Registered event listener for credential file");
}

function initApplicationLogSheetNameListener() {
    document.getElementById('application-log-sheet-name').addEventListener('change', debounce( (event) => {
        console.log("Application log sheet name changed");
        session.applicationLogSheetName = event.target.value;
        session.save();
        onApplicationLogStateChange(true);
        redraw();
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
    console.log("Updating Google Buttons based on Drive client state: " + googleApi.state.toString());
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
    redraw();
}


function handleSignoutClick() {
    console.log("Google Sign Out button clicked");
    googleApi.signOut();
    session.googleApiToken = null;
    session.save();
    redraw();
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
    redraw();
}

function onGoogleApiAuthenticated() {
    session.googleApiToken = JSON.stringify(googleApi.token);
    session.save();
    onDocumentInputChange(session.resumeTemplateName,
        session.coverLetterTemplateName,
        session.companyName);

    onApplicationLogStateChange(true);
    reloadClones();
    redraw();
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
