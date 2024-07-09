# job-tools

This repo holds scripts and code used to make the job application process easier.

## How It Works

Download the repo and create credential file:
```bash
git clone git@github.com:Shumakriss/job-tools.git
cd job-tools
touch site/modules/gapi-credentials.js
open site/modules/gapi-credentials.js
```

Add your own credentials
```js
// Provided by Google API Console
const CLIENT_ID = '<Your client id>';
const API_KEY = '<Your API Key>';
```

View the page:
`open site/modules.index.html`

## Goals

Here are some common tasks to automate within the job application workflow:

* Search
  * Aggregate job postings
  * Search, filter, and sort job postings

* Assess
  * compensation from job req
  * Glassdoor stats
  * levels.fyi numbers

* Tailoring
  * Basic tailoring steps
    * Clone resume and cover letter with job-specific titles
    * Replace job title in resume
    * Populate today's date in cover letter
    * Populate hiring manager name or default to Hiring Manager
    * replace job title throughout cover letter
    * populate company name throughout cover letter
    * Populate favorite company values
    * populate main experience area for team
    * populate company address
    * Download PDF copies
  * Advanced
    * Create scan on jobscan.co
    * Fill out the job title
    * Automatically rescan when document changes online

Apply
* Fill out the web form
* Upload docs
* Log it in Google Sheets


Other helpful automations:
* Look up headquarters address (reliable?)
* Slice requirements, nice-to-haves, and duties from job description
  * Get jobscan results from each