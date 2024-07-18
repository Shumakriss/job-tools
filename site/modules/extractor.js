import ChatGpt from "./chatGpt.js";

const JOB_TITLE_PROMPT = `Given a job description, respond with the job title or just say "staff software engineer" if it is not provided. Do not include words that are not in the job title.`;
const COMPANY_NAME_PROMPT = `Given a job description, respond with the name of the company or just say "unknown" if it is not provided. Do not include words that are not in the company name.`;
const MINIMUM_JOB_REQUIREMENTS_PROMPT = `Given a job description, find the section intended to convey the minimum or basic requirements for the applicant and provide them in your response. Do not provide any other words in the response besides the list.`;
const PREFERRED_JOB_REQUIREMENTS_PROMPT = `Given a job description, determine if there is a section intended to convey the preferred, additional, or bonus requirements to the job. If so, provide the contents verbatim. If not, just say "no section found". Do not include any additional wording aside from the contents of the section.`;
const JOB_DUTIES_PROMPT = `Given a job description, find the section intended to convey the job's duties or responsibilities and provide them in your response. Sections with titles like "About the role", "Job Duties", "Responsibilities", "In your first week you will", or "The Opportunity" and other similar titles should be included in the response. Do not include sections about the company, basic requirements, or preferred requirements. List the contents of the role and responsibilities sections verbatim.`;
const COMPANY_INFORMATION_PROMPT = `Given a job description, determine if there is a section intended to describe the company or team. If so, provide the contents verbatim. If not, just say "no section found". Do not include any additional wording aside from the contents of the job description. Do not include information from other sections about the role or its requirements or responsibilities.`;
const RESUME_SUGGESTIONS_PROMPT = `Given a resume and a list of keywords to include, offer suggestions on how to integrate the keywords into the resume with as little modification necessary. Highlight text which is not in the original resume in bold. Only incorporate keywords if the candidate seems to have strongly related experience. Also, list the keywords which could not reasonably be integrated.`;

class Extractor {
    constructor() {
        this.chatGpt = new ChatGpt();
    }

    static createFromObject(jsonObject) {
        if (!jsonObject) {
            throw new Error("Object to load was undefined");
        }
        if (typeof jsonObject != 'object') {
            throw new Error("Object to load not an object");
        }
        try {
            let temp = new Extractor();

            // Do the deep copy
            temp.setApiKey(jsonObject.chatGpt.apiKey);

            return temp;
        } catch(err) {
            throw new Error("Encountered issue during deep-copy. Error: " + err.message, { cause: err })
        }
    }

    setChatGpt(chatGpt) {
        this.chatGpt = chatGpt;
    }

    setApiKey(apiKey) {
        this.chatGpt.setApiKey(apiKey);
    }

    isReady() {
        return this.chatGpt && this.chatGpt.isReady();
    }

    async extractSection(sectionPrompt, sectionText) {
        let prompt = sectionPrompt + "\n\nJob Description:\n\n"+ sectionText;
        let response = await this.chatGpt.ask(prompt);
        if (response == "No section found.") {
            response = "";
        }
        return response;
    }

    async extractCompanyName(jobDescription) {
        return await extractSection(COMPANY_NAME_PROMPT, jobDescription);
    }

    async extractJobTitle(jobDescription) {
        return await extractSection(JOB_TITLE_PROMPT, jobDescription);
    }

    async extractMinimumRequirements(jobDescription) {
        return await extractSection(MINIMUM_JOB_REQUIREMENTS_PROMPT, jobDescription);
    }

    async extractPreferredJobRequirements(jobDescription) {
        return await extractSection(PREFERRED_JOB_REQUIREMENTS_PROMPT, jobDescription);
    }

    async extractJobDuties(jobDescription) {
        return await extractSection(JOB_DUTIES_PROMPT, jobDescription);
    }

    async extractCompanyInformation(jobDescription) {
        return await extractSection(COMPANY_INFORMATION_PROMPT, jobDescription);
    }

    async extractResumeSuggestions(jobDescription) {
        return await extractSection(RESUME_SUGGESTIONS_PROMPT, jobDescription);
    }

}

export default Extractor;