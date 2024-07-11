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

<h2>Score Determination</h2>
<p>This page aims to address two limitations with Jobscan.co.
    First, as we tailor our resume, we must copy/paste repeatedly.
    Second, we do not know what level of information will be used by ATS scans
    (i.e. only the minimum or full job description).
    Thus, more copy/pasting.
</p>
<label>Our Solution:</label>
<ol>
    <li>Automate retrieval of tailored resume</li>
    <li>Copy/paste job description once</li>
    <li>Scan at multiple levels of information</li>
</ol>
<p>Individual section scores are not useful alone, they must include all previous higher priority information.
    There are four major levels of info: minimum requirements, preferred requirements, job duties, and other (typically company information).</p>
<label>The priority ranking is as follows:</label>
<ol>
    <li>Minimum Requirements</li>
    <li>Preferred Requirements</li>
    <li>Job Duties</li>
    <li>Company Information</li>
</ol>
<p>If a section is not provided or the corresponding checkbox is not checked, it will not be included in any scores.</p>
