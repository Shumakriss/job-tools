
class Company {
    constructor() {
        this.name = "";
        this.possessive = "";
        this.about = "";
        this.address = "";
        this.values = "";
    }

    setName(name) {
        this.name = name;
        if(name && name != null && name != "") {

            if(name.endsWith("s")) {
                this.possessive = name + "'";
            } else {
                this.possessive = name + "'s";
            }

        }

    }
}

export default Company;