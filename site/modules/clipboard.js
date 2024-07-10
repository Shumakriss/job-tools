const LINKEDIN_QUERY = "(software OR data) AND (founding OR senior OR principal OR staff OR L4 OR L5) AND (engineer OR architect)";

function handleLinkedInClipboard() {
    navigator.clipboard.writeText("https://www.linkedin.com/in/christophershumaker/");
}

function handleGithubClipboard() {
    navigator.clipboard.writeText("https://github.com/Shumakriss");
}

function handleSiteClipboard() {
    navigator.clipboard.writeText("https://www.makerconsulting.llc/maker-consulting");
}

function handleLinkedInQueryClipboard() {
    let queryText = document.getElementById("linkedin-query").value;
    navigator.clipboard.writeText(queryText);
}

function initLinkedInQuery() {
    document.getElementById("linkedin-query").value = LINKEDIN_QUERY;
}