import json
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
                if className.startswith("company-jobs-preview-card_companyJobContainer"):
                    summary = ""
                    for child in div.children:
                        summary += child.get_text() + "\n"
                    jd = {
                        "summary": summary,
                        "link": URL + div.parent.attrs["href"]
                    }
                    results.append(jd)

    return results


def get_text_recursive(element):
    child_text = ""
    for child in element.contents:
        child_text += get_text_recursive(child)

    return element.get_text() + child_text


def _scrape_job_description(html: str):
    soup = BeautifulSoup(html, 'html.parser')

    script = soup.find("script", {"id": "__NEXT_DATA__"})
    json_obj = json.loads(script.get_text())
    jd = json_obj["props"]["pageProps"]["initialJobDetails"]

    return {
        "title": jd["title"],
        "locations": jd["locations"],
        "company": jd["companyInfo"]["name"],
        "companyDescription": jd["companyInfo"]["description"],
        "employeeCount": jd["companyInfo"]["empCount"],
        "description": jd["description"],
        "applicationUrl": jd["applicationUrl"],
        "postingDate": jd["postingDate"]
    }

    # raise Exception("Failed to scrape job description")
