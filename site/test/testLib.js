class TestCase {
    constructor(name, callback, expectThrow) {
        this.expectThrow = expectThrow;
        this.name = name;
        this.callback = callback;
    }
}

class TestSuite {

    constructor() {
        this.testResults = document.getElementById("test-results");
        this.tests = [];
    }

    async run() {
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

            this.addResults(test.name, pass, message);
        }
    }

    addTest(name, callback, expectThrow=false) {
        let test = new TestCase(name, callback, expectThrow);
        this.tests.push(test);
    }

    addResults(name, pass, message) {
        try{
            let li = document.createElement("li");

            let testNameLabel = document.createElement("label");
            testNameLabel.style = "font-size:20px;";
            testNameLabel.innerText = name + ": ";
            li.appendChild(testNameLabel);

            let icon = document.createElement("label");
            icon.style = "font-size:20px;" + (pass ? "color:green;" : "color:red;");
            icon.innerText = pass ? "PASS " : "FAIL ";
            li.appendChild(icon);

            let messageElement = document.createElement("p");
            messageElement.style = "font-size:16px;";
            messageElement.innerText = pass ? "" : message;
            li.appendChild(messageElement);

            this.testResults.appendChild(li);
        } catch(err) {
            throw new Error("Test lib error in addResults");
        }

    }
}
