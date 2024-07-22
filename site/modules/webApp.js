import Renderer from './renderer.js'
import View from './view.js'
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
        this.view = new View();
        this.controller = new Controller(this.view, gapi, google);
        this.renderer = new Renderer(this.view);
    }

    start() {
        this.view.load();
        this.renderer.render();

        this.addEventListeners();
        this.addHandlers();
    }

    async addEventListeners() {
        // TODO: Properly scope for fr callback
        var controller = this.controller;
        var renderer = this.renderer;
        var view = this.view;

        document.getElementById('credential-file').addEventListener('change',
            async function () {
                let fr = new FileReader();
                fr.onload = async function () {
                    console.log("Credential file changed");
                    let credentials = JSON.parse(fr.result);
                    await controller.setCredentials(credentials);
                    await view.save();
                    await renderer.render();
                }

                await fr.readAsText(this.files[0]);
            }
        );

        document.getElementById("resume-template-name").addEventListener("change", debounce( async (event) => {
            console.debug("Invoked event listener for resume-template-name");
            await controller.setResumeTemplateName(event.target.value);
            await view.save();
            await renderer.render();
        }, 100));

        document.getElementById("cover-letter-template-name").addEventListener("change", debounce( async (event) => {
            console.debug("Invoked event listener for cover-letter-template-name");
            await controller.setCoverLetterTemplateName(event.target.value);
            await view.save();
            await renderer.render();
        }, 100));

        // Job Description page inputs
        document.getElementById('job-description-textarea').addEventListener('keydown', debounce( async (event) => {
            await controller.setJobDescription(event.target.value);
            await view.save();
            await renderer.render();
        }, 200));

        // Extract page inputs
        document.getElementById("company-name").addEventListener("change", debounce( async (event) => {
            console.log("Invoked event listener for company-name");
            await controller.setCompanyName(event.target.value);
            await view.save();
            await renderer.render();
        }, 100));

        document.getElementById("job-title").addEventListener("change", debounce( async (event) => {
            console.log("Invoked event listener for job-title");
            await controller.setJobTitle(event.target.value);
            await view.save();
            await renderer.render();
        }, 100));

        document.getElementById('minimum-requirements').addEventListener('keydown', debounce( async (event) => {
            await controller.setMinimumRequirements(event.target.value);
            await view.save();
            await renderer.render();
        }, 200));

        document.getElementById('preferred-requirements').addEventListener('keydown', debounce( async (event) => {
            await controller.setPreferredRequirements(event.target.value);
            await view.save();
            await renderer.render();
        }, 200));

        document.getElementById('job-duties').addEventListener('keydown', debounce( async (event) => {
            await controller.setJobDuties(event.target.value);
            await view.save();
            await renderer.render();
        }, 200));

        document.getElementById('company-information').addEventListener('keydown', debounce( async (event) => {
            await controller.setCompanyInfo(event.target.value);
            await view.save();
            await renderer.render();
        }, 200));

        document.getElementById("company-name-tailor").addEventListener("change", debounce( async (event) => {
            console.log("Invoked event listener for company-name");
            await controller.setCompanyName(event.target.value);
            await view.save();
            await renderer.render();
        }, 100));

        document.getElementById('profile-link-linkedin').addEventListener('change', debounce( async (event) => {
            await controller.setLinkedInProfileLink(event.target.value);
            await view.save();
            await renderer.render();
        }, 200));

        document.getElementById('profile-link-github').addEventListener('change', debounce( async (event) => {
            await controller.setGithubProfileLink(event.target.value);
            await view.save();
            await renderer.render();
        }, 200));

        document.getElementById('profile-link-website').addEventListener('change', debounce( async (event) => {
            await controller.setWebsiteProfileLink(event.target.value);
            await view.save();
            await renderer.render();
        }, 200));

        document.getElementById('application-log-sheet-name').addEventListener('change', debounce( async (event) => {
            await controller.setGoogleSheetName(event.target.value);
            await view.save();
            await renderer.render();
        }, 200));

        document.getElementById('include-preferred-checkbox').addEventListener('change', debounce( async (event) => {
            this.view.includePreferredRequirements = event.target.checked;
            await view.save();
        }, 200));

        document.getElementById('include-job-duties-checkbox').addEventListener('change', debounce( async (event) => {
            this.view.includeJobDuties = event.target.checked;
            await view.save();
        }, 200));

        document.getElementById('include-company-information-checkbox').addEventListener('change', debounce( async (event) => {
            this.view.includeCompanyInfo = event.target.checked;
            await view.save();
        }, 200));

        document.getElementById("hiring-manager-name").addEventListener("change", debounce( async (event) => {
            await controller.setHiringManager(event.target.value);
            await view.save();
            await renderer.render();
        }, 100));

        document.getElementById("company-address").addEventListener("change", debounce( async (event) => {
            await controller.setCompanyAddress(event.target.value);
            await view.save();
            await renderer.render();
        }, 100));

        document.getElementById("company-values").addEventListener("change", debounce( async (event) => {
            await controller.setCompanyValues(event.target.value);
            await view.save();
            await renderer.render();
        }, 100));

        document.getElementById("relevant-experience").addEventListener("change", debounce( async (event) => {
            await controller.setRelevantExperience(event.target.value);
            await view.save();
            await renderer.render();
        }, 100));

        console.debug("Registered listeners");
    }

    async addHandlers() {

        document.getElementById('google-authorize-button').onclick = async () => {
            console.warn("Google Authorize Handler not implemented");
            await this.controller.googleAuthorize();
            await this.view.save();
            await this.renderer.render();
        }

        document.getElementById('nav-button-job-description').onclick = async () => {
            await this.controller.setNavigationPage("job-description");
            await this.view.save();
            await this.renderer.render();
        }

        document.getElementById('nav-button-extract').onclick = async () => {
            await this.controller.setNavigationPage("extract");
            await this.view.save();
            await this.renderer.render();
        }

        document.getElementById('nav-button-tailor').onclick = async () => {
            await this.controller.setNavigationPage("tailor");
            await this.view.save();
            await this.renderer.render();
        }

        document.getElementById('nav-button-scan').onclick = async () => {
            await this.controller.setNavigationPage("scan");
            await this.view.save();
            await this.renderer.render();
        }

        document.getElementById('extract-sections-button').onclick = async () => {
            await this.controller.extractJobSections();
            await this.view.save();
            await this.renderer.render();
        }
    
        document.getElementById('create-resume-button').onclick = async () => {
            await this.controller.createResumeAndCoverLetter();
            await this.view.save();
            await this.renderer.render();
        }

        document.getElementById('scan-button').onclick = async () => {
            await this.controller.scanResume();
            await this.view.save();
            await this.renderer.render();
        }

        document.getElementById('tailor-documents-button').onclick = async () => {
            await this.controller.tailorDocuments();
            await this.view.save();
            await this.renderer.render();
        }

        document.getElementById('log-application-button').onclick = async () => {
            await this.controller.logApplication();
            await this.view.save();
            await this.renderer.render();
        }

        document.getElementById('clipboard-linkedin-query').onclick = () => {
            navigator.clipboard.writeText(this.view.linkedInQuery);
        }

        document.getElementById('clipboard-linkedin-profile').onclick = () => {
            navigator.clipboard.writeText(this.view.linkedInProfileLink);
        }

        document.getElementById('clipboard-github-profile').onclick = () => {
            navigator.clipboard.writeText(this.view.githubProfileLink);
        }

        document.getElementById('clipboard-website').onclick = () => {
            navigator.clipboard.writeText(this.view.websiteProfileLink);
        }

        document.getElementById('resume-download-button').onclick = () => {
            downloadLink(this.view.resumePdfLink);
        }

        document.getElementById('cover-letter-download-button').onclick = () => {
            downloadLink(this.view.coverLetterPdfLink);
        }

        console.debug("Registered handlers");
    }
}

export default WebApp;