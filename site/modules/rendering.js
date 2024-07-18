/*
*  DOM-interaction code
*/

export async function redraw(app) {
    console.log("Redrawing");

    // Google sign-in/refresh & sign-out buttons
    if (app.isSignInReady()) {
        console.debug("Google Sign In ready");
        enableGoogleSignInButton();
    }

    if (app.isRefreshReady()) {
        console.debug("Google Refresh ready");
        enableGoogleRefreshButton();
    }

    if (app.isSignOutReady()) {
        console.debug("Google Sign Out ready");
        enableGoogleSignOutButton();
    }

    document.getElementById("resume-template-name").value = app.getResumeTemplateName();
    document.getElementById("cover-letter-template-name").value = app.getCoverLetterTemplateName();
    document.getElementById("linkedin-query").value = app.getLinkedInQuery();
    document.getElementById("company-name").value = app.getCompanyName();
    document.getElementById("job-description-textarea").value = app.getJobDescription();

    let extractButton = document.getElementById("extract-sections-button");
    if (app.isExtractReady()) {
        console.log("extract is ready");
        extractButton.className = "big-button button";
        extractButton.disabled = false;
    } else {
        extractButton.className = "big-button button disabled-button";
        extractButton.disabled = true;
    }

    document.getElementById("job-title").value = app.jobPosting.title;
    document.getElementById("minimum-requirements").value = app.jobPosting.minimumRequirements;
    document.getElementById("preferred-requirements").value = app.jobPosting.preferredRequirements;
    document.getElementById("job-duties").value = app.jobPosting.responsibilities;
    document.getElementById("company-information").value = app.company.about;

    document.getElementById("application-date").value = app.getDate();
    document.getElementById("company-name-tailor").value = app.company.name;
    document.getElementById("company-name-possessive").value = app.company.possessive;

    document.getElementById("company-address").value = app.company.address;
    document.getElementById("hiring-manager-name").value = app.jobPosting.hiringManager;
    document.getElementById("complete-job-title").value = app.jobPosting.completeTitle;
    document.getElementById("short-job-title").value = app.jobPosting.shortTitle;
    document.getElementById("company-values").value = app.company.values;
    document.getElementById("relevant-experience").value = app.jobPosting.relevantExperience;

    if (app.isScanReady()) {
        document.getElementById("scan-button").disabled = false;
        document.getElementById("scan-button").className = "big-button button";
    } else {
        document.getElementById("scan-button").disabled = true;
        document.getElementById("scan-button").className = "big-button button disabled-button";
    }

    if (app.isTailorReady()) {
        document.getElementById("tailor-documents-button").disabled = false;
        document.getElementById("tailor-documents-button").className = "big-button button";
    } else {
        document.getElementById("tailor-documents-button").disabled = true;
        document.getElementById("tailor-documents-button").className = "big-button button disabled-button";
    }

    // TODO: linkedin link
    // TODO: github link
    // TODO: site link

    // TODO: sheet name
    // TODO: sheet link
    // TODO: log app button
//
//    // resume link
//    // TODO: Open the google doc, not the PDF link
//    let docLink = app.getResumeDocLink();
//    if (docLink) {
//        console.log("Updating pdf link: " + docLink);
//        document.getElementById('tailored-resume-link').innerHTML = app.getResumeName();
//        document.getElementById('tailored-resume-link').href = docLink;
//    } else {
//        console.log("Cannot update pdf link: " + pdfLink);
//        document.getElementById('tailored-resume-link').innerHTML = "Not ready";
//        document.getElementById('tailored-resume-link').href = "";
//    }
//
//    // cover letter link
//    // TODO: Open the google doc, not the PDF link
//    pdfLink = await app.coverLetter.getPdfLink();
//    if (pdfLink) {
//        console.log("Updating cover letter pdf link: " + pdfLink);
//        document.getElementById('tailored-cover-letter-link').innerHTML = app.coverLetter.getName();
//        document.getElementById('tailored-cover-letter-link').href = pdfLink;
//    } else {
//        console.log("Cannot update cover letter pdf link: " + pdfLink);
//        document.getElementById('tailored-cover-letter-link').innerHTML = "Not ready";
//        document.getElementById('tailored-cover-letter-link').href = "";
//    }

    // TODO: pdf button 1
    // TODO: pdf button 2

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

