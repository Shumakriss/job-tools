const CHATGPT_URL = "https://api.openai.com/v1/chat/completions";

const JOB_TITLE_PROMPT = `Given a job description, respond with the job title or just say "staff software engineer" if it is not provided. Do not include words that are not in the job title.`;
const COMPANY_NAME_PROMPT = `Given a job description, respond with the most likely name of the company. Do not include words that are not in the company name.`;
const MINIMUM_JOB_REQUIREMENTS_PROMPT = `Given a job description, find the section intended to convey the minimum or basic requirements for the applicant and provide them in your response. Do not provide any other words in the response besides the list.`;
const PREFERRED_JOB_REQUIREMENTS_PROMPT = `Given a job description, determine if there is a section intended to convey the preferred, additional, or bonus requirements to the job. If so, provide the contents verbatim. If not, just say "no section found". Do not include any additional wording aside from the contents of the section.`;
const JOB_DUTIES_PROMPT = `Given a job description, find the section intended to convey the job's duties or responsibilities and provide them in your response. Sections with titles like "About the role", "Job Duties", "Responsibilities", "In your first week you will", or "The Opportunity" and other similar titles should be included in the response. Do not include sections about the company, basic requirements, or preferred requirements. List the contents of the role and responsibilities sections verbatim.`;
const COMPANY_INFORMATION_PROMPT = `Given a job description, determine if there is a section intended to describe the company or team. If so, provide the contents verbatim. If not, just say "no section found". Do not include any additional wording aside from the contents of the job description. Do not include information from other sections about the role or its requirements or responsibilities.`;
const RESUME_SUGGESTIONS_PROMPT = `Given a resume and a list of keywords to include, offer suggestions on how to integrate the keywords into the resume with as little modification necessary. Highlight text which is not in the original resume in bold. Only incorporate keywords if the candidate seems to have strongly related experience. Also, list the keywords which could not reasonably be integrated.`;

class ChatGpt {
    constructor(view) {
        this.view = view
    }

    async ask(prompt) {
        console.debug("Formatting ChatGpt API request");

        let headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + this.view.chatgptApiKey,
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
    
    async extractSection(sectionPrompt, jobDescriptionText) {
        if (!sectionPrompt) {
            throw new Error("Cannot extract job description section without prompt-prefix");
        }
        if (!jobDescriptionText) {
            throw new Error("Cannot extract job description section without job description");
        }
        let prompt = sectionPrompt + "\n\nJob Description:\n\n"+ jobDescriptionText;

        console.debug("Issued prompt to ChatGpt");
        let response = await this.ask(prompt);
        console.debug("ChatGpt replied");

        if (response.toLowerCase().includes("no section found")) {
            console.warn("Chat GPT was unable to find an appropriate response");
            response = "";
        } else if (response.toLowerCase().includes("unknown")) {
            console.warn("Chat GPT was unable to find an appropriate response");
            response = "";
        }
        return response;
    }

    // TODO: Move to controller?
    async extractJobSections() {
        this.view.companyName = await this.extractSection(COMPANY_NAME_PROMPT, this.view.jobDescription);
        this.view.jobTitle = await this.extractSection(JOB_TITLE_PROMPT, this.view.jobDescription);
        this.view.minimumRequirements = await this.extractSection(MINIMUM_JOB_REQUIREMENTS_PROMPT, this.view.jobDescription);
        this.view.preferredRequirements = await this.extractSection(PREFERRED_JOB_REQUIREMENTS_PROMPT, this.view.jobDescription);
        this.view.jobDuties = await this.extractSection(JOB_DUTIES_PROMPT, this.view.jobDescription);
        this.view.companyInfo = await this.extractSection(COMPANY_INFORMATION_PROMPT, this.view.jobDescription);
        this.view.save();
    }

}

export default ChatGpt;