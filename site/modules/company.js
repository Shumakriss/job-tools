
class Company {

    constructor() {
        this.name = "";
        this.possessive = "";
        this.about = "";
        this.address = "";
        this.values = "";
    }

    static createFromObject(jsonObject) {
        if (!jsonObject) {
            throw new Error("Object to load was undefined");
        }
        if (typeof jsonObject != 'object') {
            throw new Error("Object to load not an object");
        }
        try {
            let temp = new Company();

            // Do the deep copy
            temp.setName(jsonObject.name);

            return temp;
        } catch(err) {
            throw new Error("Encountered issue during deep-copy. Error: " + err.message, { cause: err })
        }
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