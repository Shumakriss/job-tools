import {TestSuite} from "../lib.js";
import {GoogleDoc} from "../../modules/app.js";


var testSuite = new TestSuite();

testSuite.addTest("GoogleDoc.constructor", () => {
    let gDoc = new GoogleDoc();
});

testSuite.addTest("GoogleDoc.getName", () => {
    let gDoc = new GoogleDoc();
    gDoc.getName();
});

testSuite.addTest("GoogleDoc.setName", () => {
    let gDoc = new GoogleDoc();
    gDoc.setName("foo");
});

testSuite.addTest("GoogleDoc.getId throws without name set", async () => {
    let gDoc = new GoogleDoc();
    await gDoc.getId();
}, true);

testSuite.addTest("GoogleDoc.getId missing file", async () => {
    let gDoc = new GoogleDoc();
    gDoc.setName("asdfp98yhasdlkfh3lkhluahsdf");
    let id = await gDoc.getId();
});

export {testSuite as googleDocSuite};