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

        document.getElementById('application-log-sheet-name').addEventListener('change', debounce( async (event) => {
            console.log("Application log sheet name changed");
            await controller.setApplicationLogName(event.target.value);
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

        document.getElementById("company-name-tailor").addEventListener("change", debounce( async (event) => {
            console.log("Invoked event listener for company-name");
            await controller.setCompanyName(event.target.value);
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
            await this.controller.setNavigationPage("extract");
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

        console.debug("Registered handlers");
    }
}

export default WebApp;