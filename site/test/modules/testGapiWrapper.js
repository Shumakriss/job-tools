import TestSuite from "../lib.js";
import GapiWrapper from "../../modules/gapiWrapper.js";

import {MockGapi, MockGoogle} from "../mocks/MockGapi.js";


var testSuite = new TestSuite();

testSuite.addTest("GoogleDrive.constructor - Throws without parameters", () => {
    let wrapper = new GapiWrapper();
});

testSuite.addTest("GoogleDrive.isReady - False on initialization", () => {
    let gapi = new MockGapi();
    gapi.client.whenGetTokenCalled(() => {return false;});
    let google = new MockGoogle();
    let wrapper = new GapiWrapper(gapi, google);
    if (wrapper.isReady()) {
        throw new Error("GoogleApi is reporting ready when it cannot be");
    }
});

testSuite.addTest("GoogleDrive.signInReady", () => {
    let gapi = new MockGapi();
    gapi.client.whenGetTokenCalled(() => {return true;});
    let google = new MockGoogle();
    let wrapper = new GapiWrapper(gapi, google);
    if (wrapper.isSignInReady()) {
        throw new Error("GoogleApi is reporting ready when it cannot be");
    }
});

testSuite.addTest("GoogleDrive.signOutReady", () => {
    let gapi = new MockGapi();
    gapi.client.whenGetTokenCalled(() => {return false;});
    let google = new MockGoogle();
    let wrapper = new GapiWrapper(gapi, google);
    if (wrapper.isSignOutReady()) {
        throw new Error("GoogleApi is reporting ready when it cannot be");
    }
});

testSuite.addTest("GoogleDrive.refreshReady", () => {
    let gapi = new MockGapi();
    gapi.client.whenGetTokenCalled(() => {return false;});
    let google = new MockGoogle();
    let wrapper = new GapiWrapper(gapi, google);
    if (wrapper.isRefreshReady()) {
        throw new Error("GoogleApi is reporting ready when it cannot be");
    }
});

testSuite.addTest("GoogleDrive.onGapiLoaded - Throws when not Gapi isn't actually loaded", async () => {
    let gapi = new MockGapi();
    let google = new MockGoogle();
    let wrapper = new GapiWrapper(gapi, google);
    await wrapper.onGapiLoaded();
}, true);

testSuite.addTest("GoogleDrive.init", async () => {
    let gapi = new MockGapi();
    let google = new MockGoogle();
    let wrapper = new GapiWrapper(gapi, google);
    await wrapper.init();
});

testSuite.addTest("GoogleDrive.authorize", async () => {
    let gapi = new MockGapi();
    gapi.client.whenGetTokenCalled(() => {return false;});
    let google = new MockGoogle();
    let wrapper = new GapiWrapper(gapi, google);
    await wrapper.init();
    await wrapper.authorize();
}, true);


testSuite.addTest("GoogleDrive.load - Throws without input", async () => {
    let gapi = new MockGapi();
    let google = new MockGoogle();
    let wrapper = new GapiWrapper(gapi, google);
    await wrapper.load();
}, true);

testSuite.addTest("GoogleDrive.setToken - throws without input", async () => {
    let gapi = new MockGapi();
    let google = new MockGoogle();
    let wrapper = new GapiWrapper(gapi, google);
    await wrapper.setToken();
}, true);

testSuite.addTest("GoogleDrive.setToken", async () => {
    let gapi = new MockGapi();
    let google = new MockGoogle();
    let wrapper = new GapiWrapper(gapi, google);
    await wrapper.setToken({});
});

testSuite.addTest("GoogleDrive.signOut - Throws when Gooogle-side revocation is impossible", async () => {
    let gapi = new MockGapi();
    gapi.client.whenGetTokenCalled(() => {return false;});
    let google = new MockGoogle();
    let wrapper = new GapiWrapper(gapi, google);
    await wrapper.signOut();
}, true);

testSuite.addTest("GoogleDrive.load - Throws with empty credentials", async () => {
    let gapi = new MockGapi();
    let google = new MockGoogle();
    let wrapper = new GapiWrapper(gapi, google);
    let creds = {}
    await wrapper.load(creds);
}, true);

export {testSuite as gapiWrapperSuite};