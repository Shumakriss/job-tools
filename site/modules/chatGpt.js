
const CHATGPT_URL = "https://api.openai.com/v1/chat/completions";

class ChatGpt {
    constructor() {
        this.apiKey;
        this.healthCheckResult;
    }

    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }

    async isReady() {
        return this.apiKey && await this.healthCheck();
    }

    async healthCheck() {
        if (!this.healthCheckResult) {
            this.healthCheckResult = await this.ask("Say hello");
        }

        return this.healthCheckResult;
    }

    async ask(prompt, dryRun=false) {
        if (dryRun){
            return "Mock response from ChatGPT";
        }

        if (!this.apiKey){
            throw new Error("Chat GPT missing API Key");
        }

        if (!prompt) {
            throw new Error("Missing prompt");
        }

        return await this.askChatGpt(prompt);
    }

    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }

    async mockAskChatGpt(prompt) {
        return "fake results original prompt: \n" + prompt;
    }

    async askChatGpt(prompt) {
        console.log("Calling ChatGpt API with prompt: ", prompt);

        let headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + this.apiKey,
        }

        let payload = {
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7
        }

        try {
            const request = new Request(CHATGPT_URL, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(payload),
            });

            const response = await fetch(request);
            if (!response.ok) {
              throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            let choices = json['choices'];
            for (let i=0; i<choices.length; i++){
                if (choices[i]['index'] == 0) {
                    return choices[i]['message']['content'];
                }
            }
          } catch (error) {
            console.error(error.message);
            throw new Error("Failed to make request to chatGpt");
          }
    }
}

export default ChatGpt;