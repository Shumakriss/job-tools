/*
*  DOM-interaction code
*/

async function redraw() {
    console.log("Redrawing");

    // Google sign-in/refresh & sign-out buttons
    if (app.googleApi.isSignInReady()) {
        console.debug("Google Sign In ready");
        enableGoogleSignInButton();
    }

    if (app.googleApi.isRefreshReady()) {
        console.debug("Google Refresh ready");
        enableGoogleRefreshButton();
    }

    if (app.googleApi.isSignOutReady()) {
        console.debug("Google Sign Out ready");
        enableGoogleSignOutButton();
    }

    document.getElementById("resume-template-name").value = app.resume.template.name;
    document.getElementById("cover-letter-template-name").value = app.coverLetter.template.name;
    document.getElementById("linkedin-query").value = LINKEDIN_QUERY;
    document.getElementById("company-name").value = app.company.name;
    document.getElementById("job-description-textarea").value = app.job.description;

    let extractButton = document.getElementById("extract-sections-button");
    if (app.isExtractReady()) {
        extractButton.className = "big-button button";
        extractButton.disabled = false;
    } else {
        extractButton.className = "big-button button disabled-button";
        extractButton.disabled = true;
    }

    document.getElementById("job-title").value = app.job.title;


    // tailoring company name
    // job title
    // min reqs
    // pref reqs
    // duties
    // responsibilities
    // date
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

//
//async function onDocumentInputChange(resumeTemplateName, coverLetterTemplateName, companyName) {
//
//    if (companyName && resumeTemplateName && coverLetterTemplateName) {
//        console.log("Checking for templates", resumeTemplateName, coverLetterTemplateName);
//        let resumeId = await getDocumentIdByName(resumeTemplateName);
//        let coverLetterId = await getDocumentIdByName(coverLetterTemplateName);
//
//        console.log("Template doc ids:", resumeId, coverLetterId);
//
//        if (resumeId && coverLetterId) {
//            console.log("Template documents found in Google Drive");
//            newResumeName = companySpecificName(companyName, resumeTemplateName);
//            newCoverLetterName = companySpecificName(companyName, coverLetterTemplateName);
//
//            let newResumeId = await getDocumentIdByName(newResumeName);
//            let newCoverLetterId = await getDocumentIdByName(newCoverLetterName);
//
//            if (newResumeId && newCoverLetterId) {
//                console.log("Customized documents found in Google Drive");
//
//                document.getElementById("create-resume-button").disabled = true;
//                document.getElementById('create-resume-button').className = "big-button button disabled-button";
//                document.getElementById('create-resume-button').innerHTML = "Documents Ready";
//
//                document.getElementById('tailored-resume-link').innerHTML = newResumeName;
//                document.getElementById('tailored-resume-link').href = gDocLinkFromId(newResumeId);
//                document.getElementById('tailored-cover-letter-link').innerHTML = newCoverLetterName;
//                document.getElementById('tailored-cover-letter-link').href = gDocLinkFromId(newCoverLetterId);
//
//                let resumeDownloadButton = document.getElementById('resume-download-button');
//                resumeDownloadButton.disabled = false;
//                resumeDownloadButton.className = "button fa fa-download";
//
//                let coverLetterDownloadButton = document.getElementById('cover-letter-download-button');
//                coverLetterDownloadButton.disabled = false;
//                coverLetterDownloadButton.className = "button fa fa-download";
//            } else {
//                console.log("Customized documents not found in Google Drive");
//                document.getElementById("create-resume-button").disabled = false;
//                document.getElementById('create-resume-button').className = "big-button button";
//                document.getElementById('create-resume-button').innerHTML = "Create Resume For This Job";
//
//                document.getElementById('tailored-resume-link').innerHTML = "Not Ready";
//                document.getElementById('tailored-resume-link').href = "";
//                document.getElementById('tailored-cover-letter-link').innerHTML = "Not Ready";
//                document.getElementById('tailored-cover-letter-link').href = "";
//
//                let resumeDownloadButton = document.getElementById('resume-download-button');
//                resumeDownloadButton.disabled = true;
//                resumeDownloadButton.className = "disabled-button button fa fa-download";
//
//                let coverLetterDownloadButton = document.getElementById('cover-letter-download-button');
//                coverLetterDownloadButton.disabled = true;
//                coverLetterDownloadButton.className = "disabled-button button fa fa-download";
//            }
//        } else {
//            console.log("Template documents not found in Google Drive");
//        }
//    } else {
//        console.log("Missing input to document tailoring");
//    }
//}


function handleLinkedInClipboard() {
    navigator.clipboard.writeText("https://www.linkedin.com/in/christophershumaker/");
}

function handleGithubClipboard() {
    navigator.clipboard.writeText("https://github.com/Shumakriss");
}

function handleSiteClipboard() {
    navigator.clipboard.writeText("https://www.makerconsulting.llc/maker-consulting");
}

function handleLinkedInQueryClipboard() {
    let queryText = document.getElementById("linkedin-query").value;
    navigator.clipboard.writeText(queryText);
}
