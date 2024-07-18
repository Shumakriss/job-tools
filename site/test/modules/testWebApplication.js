import {TestSuite} from "../lib.js";
import Company from "../../modules/company.js";
import GapiWrapper from "../../modules/gapiWrapper.js";
import JobPosting from "../../modules/jobPosting.js";
import Template from "../../modules/template.js";
import TailoredDocument from "../../modules/tailoredDocument.js";
import WebApplication from "../../modules/webApplication.js";

var testSuite = new TestSuite();

testSuite.addTest("WebApplication.constructor - Defaults all fields", () => {
    let newApp = new WebApplication();

    if (!newApp.gapiWrapper) {
        throw new Error("Failed to set Google API Wrapper template");
    }

    if (!newApp.company) {
        throw new Error("Failed to set company");
    }

    if (!newApp.resumeTemplate) {
        throw new Error("Failed to set resume template");
    }

    if (!newApp.coverLetterTemplate) {
        throw new Error("Failed to set cover letter template");
    }

    if (!newApp.coverLetterTailoredDocument) {
        throw new Error("Failed to set cover letter tailored document");
    }

    if (!newApp.resumeTailoredDocument) {
        throw new Error("Failed to set resume tailored document");
    }

    if (!newApp.jobPosting) {
        throw new Error("Failed to set job posting");
    }
});

testSuite.addTest("WebApplication.load - Throws when provided no input", () => {
    let app = new WebApplication();
    app.load();
}, true);

testSuite.addTest("WebApplication.load - Throws when provided wrong input type", () => {
    let app = new WebApplication();
    app.load({});
}, true);

testSuite.addTest("WebApplication.load - Throws when provided unparseable JSON string", () => {
    let app = new WebApplication();
    app.load("asdflkjhasdflh");
}, true);

testSuite.addTest("WebApplication.load - Does not throw if JSON is empty", () => {
    let app = new WebApplication();
    app.load("{ }");
}, false);

testSuite.addTest("WebApplication.load - Sets company when valid object is provided", () => {
    let storedApp = new WebApplication();
    let company = new Company();
    storedApp.setCompany(company);

    let newApp = new WebApplication();
    newApp.load(JSON.stringify(storedApp));

    if (!newApp.company) {
        throw new Error("No company was set");
    }
    if (newApp.company.name != company.name) {
        throw new Error("Company name set is not company name provided");
    }
});

testSuite.addTest("WebApplication.load - Sets Google API Wrapper template when valid object is provided", () => {
    let storedApp = new WebApplication();
    let gapiWrapper = new GapiWrapper();
    storedApp.setGapiWrapper(gapiWrapper);
    let serializedApp = JSON.stringify(storedApp);

    let newApp = new WebApplication();
    newApp.load(serializedApp);

    if (!newApp.gapiWrapper) {
        throw new Error("No Google API Wrapper template was set");
    }
    if (newApp.gapiWrapper.name != gapiWrapper.name) {
        throw new Error("Google API Wrapper template name set is not Google API Wrapper template name provided");
    }
});

testSuite.addTest("WebApplication.load - Sets resume template when valid object is provided", () => {
    let storedApp = new WebApplication();
    let resumeTemplate = new Template();
    storedApp.setResumeTemplate(resumeTemplate);
    let serializedApp = JSON.stringify(storedApp);

    let newApp = new WebApplication();
    newApp.load(serializedApp);

    if (!newApp.resumeTemplate) {
        throw new Error("No resume template was set");
    }
    if (newApp.resumeTemplate.name != resumeTemplate.name) {
        throw new Error("Resume template name set is not resume template name provided");
    }
});

testSuite.addTest("WebApplication.load - Sets cover letter template when valid object is provided", () => {
    let storedApp = new WebApplication();
    let coverLetterTemplate = new Template();
    storedApp.setCoverLetterTemplate(coverLetterTemplate);
    let serializedApp = JSON.stringify(storedApp);

    let newApp = new WebApplication();
    newApp.load(serializedApp);

    if (!newApp.coverLetterTemplate) {
        throw new Error("No cover letter template was set");
    }
    if (newApp.coverLetterTemplate.name != coverLetterTemplate.name) {
        throw new Error("cover letter template name set is not cover letter template name provided");
    }
});

testSuite.addTest("WebApplication.load - Sets job posting when valid object is provided", () => {
    let storedApp = new WebApplication();
    let jobPosting = new JobPosting();
    storedApp.setJobPosting(jobPosting);
    let serializedApp = JSON.stringify(storedApp);

    let newApp = new WebApplication();
    newApp.load(serializedApp);

    if (!newApp.jobPosting) {
        throw new Error("No job posting was set");
    }
    if (newApp.jobPosting.name != jobPosting.name) {
        throw new Error("Resume template name set is not job posting name provided");
    }
});


testSuite.addTest("WebApplication.load - Sets resume tailored document when valid object is provided", () => {
    let storedApp = new WebApplication();
    let resumeTailoredDocument = new TailoredDocument();
    storedApp.setResumeTailoredDocument(resumeTailoredDocument);
    let serializedApp = JSON.stringify(storedApp);

    let newApp = new WebApplication();
    newApp.load(serializedApp);

    if (!newApp.resumeTailoredDocument) {
        throw new Error("No resume tailored document was set");
    }
    if (newApp.resumeTailoredDocument.name != resumeTailoredDocument.name) {
        throw new Error("resume tailored document name set is not resume tailored document name provided");
    }
});

testSuite.addTest("WebApplication.load - Sets cover letter tailored document when valid object is provided", () => {
    let storedApp = new WebApplication();
    let coverLetterTailoredDocument = new TailoredDocument();
    storedApp.setCoverLetterTailoredDocument(coverLetterTailoredDocument);
    let serializedApp = JSON.stringify(storedApp);

    let newApp = new WebApplication();
    newApp.load(serializedApp);

    if (!newApp.coverLetterTailoredDocument) {
        throw new Error("No cover letter tailored document was set");
    }
    if (newApp.coverLetterTailoredDocument.name != coverLetterTailoredDocument.name) {
        throw new Error("cover letter tailored document name set is not cover letter tailored document name provided");
    }
});


testSuite.addTest("WebApplication.load - Defaults all fields when load is not performed", () => {
    let storedApp = new WebApplication();
    let serializedApp = JSON.stringify(storedApp);

    let newApp = new WebApplication();
    newApp.load(serializedApp);

    if (!newApp.gapiWrapper) {
        throw new Error("Failed to set Google API Wrapper template");
    }

    if (!newApp.company) {
        throw new Error("Failed to set company");
    }

    if (!newApp.resumeTemplate) {
        throw new Error("Failed to set resume template");
    }

    if (!newApp.coverLetterTemplate) {
        throw new Error("Failed to set cover letter template");
    }

    if (!newApp.coverLetterTailoredDocument) {
        throw new Error("Failed to set cover letter tailored document");
    }

    if (!newApp.resumeTailoredDocument) {
        throw new Error("Failed to set resume tailored document");
    }

    if (!newApp.jobPosting) {
        throw new Error("Failed to set job posting");
    }

});


export {testSuite as webApplicationSuite};