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


function openLinkInNewTab(url) {
    const a = document.createElement('a')
    a.href = url
    a.target = "_blank"
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

    async start() {
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

        document.getElementById("keyword-resume-name").addEventListener("change", debounce( async (event) => {
            controller.setKeywordResumeName(event.target.value);
        }, 100));

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

        document.getElementById("hiring-manager-name").addEventListener("change", debounce( async (event) => {
            controller.setHiringManager(event.target.value);
        }, 100));

        document.getElementById("company-values").addEventListener("change", debounce( async (event) => {
            controller.setCompanyValues(event.target.value);
        }, 100));

        document.getElementById("relevant-experience").addEventListener("change", debounce( async (event) => {
            controller.setRelevantExperience(event.target.value);
        }, 100));

        document.getElementById("search-terms").addEventListener("change", debounce( async (event) => {
            controller.setSearchTerms(event.target.value);
        }, 100));


        document.getElementById("job-post-url").addEventListener("change", debounce( async (event) => {
            controller.setJobPostUrl(event.target.value);
        }, 100));

        document.addEventListener('keydown', e => {
            if (e.metaKey && e.key === 's') {
                // Prevent the Save dialog to open
                e.preventDefault();

                this.controller.handleUserSave();
            } else if (e.key === 'Escape') {
                document.getElementById("settings-modal").style.display = "none";
                document.getElementById("tailoring-modal").style.display = "none";
                document.getElementById("job-sections-modal").style.display = "none";
                document.getElementById("apply-modal").style.display = "none";
                document.getElementById("search-modal").style.display = "none";
                document.getElementById("reset-modal").style.display = "none";
            } else if (e.key === 'r') {
                this.controller.scan();
            }
        });

        console.debug("Registered listeners");
    }

    async addHandlers() {

        document.getElementById('idealist-search-button').onclick = async () => {
            openLinkInNewTab(this.model.searchLinkIdealist());
        }

        document.getElementById('usajobs-search-button').onclick = async () => {
            openLinkInNewTab(this.model.searchLinkUsaJobs());
        }

        document.getElementById('outerjoin-search-button').onclick = async () => {
            openLinkInNewTab(this.model.searchLinkOuterjoin());
        }

        document.getElementById('linkedin-search-button').onclick = async () => {
            openLinkInNewTab(this.model.searchLinkLinkedIn());
        }

        document.getElementById('search-all-button').onclick = async () => {
            openLinkInNewTab(this.model.searchLinkIdealist());
            openLinkInNewTab(this.model.searchLinkUsaJobs());
            openLinkInNewTab(this.model.searchLinkOuterjoin());
            openLinkInNewTab(this.model.searchLinkLinkedIn());
        }

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
        }

        document.getElementById('log-application-button').onclick = async () => {
            this.controller.logApplication();
        }

        document.getElementById('reset-button').onclick = async () => {
            console.debug("Reset button click");
            this.controller.reset();
            document.getElementById("reset-modal").style.display = "none";
        }

        document.getElementById('clipboard-linkedin-query').onclick = () => {
            this.controller.copyLinkedInQueryToClipboard();
        }

        document.getElementById('clipboard-linkedin-profile').onclick = () => {
            this.controller.copyLinkedInProfileLinkToClipboard();
        }

        document.getElementById('clipboard-github-profile').onclick = () => {
            this.controller.copyGithubProfileLinkToClipboard();
        }

        document.getElementById('clipboard-website').onclick = () => {
            this.controller.copyWebsiteProfileLinkToClipboard();
        }

        document.getElementById('resume-download-button').onclick = () => {
            downloadLink(this.model.resumePdfLink);
        }

        document.getElementById('cover-letter-download-button').onclick = () => {
            downloadLink(this.model.coverLetterPdfLink);
        }

        document.getElementById('configure-button').onclick = () => {
            document.getElementById("settings-modal").style.display = "block";
        }

        document.getElementById('view-sections-button').onclick = () => {
            document.getElementById("job-sections-modal").style.display = "block";
        }

        document.getElementById('apply-button').onclick = async () => {
            document.getElementById("apply-modal").style.display = "block";
        }

        document.getElementById('search-button').onclick = async () => {
            document.getElementById("search-modal").style.display = "block";
        }

        document.getElementById('reset-modal-button').onclick = async () => {
            document.getElementById("reset-modal").style.display = "block";
        }

        window.onclick = function(event) {
            if (event.target == document.getElementById("settings-modal")) {
               document.getElementById("settings-modal").style.display = "none";
            } else if (event.target == document.getElementById("tailoring-modal")) {
                document.getElementById("tailoring-modal").style.display = "none";
            } else if (event.target == document.getElementById("job-sections-modal")) {
                document.getElementById("job-sections-modal").style.display = "none";
            } else if (event.target == document.getElementById("apply-modal")) {
                document.getElementById("apply-modal").style.display = "none";
            } else if (event.target == document.getElementById("search-modal")) {
                document.getElementById("search-modal").style.display = "none";
            } else if (event.target == document.getElementById("reset-modal")) {
                document.getElementById("reset-modal").style.display = "none";
            }
        }

        document.getElementById('configure-tailoring-button').onclick = () => {
            document.getElementById("tailoring-modal").style.display = "block";
        }

        console.debug("Registered handlers");
    }
}

export default WebApp;