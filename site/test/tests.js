var suite = new TestSuite();

suite.addTest("GoogleDoc.constructor", () => {
    let gDoc = new GoogleDoc();
});

suite.addTest("GoogleDoc.getName", () => {
    let gDoc = new GoogleDoc();
    gDoc.getName();
});

suite.addTest("GoogleDoc.setName", () => {
    let gDoc = new GoogleDoc();
    gDoc.setName("foo");
});

suite.addTest("GoogleDoc.getId throws without name set", async () => {
    let gDoc = new GoogleDoc();
    await gDoc.getId();
}, true);

suite.addTest("GoogleDoc.getId", async () => {
    let gDoc = new GoogleDoc();
    gDoc.setName("Foo");
    await gDoc.getId();
});

suite.run();