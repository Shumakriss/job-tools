import {addSuiteResults} from "./lib.js"
import {gapiWrapperSuite} from "./modules/testGapiWrapper.js"
import {gdriveSuite} from "./modules/testGDrive.js"

let container = document.getElementById("test-results-container");

addSuiteResults(container, "GapiWrapper", await gapiWrapperSuite.run());
addSuiteResults(container, "GDrive", await gdriveSuite.run());
