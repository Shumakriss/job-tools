/* This is a catch-all module for handler functions to button clicks. They should be
    written to interact with the DOM and delegate to other functions. The goal is that
    when writing HTML, there is a predictable handler function available in this file
    and that extensive logic is placed elsewhere.
*/
async function handleSaveGoogleCredentials() {
    sessionStorage.setItem("google-client-id", document.getElementById('google-client-id').value);
    sessionStorage.setItem("google-api-key", document.getElementById('google-api-key').value);
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

async function handleDownloadResumeButton() {
    console.log("Downloading resume");
    let elementName = "resume-template-name";
    let docName = document.getElementById(elementName).value;
    let companyName = document.getElementById("company-name").value;
    let newDocName = companySpecificName(companyName, docName);
    let newDocId = await getDocumentIdByName(newDocName);
    let pdfLink = await getPdfLink(newDocId);
    downloadLink(pdfLink);
    session.resumePdfLink = pdfLink;
    session.save()
}

async function handleDownloadCoverLetterButton() {
    console.log("Downloading cover letter");
    let elementName = "cover-letter-template-name";
    let docName = document.getElementById(elementName).value;
    let companyName = document.getElementById("company-name").value;
    let newDocName = companySpecificName(companyName, docName);
    let newDocId = await getDocumentIdByName(newDocName);
    let pdfLink = await getPdfLink(newDocId);
    downloadLink(pdfLink);
    session.coverLetterPdfLink = pdfLink;
    session.save()
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
    response = await askChatGpt(session.chatGptApiKey, prompt);
    document.getElementById("company-name").value = response;

    prompt = JOB_TITLE_PROMPT + "\n\nJob Description:\n\n"+ jobDescription;
    response = await askChatGpt(session.chatGptApiKey, prompt);
    document.getElementById("job-title").value = response;

    prompt = JOB_DUTIES_PROMPT + "\n\nJob Description:\n\n"+ jobDescription;
    response = await askChatGpt(session.chatGptApiKey, prompt);
    document.getElementById("job-duties").value = response;

    prompt = COMPANY_INFORMATION_PROMPT + "\n\nJob Description:\n\n"+ jobDescription;
    response = await askChatGpt(session.chatGptApiKey, prompt);
    document.getElementById("company-information").value = response;

    prompt = MINIMUM_JOB_REQUIREMENTS_PROMPT + "\n\nJob Description:\n\n"+ jobDescription;
    response = await askChatGpt(session.chatGptApiKey, prompt);
    document.getElementById("minimum-requirements").value = response;

    prompt = PREFERRED_JOB_REQUIREMENTS_PROMPT + "\n\nJob Description:\n\n"+ jobDescription;
    response = await askChatGpt(session.chatGptApiKey, prompt);
    document.getElementById("preferred-requirements").value = response;
}


async function handleCreateResumeButton() {
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

