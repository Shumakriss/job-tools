class TestCase {
    constructor(name, callback, expectThrow) {
        this.expectThrow = expectThrow;
        this.name = name;
        this.callback = callback;
    }
}

class Result {
    constructor(testName, pass, message) {
        this.testName = testName;
        this.pass = pass;
        this.message = message;
    }
}

class TestSuite {

    constructor() {
        this.testResults;
        this.tests = [];
    }

    async run() {

        let results = [];

        for (let i=0; i<this.tests.length; i++) {
            let test;
            let pass = false;
            let message = "";

            try
            {
                test = this.tests[i];
                await test.callback();
                pass = !test.expectThrow;
            } catch(err) {
                pass = test.expectThrow;
                message = err.message;
            }

            results.push(new Result(test.name, pass, message));
        }

        return results;
    }

    addTest(name, callback, expectThrow=false) {
        let test = new TestCase(name, callback, expectThrow);
        this.tests.push(test);
    }
}

function addSuiteResults(container, suiteName, results) {
    let header = document.createElement("h2");
    header.innerText = suiteName;
    container.appendChild(header);

    let ol = document.createElement("ol");

    for (let i=0; i<results.length; i++) {
        let testResult = results[i];

        let li = document.createElement("li");

        let testNameLabel = document.createElement("label");
        testNameLabel.style = "font-size:20px;";
        testNameLabel.innerText = testResult.testName + ": ";
        li.appendChild(testNameLabel);

        let icon = document.createElement("label");
        icon.style = "font-size:20px;" + (testResult.pass ? "color:green;" : "color:red;");
        icon.innerText = testResult.pass ? "PASS " : "FAIL ";
        li.appendChild(icon);

        let messageElement = document.createElement("p");
        messageElement.style = "font-size:16px;";
        messageElement.innerText = testResult.pass ? "" : testResult.message;
        li.appendChild(messageElement);

        ol.appendChild(li);
    }

    container.appendChild(ol);
}

export {TestSuite, addSuiteResults};
export default TestSuite;