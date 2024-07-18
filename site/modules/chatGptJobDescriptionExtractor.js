const JOB_TITLE_PROMPT = `Given a job description, respond with the job title or just say "staff software engineer" if it is not provided. Do not include words that are not in the job title.`;
const COMPANY_NAME_PROMPT = `Given a job description, respond with the name of the company or just say "unknown" if it is not provided. Do not include words that are not in the company name.`;
const MINIMUM_JOB_REQUIREMENTS_PROMPT = `Given a job description, find the section intended to convey the minimum or basic requirements for the applicant and provide them in your response. Do not provide any other words in the response besides the list.`;
const PREFERRED_JOB_REQUIREMENTS_PROMPT = `Given a job description, determine if there is a section intended to convey the preferred, additional, or bonus requirements to the job. If so, provide the contents verbatim. If not, just say "no section found". Do not include any additional wording aside from the contents of the section.`;
const JOB_DUTIES_PROMPT = `Given a job description, find the section intended to convey the job's duties or responsibilities and provide them in your response. Sections with titles like "About the role", "Job Duties", "Responsibilities", "In your first week you will", or "The Opportunity" and other similar titles should be included in the response. Do not include sections about the company, basic requirements, or preferred requirements. List the contents of the role and responsibilities sections verbatim.`;
const COMPANY_INFORMATION_PROMPT = `Given a job description, determine if there is a section intended to describe the company or team. If so, provide the contents verbatim. If not, just say "no section found". Do not include any additional wording aside from the contents of the job description. Do not include information from other sections about the role or its requirements or responsibilities.`;
const RESUME_SUGGESTIONS_PROMPT = `Given a resume and a list of keywords to include, offer suggestions on how to integrate the keywords into the resume with as little modification necessary. Highlight text which is not in the original resume in bold. Only incorporate keywords if the candidate seems to have strongly related experience. Also, list the keywords which could not reasonably be integrated.`;

class ChatGptJobDescriptionExtractor {

    async extractJobDescriptionSections() {
        let prompt;
        let response;

        prompt = COMPANY_NAME_PROMPT + "\n\nJob Description:\n\n"+ app.job.description;
        response = await this.chatGpt.ask(prompt);
        if (response == "No section found.") {
            response = "";
        }
        app.setCompanyName(response);

        prompt = JOB_TITLE_PROMPT + "\n\nJob Description:\n\n"+ app.job.description;
        response = await this.chatGpt.ask(prompt);
        if (response == "No section found.") {
            response = "";
        }
        app.job.setTitle(response);

        prompt = JOB_DUTIES_PROMPT + "\n\nJob Description:\n\n"+ app.job.description;
        response = await this.chatGpt.ask(prompt);
        if (response == "No section found.") {
            response = "";
        }
        app.job.responsibilities = response;

        prompt = COMPANY_INFORMATION_PROMPT + "\n\nJob Description:\n\n"+ app.job.description;
        response = await this.chatGpt.ask(prompt);
        if (response == "No section found.") {
            response = "";
        }
        app.company.about = response;

        prompt = MINIMUM_JOB_REQUIREMENTS_PROMPT + "\n\nJob Description:\n\n"+ app.job.description;
        response = await this.chatGpt.ask(prompt);
        if (response == "No section found.") {
            response = "";
        }
        app.job.minimumRequirements = response;

        prompt = PREFERRED_JOB_REQUIREMENTS_PROMPT + "\n\nJob Description:\n\n"+ app.job.description;
        response = await this.chatGpt.ask(prompt);
        if (response == "No section found.") {
            response = "";
        }
        app.job.preferredRequirements = response;
    }
}