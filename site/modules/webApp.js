import View from './view.js'
import Model from './model.js'
import Controller from './controller.js'
import ModalCollection from './components/modal.js'
import JobSection from './components/jobSection.js'

function debounce(callback, wait) {
    // Invoke a function after some time period
    // Useful for catching user input without waiting for a separate action like a button click
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(function () { callback.apply(this, args); }, wait);
    };
}

function downloadLink(url) {
    // Used to trigger a file download
    if (url && url != "" && url != "undefined"){
        const a = document.createElement('a');
        a.href = url;
        a.download = url.split('/').pop();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        console.log("Unable to download file due to empty link");
    }

}

function openLinkInNewTab(url) {
    // Pop-under a link
    const a = document.createElement('a')
    a.href = url
    a.target = "_blank"
    a.download = url.split('/').pop()
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

function addLinkButton(elementId, links) {
    // Register's an element's onclick to open a link
    // Useful for buttons that open links in ways that <a> tags cannot
    document.getElementById(elementId).onclick = async () => {
        console.log(links);
        if (typeof links == "string") {
            openLinkInNewTab(links);
        } else if (Array.isArray(links)) {
            for (let i=0; i<links.length; i++){
                openLinkInNewTab(links[i]);
            }
        }
    }
}

class WebApp {

    constructor(gapi, google) {
        this.model = new Model();
        this.view = new View(this.model);
        this.controller = new Controller(this.model, this.view, gapi, google);  // Controller initializes gapi automatically
        this.modals = new ModalCollection();
        this.jobSections = [];
    }

    async start() {
        this.model.load();
        this.view.render();

        this.addModals();
        this.addJobSections();
        this.addEventListeners();
        this.addHandlers();
    }

    async addModals() {
        this.modals.add("settings-modal", "configure-button");
        this.modals.add("apply-modal", "apply-button");
        this.modals.add("search-modal", "search-button");
        this.modals.add("reset-modal", "reset-modal-button");
        this.modals.add("tailoring-modal", "configure-tailoring-button");
    }

    async addJobSections() {
        this.jobSections.push(new JobSection("job-description"));
        this.jobSections.push(new JobSection("job-minimum-requirements"));
        this.jobSections.push(new JobSection("job-preferred-requirements"));
        this.jobSections.push(new JobSection("job-duties"));
        this.jobSections.push(new JobSection("job-company-info"));
        this.view.jobSections = this.jobSections;
    }

    async addEventListeners() {
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

        document.addEventListener('keydown', e => {
            if (e.metaKey && e.key === 's') {
                // Prevent the Save dialog to open
                e.preventDefault();
                this.controller.handleUserSave();
            } else if (e.key === 'Escape') {
                this.modals.clearAll();
            }
        });

        let quickListeners = [
            ["keyword-resume-name", async (event) => { this.controller.setKeywordResumeName(event.target.value); }],
            ["resume-template-name", async (event) => { this.controller.setResumeTemplateName(event.target.value); }],
            ["cover-letter-template-name", async (event) => { this.controller.setCoverLetterTemplateName(event.target.value); }],
            ["company-name", async (event) => { this.controller.setCompanyName(event.target.value); }],
            ["job-title", async (event) => { this.controller.setJobTitle(event.target.value); }],
            ["company-name-tailor", async (event) => { this.controller.setCompanyName(event.target.value); }],
            ["hiring-manager-name", async (event) => { this.controller.setHiringManager(event.target.value); }],
            ["company-values", async (event) => { this.controller.setCompanyValues(event.target.value); }],
            ["relevant-experience", async (event) => { this.controller.setRelevantExperience(event.target.value); }],
            ["search-terms", async (event) => { this.controller.setSearchTerms(event.target.value); }],
            ["job-post-url", async (event) => { this.controller.setJobPostUrl(event.target.value); }]
        ]

        for (let i=0; i<quickListeners.length; i++) {
            let elementId, handler;
            [elementId, handler] = quickListeners[i];
            document.getElementById(elementId).addEventListener("change", debounce(handler, 100));
        }

        let delayedListeners = [
            ['profile-link-linkedin', async (event) => { this.controller.setLinkedInProfileLink(event.target.value); }],
            ['profile-link-github', async (event) => { this.controller.setGithubProfileLink(event.target.value); }],
            ['profile-link-website', async (event) => { this.controller.setWebsiteProfileLink(event.target.value); }],
            ['application-log-sheet-name', async (event) => { this.controller.setGoogleSheetName(event.target.value); }]
        ]      

        for (let i=0; i<delayedListeners.length; i++) {
            let elementId, handler;
            [elementId, handler] = delayedListeners[i];
            document.getElementById(elementId).addEventListener("keydown", debounce(handler, 200));
        }

        let veryLongListeners = [
            ["job-description-div-editable", async (event) => { this.controller.setJobDescription(event.target.innerText); }],
            ['job-minimum-requirements-div-editable', async (event) => { this.controller.setMinimumRequirements(event.target.innerText); }],
            ['job-preferred-requirements-div-editable', async (event) => { this.controller.setPreferredRequirements(event.target.innerText); }],
            ['job-duties-div-editable', async (event) => { this.controller.setJobDuties(event.target.innerText); }],
            ['job-company-info-div-editable', async (event) => { this.controller.setCompanyInfo(event.target.innerText); }]
        ]

        for (let i=0; i<veryLongListeners.length; i++) {
            let elementId, handler;
            [elementId, handler] = veryLongListeners[i];
            document.getElementById(elementId).addEventListener("keydown", debounce(handler, 3000));
        }

        document.getElementById("job-description-div-editable").addEventListener("paste",
            debounce(
                async (event) => {
                    if (!this.model.jobDescription || this.model.jobDescription == ""){
                        await this.controller.pasteJobDescription(event.target.innerText);
                    } else {
                        this.controller.setJobDescription(event.target.innerText);
                    }
                },
                200));

        console.debug("Registered listeners");
    }

    async addHandlers() {

        window.onclick = (event) => {
            // Clicking "away" from modal is weird:
            // The modal covers the whole screen, you can only click its elements or the modal itself
            // You cannot set modal.onclick because that will include both itself and its elements
            // Therefore, you must use the window's onclick and test for the modal as a target
            this.modals.clickAway(event.target.id);
        }

        addLinkButton('idealist-search-button', this.model.searchLinkIdealist());
        addLinkButton('usajobs-search-button', this.model.searchLinkUsaJobs());
        addLinkButton('outerjoin-search-button', this.model.searchLinkOuterjoin());
        addLinkButton('linkedin-search-button', this.model.searchLinkLinkedIn());
        addLinkButton('search-all-button', [
            this.model.searchLinkIdealist(),
            this.model.searchLinkUsaJobs(),
            this.model.searchLinkOuterjoin(),
            this.model.searchLinkLinkedIn()
        ]);

        document.getElementById('google-authorize-button').onclick = async () => {
            this.controller.googleAuthorize();
        }

        document.getElementById('get-job-description-button').onclick = async () => {
            this.controller.getJobDescription();
        }

        document.getElementById('create-resume-button').onclick = async () => {
            this.controller.createResumeAndCoverLetter();
        }

        document.getElementById('scan-button').onclick = async () => {
            this.controller.scanButton();
        }

        document.getElementById('tailor-documents-button').onclick = async () => {
            this.controller.tailorDocuments();
            this.modals.clickAway("tailoring-modal");
        }

        document.getElementById('log-application-button').onclick = async () => {
            this.controller.logApplication();
        }

        document.getElementById('reset-button').onclick = async () => {
            this.controller.reset();
            // Reset modal can be cleared immediately
            this.modals.clickAway("reset-modal");
        }

        document.getElementById('clipboard-linkedin-query').onclick = async () => {
            this.controller.copyLinkedInQueryToClipboard();
        }

        document.getElementById('clipboard-linkedin-profile').onclick = async () => {
            this.controller.copyLinkedInProfileLinkToClipboard();
        }

        document.getElementById('clipboard-github-profile').onclick = async () => {
            this.controller.copyGithubProfileLinkToClipboard();
        }

        document.getElementById('clipboard-website').onclick = async () => {
            this.controller.copyWebsiteProfileLinkToClipboard();
        }

        document.getElementById('resume-download-button').onclick = async () => {
            downloadLink(this.model.resumePdfLink);
        }

        document.getElementById('cover-letter-download-button').onclick = async () => {
            downloadLink(this.model.coverLetterPdfLink);
        }

        this.jobSections.map( (jobSection) => {jobSection.registerHandlers();});

        console.debug("Registered handlers");
    }

}

export default WebApp;