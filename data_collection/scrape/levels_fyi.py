import base64
from base64 import b64decode
import json
import requests
import zlib

from Crypto.Hash import MD5
from Crypto.Cipher import AES

from bs4 import BeautifulSoup

from database.job import *

URL = "https://www.levels.fyi/jobs"
SEARCH_URL = f"https://www.levels.fyi/jobs/title/software-engineer/location/united-states?from=subnav&postedAfterTimeType=days&postedAfterValue=1&standardLevels=mid_staff%2Cprincipal&workArrangements=remote&searchText="


def job_description(job: Job):
    details = _scrape_job_description(_fetch_job_description(job.details_url))
    job.description = details["description"]
    job.application_url = details["applicationUrl"]
    return job


def search(query: str, soft_limit: int = 100, hard_limit: int = None, skip_description: bool = False):
    links = set()
    offset = 0
    offset_increment = 5
    page = ""
    last_page = ""

    while True:
        last_page = page
        page = _fetch_search_results(query, offset)

        if page == last_page:
            break

        page_results = _scrape_search_results(page)

        link_count = len(links)
        links.update(page_results)

        if link_count == len(links) or len(page_results) < offset_increment or len(links) >= soft_limit:
            break

        print(f"Retrieved {len(links)} job posts so far")
        offset += offset_increment

    if hard_limit:
        links = links[0:hard_limit]

    partial_jobs = [Job(details_url=link) for link in links]

    if skip_description:
        return partial_jobs

    jobs = []
    for partial_job in partial_jobs:
        try:
            scraped_job = _scrape_job_description(_fetch_job_description(partial_job.details_url))
            scraped_job.details_url = partial_job.details_url
        except Exception:
            continue

        jobs.append(scraped_job)

    return jobs


def _fetch_search_results(query: str, offset: int = 0):
    # query = urllib.parse.quote(query, safe='')
    # url = f"{SEARCH_URL}{query}&offset={offset}"
    # url = f"{URL}?offset={offset}"
    # print(f"Retrieving jobs from {url}")
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Cache-Control": "no-cache, max-age=0"}

    # response = requests.get(URL, params={"offset": 15}, headers=headers)
    response = requests.get("https://www.levels.fyi/jobs", params={"offset": 100})
    return response.content.decode("utf-8")


def _fetch_job_description(url: str):
    response = requests.get(url)
    return response.content.decode("utf-8")


def _scrape_search_results(html: str) -> set[str]:
    links = set()
    soup = BeautifulSoup(html, 'html.parser')

    a_tags = soup.find_all("a")

    for a in a_tags:
        if "href" in a.attrs:
            if a.attrs["href"].startswith(URL + '?jobId='):
                link = a.attrs["href"].replace("#", "")
                links.add(link)
            elif a.attrs["href"].startswith("/jobs?jobId="):
                link = "https://www.levels.fyi" + a.attrs["href"]
                link = link.replace("#", "")
                links.add(link)

    return links


def get_text_recursive(element):
    child_text = ""
    for child in element.contents:
        child_text += get_text_recursive(child)

    return element.get_text() + child_text


def _scrape_job_description(html: str):
    soup = BeautifulSoup(html, 'html.parser')

    try:
        script = soup.find("script", {"id": "__NEXT_DATA__"})

        json_obj = json.loads(script.get_text())
        jd = json_obj["props"]["pageProps"]["initialJobDetails"]

        return Job(
            title=jd["title"],
            location=",".join(jd["locations"]),
            company=jd["companyInfo"]["name"],
            description=jd["description"],
            application_url=jd["applicationUrl"],
            posted_date=jd["postingDate"]
        )
    except Exception:
        raise Exception("Failed to scrape")


def _decrypt_api_response(payload: str):
    # From https://stackoverflow.com/questions/76496884/how-levels-fyi-is-encoding-the-api-response

    # Craft our secret
    secret_bytes = b"levelstothemoon!!"
    t = 16
    h = MD5.new()
    h.update(secret_bytes)
    decoded_secret = base64.b64encode(h.digest()).decode()
    secret_substr = decoded_secret[0:16]
    utf8_key = secret_substr.encode("utf-8")

    ciphertext = b64decode(payload)

    # Decrypt the payload with the key
    cipher = AES.new(utf8_key, AES.MODE_ECB)
    message = cipher.decrypt(ciphertext)

    # Decompress with zlib
    inflated = zlib.decompress(message)
    obj = json.loads(inflated.decode("utf-8"))

    # Convert to internal job class
    jobs = []
    for company in obj["results"]:
        for job in company["jobs"]:
            j = Job()
            j.application_url = job["applicationUrl"]
            j.details_url = URL + f"?jobId={job["id"]}"
            jobs.append(j)

    return jobs
