import json
import requests

with open("examples/jobscan-credentials.json", "r") as file:
    secrets = json.loads(file.read())
    
cookie = secrets['cookie']
xsrf_token = secrets['xsrf_token']

url = 'https://api.jobscan.co/v4/scan'
myobj = {
    "cv": "this is my cv text aws javascript",
    "jd": "this is my jd text aws javascript",
    "coverletter": "",
    "conversion_id": None,
    "coverletter_conversion_id": None}

headers = {
    # "authority": "api.jobscan.co",
    # "method": "POST",
    # "path": "/v4/scan",
    # "scheme": "https",
    "Accept": "application/json, text/plain, */*",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "en-US,en;q=0.9,es-US;q=0.8,es;q=0.7",
    "Accepts": "application/json",
    "Content-Length": "96",
    "Content-Type": "application/json",
    "Cookie": cookie,
    "Origin": "https://app.jobscan.co",
    "Priority": "u=1, i",
    "Referer": "https://app.jobscan.co/",
    "Sec-Ch-Ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": "macOS",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "X-Spa-Version": "2024-07-03-a-S",
    "X-Xsrf-Token": xsrf_token
}

content = bytearray()
x = requests.post(url, headers=headers, json=myobj, stream=True)
for chunk in x.iter_content():
    content += chunk

print(f"API Response: {x.status_code}")
# print(x.headers)
# print(x.encoding)
# print(content)

# import brotli
# brotli.decompress(content)
import json

response_object = json.loads(content.decode(encoding='latin-1'))

from datetime import date
from typing import Tuple
from pydantic_core import from_json
from pydantic import BaseModel, ConfigDict, ValidationError


class MatchRate(BaseModel):
    score: int
    rawScore: int


class Response(BaseModel):
    model_config = ConfigDict(strict=True)

    findings: list
    matchRate: MatchRate
    skills: dict
    keywords: list
    highValueSkills: list
    metadata: dict


# response = Response.model_validate(json.loads(content.decode(encoding='latin-1')))

# print(f"Job Scan Score: {response.matchRate.score}")
import pprint
pprint.pprint(json.loads(content.decode(encoding='latin-1')))