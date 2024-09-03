const SERVER = "http://127.0.0.1:5000"

class Services {

    async search(query, resume) {

        let requestBody = {
            "query": query,
            "resume": resume
            };

        try {
            const request = new Request(SERVER + "/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify(requestBody)
            });

            console.debug(request);
            const response = await fetch(request);

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const text = await response.json();

            return text;
        } catch (error) {
            console.error(error.message);
        }

    }

}

export default Services;