import Company from "./company.js";

class JobPosting {

    constructor() {
        this.title = "";
        this.completeTitle = "";
        this.shortTitle = "";
        this.description = "";
        this.minimumRequirements = "";
        this.preferredRequirements = "";
        this.responsibilities = "";
        this.hiringManager = "Hiring Manager";
        this.relevantExperience = "";
        this.company;
    }

    static createFromObject(jsonObject) {
        if (!jsonObject) {
            throw new Error("Object to load was undefined");
        }
        if (typeof jsonObject != 'object') {
            throw new Error("Object to load not an object");
        }
        try {
            let temp = new JobPosting();

            // Do the deep copy
            temp.setTitle(jsonObject.title);
            temp.description = jsonObject.description;
            temp.minimumRequirements = jsonObject.minimumRequirements;
            temp.preferredRequirements = jsonObject.preferredRequirements;
            temp.jobDuties = jsonObject.jobDuties;
            temp.companyInformation = jsonObject.companyInformation;

            return temp;
        } catch(err) {
            throw new Error("Encountered issue during deep-copy. Error: " + err.message, { cause: err })
        }
    }

    setCompany(company) {
        this.company = company;
    }

    setDescription(description) {
        this.description = description;
    }
    
    setMinimumRequirements(minimumRequirements) {
        this.minimumRequirements = minimumRequirements;
    }

    setPreferredRequirements(preferredRequirements) {
        this.preferredRequirements = preferredRequirements;
    }

    setJobDuties(jobDuties) {
        this.jobDuties = jobDuties;
    }

    setCompanyInformation(companyInformation) {
        this.companyInformation = companyInformation;
    }


    setTitle(title) {
        console.debug("JobPosting.setTitle() - " + title);
        this.title = title;

        if (this.shortTitle == "") {
            console.debug("JobPosting.setTitle() - shortTitle is empty, trying to update");
            if (title.includes(",")){
                this.shortTitle = title.split(",")[0];
            } else {
                this.shortTitle = title;
            }
        }

        if (this.completeTitle == "") {
            this.completeTitle = title;
        }
    }
}

export default JobPosting;