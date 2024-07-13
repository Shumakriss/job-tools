/*  The initialize() function is called when index.html finishes loading the script.
    All initialization functions can be found in this file, though they may refer
    to other functions outside this file.
*/
var googleDrive;
var session = new Session();

/*
*  Initializiation functions
*/

async function initialize() {
    session.tryLoad();

    googleDrive = new GoogleDrive(session.googleApiKey,
        session.googleClientId,
        JSON.parse(session.googleApiToken),
        onGoogleDriveAuthenticated);

    await googleDrive.init();
    console.log("Google Drive initialized");
    setGoogleButtonState();

    updateUserInputFromSession(session);

    initListeners();
}

async function initListeners() {
    initCredentialFileListener();
    initCompanyNameListener();
    initJobDescriptionListener();
    console.log("Registered listeners");
}

/*
*  Event Listeners
*/

function initCompanyNameListener() {
    document.getElementById('company-name').addEventListener('change',debounce( (event) => {
        onCompanyNameChange(event.target.value);
    }, 200));

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

            googleDrive.apiKey = session.googleApiKey;
            googleDrive.clientId = session.googleClientId;

            await googleDrive.init();
            setGoogleButtonState();
        }

        fr.readAsText(this.files[0]);
    });

    console.debug("Registered event listener for credential file");
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
}


function setGoogleButtonState() {
    console.debug("Updating Google Buttons based on Drive client state: " + googleDrive.state.toString());
    switch (googleDrive.state) {
        case  GoogleDriveStates.AUTHORIZED:
            console.debug("Updating Google Buttons based on Drive client state 'AUTHORIZED'");
            document.getElementById("google-authorize-button").innerText = "Google Refresh";
            document.getElementById("google-authorize-button").disabled = false;
            document.getElementById("google-authorize-button").className = "button"

            document.getElementById("google-signout-button").disabled = false;
            document.getElementById("google-signout-button").className = "button"
            break;
        case  GoogleDriveStates.UNAUTHORIZED:
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
    await googleDrive.authorize();
}


function handleSignoutClick() {
    console.log("Google Sign Out button clicked");
    googleDrive.signOut();
    setGoogleButtonState();
    session.googleApiToken = null;
    session.save();
}

function onGoogleDriveAuthenticated() {
    session.googleApiToken = JSON.stringify(googleDrive.token);
    setGoogleButtonState();
    session.save();
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
