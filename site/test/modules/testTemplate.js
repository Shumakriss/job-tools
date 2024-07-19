import {TestSuite} from "../lib.js";
import {Template} from "../../modules/app.js";

var testSuite = new TestSuite();

testSuite.addTest("Template.constructor", async () => {
    let template = new Template();
});

export {testSuite as templateSuite};