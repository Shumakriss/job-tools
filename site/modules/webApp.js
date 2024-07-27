import View from './view.js'
import Model from './model.js'
import Controller from './controller.js'

function debounce(callback, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(function () { callback.apply(this, args); }, wait);
    };
}

function downloadLink(url) {
    const a = document.createElement('a')
    a.href = url
    a.download = url.split('/').pop()
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

class WebApp {

    constructor(gapi, google) {
        this.model = new Model();
        this.view = new View(this.model);
        this.controller = new Controller(this.model, this.view, gapi, google);
    }

    start() {
        this.model.load();
        this.view.render();

        this.addEventListeners();
        this.addHandlers();
    }

    async addEventListeners() {
        // TODO: Properly scope for fr callback
        var controller = this.controller;
        var view = this.view;
        var model = this.model;

        document.getElementById('credential-file').addEventListener('change',
            async function () {
                let fr = new FileReader();
                fr.onload = async function () {
                    console.log("Credential file changed");
                    let credentials = JSON.parse(fr.result);
                    controller.setCredentials(credentials);
                }

                await fr.readAsText(this.files[0]);
            }
        );

        document.getElementById("resume-template-name").addEventListener("change", debounce( async (event) => {
            console.debug("Invoked event listener for resume-template-name");
            controller.setResumeTemplateName(event.target.value);
        }, 100));

        document.getElementById("cover-letter-template-name").addEventListener("change", debounce( async (event) => {
            console.debug("Invoked event listener for cover-letter-template-name");
            controller.setCoverLetterTemplateName(event.target.value);
        }, 100));

        // Job Description page inputs
        document.getElementById('job-description-textarea').addEventListener('keydown', debounce( async (event) => {
            controller.setJobDescription(event.target.value);
        }, 200));

        // Extract page inputs
        document.getElementById("company-name").addEventListener("change", debounce( async (event) => {
            console.log("Invoked event listener for company-name");
            controller.setCompanyName(event.target.value);
        }, 100));

        document.getElementById("job-title").addEventListener("change", debounce( async (event) => {
            console.log("Invoked event listener for job-title");
            controller.setJobTitle(event.target.value);
        }, 100));

        document.getElementById('minimum-requirements').addEventListener('keydown', debounce( async (event) => {
            controller.setMinimumRequirements(event.target.value);
        }, 200));

        document.getElementById('preferred-requirements').addEventListener('keydown', debounce( async (event) => {
            controller.setPreferredRequirements(event.target.value);
        }, 200));

        document.getElementById('job-duties').addEventListener('keydown', debounce( async (event) => {
            controller.setJobDuties(event.target.value);
        }, 200));

        document.getElementById('company-information').addEventListener('keydown', debounce( async (event) => {
            controller.setCompanyInfo(event.target.value);
        }, 200));

        document.getElementById("company-name-tailor").addEventListener("change", debounce( async (event) => {
            console.log("Invoked event listener for company-name");
            controller.setCompanyName(event.target.value);
        }, 100));

        document.getElementById('profile-link-linkedin').addEventListener('change', debounce( async (event) => {
            controller.setLinkedInProfileLink(event.target.value);
        }, 200));

        document.getElementById('profile-link-github').addEventListener('change', debounce( async (event) => {
            controller.setGithubProfileLink(event.target.value);
        }, 200));

        document.getElementById('profile-link-website').addEventListener('change', debounce( async (event) => {
            controller.setWebsiteProfileLink(event.target.value);
        }, 200));

        document.getElementById('application-log-sheet-name').addEventListener('change', debounce( async (event) => {
            controller.setGoogleSheetName(event.target.value);
        }, 200));

        document.getElementById('include-preferred-checkbox').addEventListener('change', debounce( async (event) => {
            this.model.includePreferredRequirements = event.target.checked;
            model.save();
        }, 200));

        document.getElementById('include-job-duties-checkbox').addEventListener('change', debounce( async (event) => {
            this.model.includeJobDuties = event.target.checked;
            model.save();
        }, 200));

        document.getElementById('include-company-information-checkbox').addEventListener('change', debounce( async (event) => {
            this.model.includeCompanyInfo = event.target.checked;
            model.save();
        }, 200));

        document.getElementById("hiring-manager-name").addEventListener("change", debounce( async (event) => {
            controller.setHiringManager(event.target.value);
        }, 100));

        document.getElementById("company-values").addEventListener("change", debounce( async (event) => {
            controller.setCompanyValues(event.target.value);
        }, 100));

        document.getElementById("relevant-experience").addEventListener("change", debounce( async (event) => {
            controller.setRelevantExperience(event.target.value);
        }, 100));

        console.debug("Registered listeners");
    }

    async addHandlers() {

        document.getElementById('google-authorize-button').onclick = async () => {
            console.warn("Google Authorize Handler not implemented");
            this.controller.googleAuthorize();
        }

        document.getElementById('extract-sections-button').onclick = async () => {
            this.controller.extractJobSections();
        }
    
        document.getElementById('create-resume-button').onclick = async () => {
            this.controller.createResumeAndCoverLetter();
        }

        document.getElementById('scan-button').onclick = async () => {
            this.controller.scanResume();
        }

        document.getElementById('tailor-documents-button').onclick = async () => {
            this.controller.tailorDocuments();
        }

        document.getElementById('log-application-button').onclick = async () => {
            this.controller.logApplication();
        }

        document.getElementById('reset-button').onclick = async () => {
            console.debug("Reset button click");
            this.controller.reset();
        }

        document.getElementById('clipboard-linkedin-query').onclick = () => {
            navigator.clipboard.writeText(this.model.linkedInQuery);
        }

        document.getElementById('clipboard-linkedin-profile').onclick = () => {
            navigator.clipboard.writeText(this.model.linkedInProfileLink);
        }

        document.getElementById('clipboard-github-profile').onclick = () => {
            navigator.clipboard.writeText(this.model.githubProfileLink);
        }

        document.getElementById('clipboard-website').onclick = () => {
            navigator.clipboard.writeText(this.model.websiteProfileLink);
        }

        document.getElementById('resume-download-button').onclick = () => {
            downloadLink(this.model.resumePdfLink);
        }

        document.getElementById('cover-letter-download-button').onclick = () => {
            downloadLink(this.model.coverLetterPdfLink);
        }

        console.debug("Registered handlers");
    }
}

export default WebApp;