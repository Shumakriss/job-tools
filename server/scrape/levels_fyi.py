import json
import requests
import urllib

from bs4 import BeautifulSoup

from server.model.job import *

URL = "https://www.levels.fyi/jobs"
SEARCH_URL = f"https://www.levels.fyi/jobs/location/united-states?standardLevels=mid_staff%2Cprincipal&workArrangements=remote&searchText="
# TODO: Check separator in levels
# TODO: Format these as query parameters with requests code
DEFAULT_FILTERS = {
    "standardLevels": "mid_staff,principal",
    "workArrangements": "remote"
}


def job_description(job: Job):
    details = _scrape_job_description(_fetch_job_description(job.details_url))
    job.description = details["description"]
    job.application_url = details["applicationUrl"]
    return job


def search(query: str, result_limit: int = 5):
    results = []
    page = _fetch_search_results(query)
    page_results = _scrape_search_results(page)
    results += page_results  # TODO: Remove duplicates?
    offset = len(page_results)  # TODO: Set to N companies in results

    while len(page_results) > 0 and len(results) < result_limit:
        page = _fetch_search_results(query, offset)
        page_results = _scrape_search_results(page)
        results += page_results
        offset += len(page_results)

    return results


def _fetch_search_results(query: str, offset: int = 0):
    query = urllib.parse.quote(query, safe='')
    if offset > 0:
        url = f"{SEARCH_URL}{query}&offset={offset}"
    else:
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
                if className.startswith("company-jobs-preview-card_container"):
                    c = div.findNext("h2").get_text()

                    for d in div.find_all_next("div"):
                        if "class" in d.attrs:
                            for clazz in d['class']:
                                if clazz.startswith("company-jobs-preview-card_companyJobContainer"):
                                    summary = ""
                                    for child in d.children:
                                        summary += child.get_text() + "\n"

                                    job = Job(title=summary,
                                              company=c,
                                              details_url=URL + d.parent.attrs["href"])
                                    results.append(job)

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
