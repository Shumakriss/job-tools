import View from './view.js'
import ChatGpt from './chatGpt.js'
import Jobscan from './jobscan.js'
import GoogleWorkspace from './googleWorkspace.js'


class Controller {

    /* Manages complexities of application initialization, state, and behavior
        - Delegates complexity to separate objects when necessary
    */
    constructor(view, gapi, google) {
        this.view = view;
        this.workspace = new GoogleWorkspace(view, gapi, google);
        this.chatgpt = new ChatGpt(view);
        this.jobscan = new Jobscan(view);
    }

    /* State Setters
        - Each stateful "thing" (i.e. button, etc.) has a setter
        - Update runs through all of them
    */

    setExtractJobSectionsEnabled() {
        this.view.extractJobSectionsEnabled = this.view.chatgptApiKey && this.jobDescription;
    }

    /* Field setters
        - Setters should exist for every field.
        - View should only use setters.
        - Setters do not perform work like handlers.
        - Setters may toggle or change viewable state like enabling/disabling buttons
        - Setters run updateEnabledState by convention
    */
    setCredentials(credentials) {
        this.view.chatgptApiKey = credentials.chatGpt.apiKey;
        this.setExtractJobSectionsEnabled();
    }

    setCompanyName(companyName) {
        // If changed, check for file
        // If file, disable button
        // If no file, enable button
    }

    /* Complex functions
        - Handles
    */
    googleSignIn() {}
    googleRefresh() {}
    googleSignOut() {}
    extractJobSections() {}
    createTailoredDocuments() {}
    mergeTemplateFields() {}
    scanResume() {}
    logApplication() {}
}

export default Controller;