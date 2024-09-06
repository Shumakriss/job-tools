import json
import requests

from server.model.scan import *

URL = "https://api.jobscan.co/v4/scan"
USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"


def scan(resume: str, job_description: str) -> JobScanResponse:
    headers = {
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT
    }

    body = {
        "cv": resume,
        "jd": job_description,
        "coverletter": "",
        "conversion_id": None,
        "coverletter_conversion_id": None
    }

    x = requests.post(URL, headers=headers, json=body, stream=True)

    if x.status_code != 200:
        raise ScanFailedException("Scan failed with code" + str(x.status_code))

    content = bytearray()
    for chunk in x.iter_content():
        content += chunk

    dec = content.decode(encoding='utf-8')
    obj = json.loads(dec)
    response = JobScanResponse.model_validate(obj)

    return response
