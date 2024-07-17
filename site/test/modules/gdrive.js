import {TestSuite} from "../lib.js";
import {MockGoogleApi} from "../mocks/gapi.js";
import {GoogleDrive} from "../../modules/gdrive.js";

var testSuite = new TestSuite();

testSuite.addTest("GoogleDrive.constructor allows mock GoogleApi", () => {
    let googleApi = new MockGoogleApi();
    let gDrive = new GoogleDrive(googleApi);
});

testSuite.addTest("GoogleDrive.constructor throws without an API parameter", () => {
    let gDrive = new GoogleDrive();
}, true);


export {testSuite as gdriveSuite};