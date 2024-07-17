import {TestSuite} from "../lib.js";
import {GoogleApiWrapper} from "../../modules/gapiWrapper.js";

class MockGapiClient {

    constructor() {
        this.getTokenCallback;
    }

    whenGetTokenCalled(callback) {
        if (callback && typeof callback === "function") {
            this.getTokenCallback = callback;
        } else {
            throw new Error("MockGapiClient.whenGetTokenCalled - Parameter is not a function");
        }
    }

    init() {
    }

    getToken() {
        return this.getTokenCallback();
    }

    setToken() {}
}

class MockGapi {

    constructor () {
        this.client = new MockGapiClient();
    }

}

class TokenClient {
    constructor() {
        this.callback;
    }

    requestAccessToken() {
    }
}

class MockOauth {

    constructor() {
        this.tokenClient = new TokenClient();
    }

    initTokenClient() { return this.tokenClient; }
    revoke() {}
}

class Accounts {
    constructor() {
        this.oauth2 = new MockOauth();
    }
}

class MockGoogle {
    constructor() {
        this.accounts = new Accounts();
    }
}

var testSuite = new TestSuite();

testSuite.addTest("GoogleDrive.constructor - Throws without parameters", () => {
    let wrapper = new GoogleApiWrapper();
}, true);

testSuite.addTest("GoogleDrive.constructor - Throws with one parameter", () => {
    let gapi = new MockGapi();
    let wrapper = new GoogleApiWrapper(gapi);
}, true);

testSuite.addTest("GoogleDrive.constructor - Does not throw with two parameters", () => {
    let gapi = new MockGapi();
    let google = new MockGoogle();
    let wrapper = new GoogleApiWrapper(gapi, google);
});

testSuite.addTest("GoogleDrive.isReady - False on initialization", () => {
    let gapi = new MockGapi();
    gapi.client.whenGetTokenCalled(() => {return false;});
    let google = new MockGoogle();
    let wrapper = new GoogleApiWrapper(gapi, google);
    if (wrapper.isReady()) {
        throw new Error("GoogleApi is reporting ready when it cannot be");
    }
});

testSuite.addTest("GoogleDrive.signInReady", () => {
    let gapi = new MockGapi();
    gapi.client.whenGetTokenCalled(() => {return true;});
    let google = new MockGoogle();
    let wrapper = new GoogleApiWrapper(gapi, google);
    if (wrapper.isSignInReady()) {
        throw new Error("GoogleApi is reporting ready when it cannot be");
    }
});

testSuite.addTest("GoogleDrive.signOutReady", () => {
    let gapi = new MockGapi();
    gapi.client.whenGetTokenCalled(() => {return false;});
    let google = new MockGoogle();
    let wrapper = new GoogleApiWrapper(gapi, google);
    if (wrapper.isSignOutReady()) {
        throw new Error("GoogleApi is reporting ready when it cannot be");
    }
});

testSuite.addTest("GoogleDrive.refreshReady", () => {
    let gapi = new MockGapi();
    gapi.client.whenGetTokenCalled(() => {return false;});
    let google = new MockGoogle();
    let wrapper = new GoogleApiWrapper(gapi, google);
    if (wrapper.isRefreshReady()) {
        throw new Error("GoogleApi is reporting ready when it cannot be");
    }
});

testSuite.addTest("GoogleDrive.onGapiLoaded", async () => {
    let gapi = new MockGapi();
    let google = new MockGoogle();
    let wrapper = new GoogleApiWrapper(gapi, google);
    await wrapper.onGapiLoaded();
});

testSuite.addTest("GoogleDrive.init", async () => {
    let gapi = new MockGapi();
    let google = new MockGoogle();
    let wrapper = new GoogleApiWrapper(gapi, google);
    await wrapper.init();
});

testSuite.addTest("GoogleDrive.authorize", async () => {
    let gapi = new MockGapi();
    gapi.client.whenGetTokenCalled(() => {return false;});
    let google = new MockGoogle();
    let wrapper = new GoogleApiWrapper(gapi, google);
    await wrapper.init();
    await wrapper.authorize();
}, true);


testSuite.addTest("GoogleDrive.load - Throws without input", async () => {
    let gapi = new MockGapi();
    let google = new MockGoogle();
    let wrapper = new GoogleApiWrapper(gapi, google);
    await wrapper.load();
}, true);

testSuite.addTest("GoogleDrive.load", async () => {
    let gapi = new MockGapi();
    let google = new MockGoogle();
    let wrapper = new GoogleApiWrapper(gapi, google);
    let creds = {}
    await wrapper.load(creds);
});

testSuite.addTest("GoogleDrive.setToken - throws without input", async () => {
    let gapi = new MockGapi();
    let google = new MockGoogle();
    let wrapper = new GoogleApiWrapper(gapi, google);
    await wrapper.setToken();
}, true);

testSuite.addTest("GoogleDrive.setToken", async () => {
    let gapi = new MockGapi();
    let google = new MockGoogle();
    let wrapper = new GoogleApiWrapper(gapi, google);
    await wrapper.setToken({});
});

testSuite.addTest("GoogleDrive.signOut", async () => {
    let gapi = new MockGapi();
    gapi.client.whenGetTokenCalled(() => {return false;});
    let google = new MockGoogle();
    let wrapper = new GoogleApiWrapper(gapi, google);
    await wrapper.signOut();
});

export {testSuite as gapiWrapperSuite};