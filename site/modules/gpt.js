const CHATGPT_URL = "https://api.openai.com/v1/chat/completions";

async function mockAskChatGpt(apiKey, prompt) {
    return "fake results original prompt: \n" + prompt;
}

async function askChatGpt(apiKey, prompt) {
    console.log("Calling ChatGpt API");

    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
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
      }
}