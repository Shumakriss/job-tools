import base64
from base64 import b64decode
import json

import zlib

from bs4 import BeautifulSoup
from Crypto.Hash import MD5
from Crypto.Cipher import AES

from database.job import *
from data_collection.scrape.helpers import random_request

URL = "https://www.levels.fyi/jobs"
API_URL = "https://api.levels.fyi/v1/job/search"


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
        page = _fetch_search_results(query, offset)

        partial_jobs.update(page)

        if len(page) == 0 or len(partial_jobs) >= soft_limit:
            break

        print(f"Retrieved {len(partial_jobs)} job posts so far")
        offset += offset_increment

    if hard_limit:
        partial_jobs = partial_jobs[0:hard_limit]

    if skip_description:
        print(f"Collected links for {len(partial_jobs)} jobs")
        return partial_jobs

    print(f"Fetching job details for {len(partial_jobs)} jobs")

    jobs = []
    for i, partial_job in enumerate(partial_jobs):
        try:
            print(f"Fetching details for {partial_job.details_url} ({i+1} / {len(partial_jobs)})")
            scraped_job = _scrape_job_description(_fetch_job_description(partial_job.details_url))
            scraped_job.details_url = partial_job.details_url
        except Exception:
            continue

        jobs.append(scraped_job)

    return jobs


def _fetch_search_results(query: str, offset: int = 0) -> list[Job]:
    params = {
        "limitPerCompany": 3,
        "limit": 5,
        "sortBy": "relevance",
        "searchText": query,
        "offset": offset
    }

    response = random_request("GET", API_URL, params=params)
    decoded = response.content.decode("utf-8")
    payload = json.loads(decoded)["payload"]
    jobs = _decrypt_api_response(payload)
    return jobs


def _fetch_job_description(url: str):
    response = random_request("GET", url=url)
    return response.content.decode("utf-8")


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
