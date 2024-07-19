import TestSuite from "../lib.js";
import GapiWrapper from "../../modules/gapiWrapper.js";

import {MockGapi, MockGoogle, MockTokenClient} from "../mocks/MockGapi.js";


var testSuite = new TestSuite();

testSuite.addTest("GapiWrapper.constructor - Throws without parameters", async () => {
    let wrapper = new GapiWrapper();
});

testSuite.addTest("GapiWrapper.isReady - False on initialization", async () => {
    let gapi = new MockGapi();
    gapi.client.whenGetTokenCalled( () => {return false;});

    let google = new MockGoogle();
    let wrapper = new GapiWrapper();

    if (await wrapper.isReady()) {
        throw new Error("GoogleApi is reporting ready when it cannot be");
    }
});

testSuite.addTest("GapiWrapper.signInReady", async () => {
    let google = new MockGoogle();
    let gapi = new MockGapi();
    gapi.client.whenGetTokenCalled(() => {return true;});

    let wrapper = new GapiWrapper();
    wrapper.setGapi(gapi);
    wrapper.setGoogle(google);

    if (await wrapper.isSignInReady()) {
        throw new Error("GoogleApi is reporting ready when it cannot be");
    }
});

testSuite.addTest("GapiWrapper.signOutReady", async () => {
    let gapi = new MockGapi();
    gapi.client.whenGetTokenCalled(() => {return true;});
    let google = new MockGoogle();
    let wrapper = new GapiWrapper();
    if (await wrapper.isSignOutReady()) {
        throw new Error("GoogleApi is reporting ready when it cannot be");
    }
});

testSuite.addTest("GapiWrapper.refreshReady", async () => {
    let gapi = new MockGapi();
    gapi.client.whenGetTokenCalled(() => {return false;});
    let google = new MockGoogle();
    let wrapper = new GapiWrapper();
    if (await wrapper.isRefreshReady()) {
        throw new Error("GoogleApi is reporting ready when it cannot be");
    }
});

testSuite.addTest("GapiWrapper.onGapiLoaded - Throws when not Gapi isn't actually loaded", async () => {
    let gapi = new MockGapi();
    let google = new MockGoogle();
    let wrapper = new GapiWrapper();
    await wrapper.onGapiLoaded();
}, true);

testSuite.addTest("GapiWrapper.init", async () => {
    let gapi = new MockGapi();
    let google = new MockGoogle();
    let wrapper = new GapiWrapper();
    await wrapper.init();
});

testSuite.addTest("GapiWrapper.authorize - Succeeds when token is valid", async () => {
    let gapi = new MockGapi();
    gapi.client.whenGetTokenCalled(() => {return true;});
    let google = new MockGoogle();
    let tokenClient = new MockTokenClient();
    let wrapper = new GapiWrapper();
    wrapper.setGapi(gapi);
    wrapper.setGoogle(google);
    wrapper.setTokenClient(tokenClient);

    await wrapper.init();
    await wrapper.authorize();
});


testSuite.addTest("GapiWrapper.load - Throws without input", async () => {
    let gapi = new MockGapi();
    let google = new MockGoogle();
    let wrapper = new GapiWrapper();
    await wrapper.load();
}, true);

testSuite.addTest("GapiWrapper.setToken - throws without input", async () => {
    let gapi = new MockGapi();
    let google = new MockGoogle();
    let wrapper = new GapiWrapper();
    await wrapper.setToken();
}, true);

testSuite.addTest("GapiWrapper.setToken", async () => {
    let gapi = new MockGapi();
    let google = new MockGoogle();
    let wrapper = new GapiWrapper();
    await wrapper.setToken({});
});

testSuite.addTest("GapiWrapper.signOut - Throws when Gooogle-side revocation is impossible", async () => {
    let gapi = new MockGapi();
    gapi.client.whenGetTokenCalled(() => {return false;});
    let google = new MockGoogle();
    let wrapper = new GapiWrapper();
    await wrapper.signOut();
}, true);

testSuite.addTest("GapiWrapper.load - Throws with empty credentials", async () => {
    let gapi = new MockGapi();
    let google = new MockGoogle();
    let wrapper = new GapiWrapper();
    let creds = {}
    await wrapper.load(creds);
}, true);

export {testSuite as gapiWrapperSuite};