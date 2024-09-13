import json
import requests

from database.scan import *
from data_collection.scrape.helpers import random_request

URL = "https://api.jobscan.co/v4/scan"
USER_AGENT = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
              "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")


def scan(resume: str, job_description: str) -> JobScanResponse:
    headers = {"Content-Type": "application/json"}

    body = {
        "cv": resume,
        "jd": job_description,
        "coverletter": "",
        "conversion_id": None,
        "coverletter_conversion_id": None
    }

    x = random_request("POST", URL, headers=headers, json=body, stream=True)

    if x.status_code != 200:
        raise ScanFailedException("Scan failed with code" + str(x.status_code))

    content = bytearray()
    for chunk in x.iter_content():
        content += chunk

    dec = content.decode(encoding='utf-8')
    obj = json.loads(dec)
    response = JobScanResponse.model_validate(obj)

    return response
