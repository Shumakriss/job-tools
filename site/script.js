/*  The initialize() function is called when index.html finishes loading the script.
    All initialization functions can be found in this file, though they may refer
    to other functions outside this file.
*/
var googleApi;
var app = new WebApplication();

/*
*  Initializiation functions
*/

async function initialize() {


    app.googleApi.apiInitCallback = () => {
        console.debug("App callback invoked by Google init");
        app.save();
        redraw();
    };

    app.googleApi.clientInitCallback = ()=>{
        console.debug("App callback invoked by Google client init");
        app.save();
        redraw();
    };

    app.googleApi.authenticatedCallback = () => {
        console.debug("App callback invoked by Google authentication");
        app.save();
        redraw();
    };

    app.googleApi.tokenClientCallback = () => {
        console.debug("App callback invoked by Google token client");
        app.save();
        redraw();
    };

    app.tryLoad();

    app.googleApi.init();
    initListeners();

    redraw();
}

/*
*  Event Listeners
*/

async function initListeners() {
    initCredentialFileListener();

    initCompanyNameListener();
    initResumeTemplateNameListener();
    initCoverLetterTemplateNameListener();
    initJobDescriptionListener();
    // job title
    // min reqs
    // pref reqs
    // job duties
    // company info
    // All the tailor fields
    // google sheet field

    console.debug("Registered listeners");
}


function initCompanyNameListener() {
    let elementName = "company-name";
    let eventType = "change";

    document.getElementById(elementName).addEventListener(eventType, debounce( (event) => {
        console.log("Invoked event listener for " + elementName);
        app.setCompanyName(event.target.value);
        app.save();
        redraw();
    }, 100));

    console.debug("Registered event listener for " + elementName);
}


function initResumeTemplateNameListener() {
    let elementName = "resume-template-name";
    let targetObject = app.resume.template;
    let eventType = "change";

    document.getElementById(elementName).addEventListener(eventType, debounce( (event) => {
        console.debug("Invoked event listener for " + elementName);
        targetObject.setName(event.target.value);
        app.save();
        redraw();
    }, 100));

    console.debug("Registered event listener for " + elementName);
}


function initCoverLetterTemplateNameListener() {
    let elementName = "cover-letter-template-name";
    let targetObject = app.coverLetter.template;
    let eventType = "change";

    document.getElementById(elementName).addEventListener(eventType, debounce( (event) => {
        console.debug("Invoked event listener for " + elementName);
        targetObject.setName(event.target.value);
        app.save();
        redraw();
    }, 100));

    console.debug("Registered event listener for " + elementName);
}

function initJobDescriptionListener() {
    document.getElementById('job-description-textarea').addEventListener('keydown', debounce( (event) => {
        app.job.setDescription(event.target.value);
        app.save();
        redraw();
    }, 200));
    console.debug("Registered event listener for job description");
}

function initMinimumRequirementsListener() {
    document.getElementById('minimum-requirements').addEventListener('keydown', debounce( (event) => {
        app.job.minimumRequirements = event.target.value;
        redraw();
    }, 200));
    console.debug("Registered event listener for minimum requirements");
}

async function initCredentialFileListener() {
    document.getElementById('credential-file').addEventListener('change', async function () {
        let fr = new FileReader();
        fr.onload = async function () {
            console.log("Credential file changed");
            let credentials = JSON.parse(fr.result);

            app.chatGpt.apiKey = credentials.chatGpt.apiKey;
            app.googleApi.apiKey = credentials.google.apiKey;
            app.googleApi.clientId = credentials.google.clientId;
            app.jobscan.xsrfToken = credentials.jobscan.xsrfToken;
            app.jobscan.cookie = credentials.jobscan.cookie;
            app.save();

            console.debug("Attempting to reload Google Drive Client.");
            await app.googleApi.init();
        }

        fr.readAsText(this.files[0]);
        redraw();
    });

    console.debug("Registered event listener for credential file");
}

function initApplicationLogSheetNameListener() {
    document.getElementById('application-log-sheet-name').addEventListener('change', debounce( (event) => {
        console.log("Application log sheet name changed");
        app.applicationLog.setName(event.target.value);
        redraw();
    }, 100));

    console.debug("Registered event listener for application log Google Sheet name");
}

/*
*  Page-specific button handling
*/

async function handleAuthClick() {
    console.debug("Google Sign In / Refresh button clicked");
    app.googleApi.authorize();
    redraw();
}

function handleSignoutClick() {
    console.debug("Google Sign Out button clicked");
    app.googleApi.signOut();
    redraw();
}

async function handleLogApplicationButton() {
    console.debug("Log application button clicked");
    app.applicationLog.append(app.company.getName());
    redraw();
}
