class MockGDriveFiles {

    list() {
        return {"result": {"files": []}};
    }
}

class MockGDriveClient {
    constructor() {
        this.files = new MockGDriveFiles();
    }
}

class MockGapiClient {

    constructor() {
        this.drive = new MockGDriveClient();
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

export {MockGapi, MockGoogle};