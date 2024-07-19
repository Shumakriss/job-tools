import TestSuite from "../lib.js";
import GoogleDrive from "../../modules/gdrive.js";

import {MockGapi, MockGoogle} from "../mocks/MockGapi.js";
import MockGoogleApiWrapper from "../mocks/MockGapiWrapper.js";

var testSuite = new TestSuite();

testSuite.addTest("GoogleDrive.constructor allows mock GoogleApi", async () => {
    let gapiWrapper = new MockGoogleApiWrapper();
    let gDrive = new GoogleDrive(gapiWrapper);
});

testSuite.addTest("GoogleDrive.gDocLinkFromId", async () => {
    let id = "asdf";
    let gDocLink = GoogleDrive.gDocLinkFromId(id);
    if (gDocLink != "https://docs.google.com/document/d/asdf/edit") {
        throw new Error("Failed to craft link properly");
    }
});

testSuite.addTest("GoogleDrive.gDocLinkFromId - Throws without input", async () => {
    let gDocLink = GoogleDrive.gDocLinkFromId();
}, true);

testSuite.addTest("GoogleDrive.gDocLinkFromId - Throws with empty input", async () => {
    let gDocLink = GoogleDrive.gDocLinkFromId("");
}, true);

//    async listFiles()
testSuite.addTest("GoogleDrive.listFiles", async () => {
    let gapi = new MockGapi();
    gapi.client.whenGetTokenCalled(() => {return true;});
    let google = new MockGoogle();
    let wrapper = new MockGoogleApiWrapper(gapi, google);
    let gDrive = new GoogleDrive(wrapper);
//    debugger;
    let result = await gDrive.listFiles();
});


//    async getDocumentIdByName(name)
//    async copyFile(fileId, fileName)
//    async getPlaintextFileContents(fileId)
//    async getPdfFileContents(fileId)
//
//    async createFile(fileId)
//
//    async getPdfLink(fileId)


export {testSuite as gdriveSuite};