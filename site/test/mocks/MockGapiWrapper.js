import {MockGapi, MockGoogle} from "./MockGapi.js";

class MockGoogleApiWrapper {

    constructor () {
        this.gapi = new MockGapi();
        this.google = new MockGoogle();
    }

    setToken() {
    }

    isReady() {
    }

    isSignInReady() {
    }

    isSignOutReady() {
    }

    isRefreshReady() {
    }

    async onGapiLoaded() {
    }

    init() {
    }

    async authorize() {
    }

    load(googleApi) {
    }

    setToken(token) {
    }

    signOut() {
    }
}

export {MockGoogleApiWrapper};