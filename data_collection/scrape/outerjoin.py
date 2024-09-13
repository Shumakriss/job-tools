import json

from bs4 import BeautifulSoup

from database.job import *
from data_collection.scrape.helpers import random_request, get_text_recursive

URL = "https://outerjoin.us"


def job_description(job_part: Job):
    job_details = _scrape_job_description(_fetch_job_description(job_part.details_url))
    job_part.description = job_details.description
    job_part.application_url = job_details.application_url
    return job_part


def search(query: str, soft_limit: int = 100, hard_limit: int = None, skip_description: bool = False):
    partial_jobs = set()
    offset = 0
    offset_increment = 5

    while True:
        page = _scrape_search_results(_fetch_search_results(query, offset))

        partial_jobs.update(page)

        if len(page) == 0 or len(partial_jobs) >= soft_limit:
            break

        print(f"Retrieved {len(partial_jobs)} job posts so far")
        offset += offset_increment

    if hard_limit and hard_limit < len(partial_jobs):
        partial_jobs = set(list(partial_jobs)[0:hard_limit])

    if skip_description:
        print(f"Collected links for {len(partial_jobs)} jobs")
        return partial_jobs

    print(f"Fetching job details for {len(partial_jobs)} jobs")

    jobs = []
    for i, partial_job in enumerate(partial_jobs):
        try:
            print(f"Fetching details for {partial_job.details_url} ({i + 1} / {len(partial_jobs)})")
            scraped_job = _scrape_job_description(_fetch_job_description(partial_job.details_url))

            partial_job.description = scraped_job.description
            partial_job.application_url = scraped_job.application_url

            jobs.append(partial_job)
        except Exception:
            continue

    return jobs


def _fetch_search_results(query: str, page: int = 0) -> str:
    params = {"q": query}

    if page > 0:
        params["page"] = page

    response = random_request("GET", URL, params=params)
    decoded = response.content.decode("utf-8")
    return decoded


def _scrape_search_results(html: str) -> list[Job]:
    soup = BeautifulSoup(html, 'html.parser')

    jobs = []
    try:
        ul = soup.find("ul", attrs={"class": "jobs"})
        lis = ul.find_all("li")

        for li in lis:
            job = Job()

            div = li.find("div", attrs={"class": "w-full ml-4"})

            a = div.find("a")
            job.details_url = URL + a["href"]
            job.title = a.getText()

            a = div.find("div").find("div").find("a")
            job.company = a.getText()

            jobs.append(job)
        return jobs
    except Exception:
        raise Exception("Failed to scrape")


def _fetch_job_description(url: str):
    response = random_request("GET", url=url)
    return response.content.decode("utf-8")


def _scrape_job_description(html: str):
    soup = BeautifulSoup(html, 'html.parser')

    try:
        div = soup.find("div", attrs={"class": "job-description"})
        jd = div.get_text(separator="\n", strip=True)

        a = soup.find("a", attrs={"class": "btn btn-tertiary px-16 py-4 w-full lg:w-auto"})

        app_url = URL + a["href"]
        redirect = random_request("GET", url=app_url, allow_redirects=False)

        return Job(description=jd, application_url=redirect.next.url)
    except Exception:
        raise Exception("Failed to scrape")
