
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
        this.company = new Company();
    }

    setCompany(company) {
        this.company = company;
    }

    setDescription(description) {
        this.description = description;
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