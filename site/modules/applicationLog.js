

class ApplicationLog {
    constructor() {
        this.name;
        this.googleDoc = new GoogleDoc();
    }

    setName(name) {
        this.name = name;
        this.googleDoc.setName(name);
    }

    logApplication(companyName) {
        return;
    }
}

export default ApplicationLog;