import {addSuiteResults} from "./lib.js"
import TestSuite from "./lib.js";
import GapiWrapper from "../modules/gapiWrapper.js";

let container = document.getElementById("test-results-container");

var testSuite = new TestSuite();

var creds = {
    "clientId": "",
    "apiKey": ""
}

function sleep(ms) {
//    Only use sleep to manually confirm non-race condition behavior
    return new Promise(resolve => setTimeout(resolve, ms));
}

testSuite.addTest("GoogleWrapper", async () => {
    let wrapper = new GapiWrapper();
    wrapper.setApiKey(creds.apiKey);
    wrapper.setClientId(creds.clientId);
    wrapper.setGapi(gapi);
    wrapper.setGoogle(google);
    await wrapper.init();
});

addSuiteResults(container, "GapiWrapper", await testSuite.run());
