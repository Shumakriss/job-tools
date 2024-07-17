import {addSuiteResults} from "./lib.js"
import {gapiWrapperSuite} from "./modules/testGapiWrapper.js"

let container = document.getElementById("test-results-container");

addSuiteResults(container, "GapiWrapper", await gapiWrapperSuite.run());