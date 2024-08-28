class JobSection {
// Describes a widget for storing job descriptions or pieces of job descriptions

    constructor(sectionName) {
        this.sectionName = sectionName;

        this.editableDivId = sectionName + "-div-editable";
        this.markupDivId = sectionName + "-div-markup";
        this.editButtonId = sectionName + "-button-edit";
        this.keywordButtonId = sectionName + "-button-show";

        this.editableDiv = document.getElementById(this.editableDivId);
        this.markupDiv = document.getElementById(this.markupDivId);
        this.editButton = document.getElementById(this.editButtonId);
        this.keywordButton = document.getElementById(this.keywordButtonId);
        console.log(this);
    }

    registerHandlers() {
        console.log("Registered job section handlers");
        this.editButton.onclick = async () => {
            console.log("Job section edit button click: " + this.sectionName);
            this.editableDiv.hidden = "";
            this.markupDiv.hidden = "hidden";
            this.keywordButton.className = "button-keyword-toggle-inactive";
            this.editButton.className = "button-keyword-toggle-active";
        }

        this.keywordButton.onclick = async () => {
            this.editableDiv.hidden = "hidden";
            this.markupDiv.hidden = "";
            this.keywordButton.className = "button-keyword-toggle-active";
            this.editButton.className = "button-keyword-toggle-inactive";
        }
    }

    showEditable() {
        this.markupDiv.hidden = "hidden";
        this.editableDiv.hidden = "";

        this.editButton.className = "button-keyword-toggle-active";
        this.keywordButton.className = "button-keyword-toggle-inactive";
    }

    showMarkup() {
        this.markupDiv.hidden = "";
        this.editableDiv.hidden = "hidden";

        this.editButton.className = "button-keyword-toggle-inactive";
        this.keywordButton.className = "button-keyword-toggle-active";
    }

}

export default JobSection;