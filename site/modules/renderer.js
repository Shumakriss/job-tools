class Renderer {
    constructor(view) {
        this.view = view;
    }

    render() {
        console.debug("Rendering");

        document.getElementById("resume-template-name").value = this.view.resumeTemplateName;
        document.getElementById("cover-letter-template-name").value = this.view.coverLetterTemplateName;
        document.getElementById("linkedin-query").value = this.view.linkedInQuery;
        document.getElementById("company-name").value = this.view.companyName;
        document.getElementById("job-description-textarea").value = this.view.jobDescription;
//    
//        let extractButton = document.getElementById("extract-sections-button");
//        if (await this.view.isExtractReady()) {
//            console.log("extract is ready");
//            extractButton.className = "big-button button";
//            extractButton.disabled = false;
//        } else {
//            extractButton.className = "big-button button disabled-button";
//            extractButton.disabled = true;
//        }
    
//        document.getElementById("application-date").value = this.view.getDate();
//
//        document.getElementById("job-title").value = this.view.getJobTitle();
//        document.getElementById("minimum-requirements").value = this.view.getMinimumRequirements();
//        document.getElementById("preferred-requirements").value = this.view.getPreferredRequirements();
//        document.getElementById("job-duties").value = this.view.getJobDuties();
//        document.getElementById("company-information").value = this.view.getCompanyInformation();
//
//        document.getElementById("company-name-tailor").value = this.view.getCompanyName();
//        document.getElementById("company-name-possessive").value = this.view.getCompanyNamePossessive();
//        document.getElementById("company-address").value = this.view.getCompanyAddress();
//        document.getElementById("hiring-manager-name").value = this.view.getHiringManager();
//
//        document.getElementById("complete-job-title").value = this.view.getCompleteJobTitle();
//        document.getElementById("short-job-title").value = this.view.getShortJobTitle();
//        document.getElementById("company-values").value = this.view.getCompanyValues();
//        document.getElementById("relevant-experience").value = this.view.getRelevantExperience();
    
//        if (this.view.isCreateResumeReady()) {
//            document.getElementById("create-resume-button").disabled = false;
//            document.getElementById("create-resume-button").className = "big-button button";
//            console.log("Create resume button is ready");
//        } else {
//            console.log("Create resume button is not ready");
//            document.getElementById("create-resume-button").disabled = true;
//            document.getElementById("create-resume-button").className = "big-button disabled-button button";
//        }
//    
//        if (this.view.isScanReady()) {
//            document.getElementById("scan-button").disabled = false;
//            document.getElementById("scan-button").className = "big-button button";
//        } else {
//            document.getElementById("scan-button").disabled = true;
//            document.getElementById("scan-button").className = "big-button button disabled-button";
//        }
//    
//        if (this.view.isTailorReady()) {
//            document.getElementById("tailor-documents-button").disabled = false;
//            document.getElementById("tailor-documents-button").className = "big-button button";
//        } else {
//            document.getElementById("tailor-documents-button").disabled = true;
//            document.getElementById("tailor-documents-button").className = "big-button button disabled-button";
//        }
    
        // TODO: linkedin link
        // TODO: github link
        // TODO: site link
    
        // TODO: sheet name
        // TODO: sheet link
        // TODO: log app button
    //
    //    // resume link
    //    // TODO: Open the google doc, not the PDF link
    //    let docLink = this.view.getResumeDocLink();
    //    if (docLink) {
    //        console.log("Updating pdf link: " + docLink);
    //        document.getElementById('tailored-resume-link').innerHTML = this.view.getResumeName();
    //        document.getElementById('tailored-resume-link').href = docLink;
    //    } else {
    //        console.log("Cannot update pdf link: " + pdfLink);
    //        document.getElementById('tailored-resume-link').innerHTML = "Not ready";
    //        document.getElementById('tailored-resume-link').href = "";
    //    }
    //
    //    // cover letter link
    //    // TODO: Open the google doc, not the PDF link
    //    pdfLink = await this.view.coverLetter.getPdfLink();
    //    if (pdfLink) {
    //        console.log("Updating cover letter pdf link: " + pdfLink);
    //        document.getElementById('tailored-cover-letter-link').innerHTML = this.view.coverLetter.getName();
    //        document.getElementById('tailored-cover-letter-link').href = pdfLink;
    //    } else {
    //        console.log("Cannot update cover letter pdf link: " + pdfLink);
    //        document.getElementById('tailored-cover-letter-link').innerHTML = "Not ready";
    //        document.getElementById('tailored-cover-letter-link').href = "";
    //    }
    
        // TODO: pdf button 1
        // TODO: pdf button 2
    }
}

export default Renderer;