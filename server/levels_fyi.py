import urllib

from bs4 import BeautifulSoup
import requests

URL = "https://www.levels.fyi/jobs"
SEARCH_URL = f"https://www.levels.fyi/jobs/location/united-states?standardLevels=mid_staff%2Cprincipal&workArrangements=remote&searchText="
# TODO: Check separator in levels
# TODO: Format these as query parameters with requests code
DEFAULT_FILTERS = {
    "standardLevels": "mid_staff,principal",
    "workArrangements": "remote"
}


def job_description(job_url):
    return _scrape_job_description(_fetch_job_description(job_url))


def search(query: str):
    return _scrape_search_results(_fetch_search_results(query))


def _fetch_search_results(query: str):
    query = urllib.parse.quote(query, safe='')
    url = f"{SEARCH_URL}{query}"
    response = requests.get(url)
    return response.content.decode("utf-8")


def _fetch_job_description(url: str):
    response = requests.get(url)
    return response.content.decode("utf-8")


def _scrape_search_results(html: str):
    results = []
    soup = BeautifulSoup(html, 'html.parser')

    divs = soup.find_all("div")
    for div in divs:
        if "class" in div.attrs:
            for className in div['class']:
                if className.startswith("company-jobs-preview-card_companyJobsContainer"):
                    results.append(div.get_text())

    return results


def _scrape_job_description(html: str):
    soup = BeautifulSoup(html, 'html.parser')

    sections = soup.find_all("section")
    for section in sections:
        if "class" in section.attrs:
            for className in section['class']:
                if className.startswith("job-details-about_aboutContainer"):
                    return section.get_text()

    raise Exception("Failed to scrape job description")
