import requests

COOKIE = "ajs_anonymous_id=fdfa3a40-d6f2-43ab-a86b-6664abc2b52e; _gcl_au=1.1.1727714196.1717691086; rl_anonymous_id=RS_ENC_v3_IjhiZTE2YzkxLWMwZmEtNGUzNC04NWZjLWYzZGQ3OWFlNGI3MiI%3D; rl_page_init_referrer=RS_ENC_v3_IiRkaXJlY3Qi; _tt_enable_cookie=1; _ttp=v9llazNBWqnLzuUKl6sxIXqdjpo; hubspotutk=dad739f52cc7edc8aaa38dc35e0669e3; ajs_user_id=4032590; rl_user_id=RS_ENC_v3_IjQwMzI1OTAi; rl_trait=RS_ENC_v3_eyJpZCI6NDAzMjU5MCwiZW1haWwiOiJjaHJpcy5zaHVtYWtlckBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJDaHJpc3RvcGhlciIsImxhc3ROYW1lIjoiU2h1bWFrZXIiLCJwbGFuIjoiZG9tYWluIiwiZG9tYWluIjoia2V5c3RvbmVwYXJ0bmVycy5jb20iLCJjcmVhdGVkQXQiOiIyMDI0LTA0LTA5VDE1OjI0OjIxLjAwMFoifQ%3D%3D; saml_tenant_id=eyJpdiI6IkdoY2JDMW4xZTA3TURvMFpTcjlXd1E9PSIsInZhbHVlIjoiNHRjS3BmQkxvUDNJelpYTUxCUUhCNlZublg3Ri8vYWIyZHZxcTB4MFY2OWIzc08zTXFZbk9oQzB3SnZNbXJNKyIsIm1hYyI6IjFhMjA0NGQyYjcwMTU0ZmRmM2Q2MDkwM2YxYTM1OGU3ZmM1ZGJlYTNlNTAwM2ExN2ViZjUxM2UzN2E3YTFhZTMiLCJ0YWciOiIifQ%3D%3D; saml_session_id=eyJpdiI6IkFLOWVjRlhmMnBwQWtIbGF3clBjT0E9PSIsInZhbHVlIjoidkY0KzFYdmJXcURtWjZOQlhxNWpsUzEvaDhKVVpoUUU2TlpJd2cvWnkzTU8wZkxTbkszSTY0QU1TcmxaelVnLyIsIm1hYyI6ImUyOGEzNzEzNzFlMjI2ZDJlNGI4ODY1ZGE0NjEwODEwMGFiOTdjZGVjOGI3MzIxZTk2ZGVlNjE2OGU5ODY1MjMiLCJ0YWciOiIifQ%3D%3D; saml_name_id=eyJpdiI6ImRJdXhyenZYenVRamJ4R0Z2WGUyZ2c9PSIsInZhbHVlIjoiSG5sdE5QdXNHMVFIL3lzOXoxZHRVVjQvcU1JTzFnT3F0MWR3N1ljalpWUGUxTytmcDRSeUNrcERIUXhTL0YwbFlselRML2s2S3R4bWhYZUFHc0F5MTAvYnU4ZG9TWmpwdTcrOGI1RGwrTEJlbUpWN295aHNxTXpEWUVjbHk1NjIiLCJtYWMiOiI5MTc5YzllNTRhZGI2MGU0MWI1ZjIyZWQwNDg3ZjAwMTMyNzQ4ZjNkNTBhZmU0YmRiZTEwNTRjZWRhNDViMTJkIiwidGFnIjoiIn0%3D; remember_web_3dc7a913ef5fd4b890ecabe3487085573e16cf82=eyJpdiI6IkxvU04rdTlvTTJnYVZScHlzOTU5Wnc9PSIsInZhbHVlIjoiOGY5RytuNHdHSWtUVDU1ZzV3ZVVVK2pMRGVRZWYzVnUzKyt3d0NMWUpoNFVFMkZ4K3BhUXFNZWNJR2Q3Qzd6Y0lWSVpCYXV2MmxVWDhvY1l5Z2pCYmVwRUtRUUhOV0NBeEpnck40aGpvTS95SWVTMHZwVWgrT0JtQnBlRDFydmdEUkFIU2NsenY3TXdiWW9EZDg0WS9TcmxHMkFDU2w1QzIrRE5ONEpiYzBNZ0FpbTI3WHN6SWNRK2xQbmlBek1rU3kwY0YyT2s1cnNUenEwTGppdVBwaW1DS25nbVpLYk80QWZ0VzFOTnJvTT0iLCJtYWMiOiI3NGUxMzY4OGI3MzVkNTM1MzY5OGZjN2UzZDU0MjA2OTVjOTgyZDEwN2EyNjM0N2YyMTZhMzM0NmFiMzEzMzU4IiwidGFnIjoiIn0%3D; _gid=GA1.2.1546017697.1720017649; __hssrc=1; _ce.irv=returning; cebs=1; _clck=2qs5h5%7C2%7Cfn5%7C0%7C1618; _ce.clock_data=40%2C74.104.157.223%2C1%2C10f9287deaf609ee36fb37783f2b89c0%2CChrome%2CUS; mp_8372d7d978a2c95c7c831351ed0025f5_mixpanel=%7B%22distinct_id%22%3A%20%22%24device%3A19079a8c2582ed-04a088e2a33668-19525637-384000-19079a8c2582ed%22%2C%22%24device_id%22%3A%20%2219079a8c2582ed-04a088e2a33668-19525637-384000-19079a8c2582ed%22%2C%22%24search_engine%22%3A%20%22google%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.google.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.google.com%22%2C%22__mps%22%3A%20%7B%7D%2C%22__mpso%22%3A%20%7B%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.google.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.google.com%22%7D%2C%22__mpus%22%3A%20%7B%7D%2C%22__mpa%22%3A%20%7B%7D%2C%22__mpu%22%3A%20%7B%7D%2C%22__mpr%22%3A%20%5B%5D%2C%22__mpap%22%3A%20%5B%5D%7D; __hstc=122684180.dad739f52cc7edc8aaa38dc35e0669e3.1717691087137.1720022729689.1720028022307.15; _ga_0SQJM6BJPW=GS1.1.1720028021.14.0.1720028026.55.0.0; _ga_0LLQRF33CN=GS1.1.1720028021.14.0.1720028026.0.0.0; _ga_CT69ZFD9NF=GS1.1.1720028021.14.0.1720028026.0.0.0; _uetsid=3d55aca0394a11efa47f23126dc193a8; _uetvid=49e96480242111efbab9594993fd1236; _ga=GA1.2.1085078431.1717691086; cebsp_=16; __hssc=122684180.2.1720028022307; _clsk=38n7x7%7C1720028035129%7C2%7C1%7Co.clarity.ms%2Fcollect; rl_session=RS_ENC_v3_eyJpZCI6MTcyMDAyODAzNDkyNCwiZXhwaXJlc0F0IjoxNzIwMDI5ODM2MTYzLCJ0aW1lb3V0IjoxODAwMDAwLCJzZXNzaW9uU3RhcnQiOmZhbHNlLCJhdXRvVHJhY2siOnRydWV9; XSRF-TOKEN=eyJpdiI6InZQNUxKUXF5MDRVczQ2cUUxeWpOWkE9PSIsInZhbHVlIjoiK1NnR0J6ajdIRUZLcVdCUDRmem9oT2hmK1R0OE5TRUF4cUlnZzIzT2g1dnhtUjBXVVhnTG4rQTlxQm9EeTdpcmszZjV2d1ZrSjg0TitwRUJ0UXMwdzB3QVJmMjB3dnI5S1NCUzNnT0tTdEhGaDVFbW9DbGc5RTgvdVlSV1gxenUiLCJtYWMiOiJiMmJkMDYzZjc1OGE0MGQzNzkxYmJiNDkwMzA0NGVhZWQyZjE3NWQzNWQxZDgwZTEyMGM4ZDNjZGY3ODhhMWE2IiwidGFnIjoiIn0%3D; jobscan_session=eyJpdiI6IlBqV0ZMZ1BPdVIwN3JLMk5GOGdXREE9PSIsInZhbHVlIjoiM2dyRmkzVlYrQmFiSFhFbHp2Z2dvV21OR0JvQVQrT0gwU1FITUFtMjl4LzJrQ2ZmNlRCTmt1bC9QQW9MREJMRmtuQ2N6Nkwyc3dzelJrTkJ3d1JWWmN2cThxKzRGS1ZWNmdicmYwSWlNeUlkTCt6eXp6b2xub3kxVElQLzd1dEYiLCJtYWMiOiJjOTI3NzhhYjFkOTRmZWRjZDJmYzM5NDJhYzFmNGFjMjNjZGM3YmJjNWYyMmExODdhNzM4OGE2N2UxYjk2NzFhIiwidGFnIjoiIn0%3D; _ce.s=v~3ee343b804577451d40f18c5e909d131bde9c209~lcw~1720028316863~lva~1720017649167~vpv~10~v11ls~e60dc070-3253-11ef-94c0-d7533378b441~v11.fhb~1719930399381~v11.lhb~1719931635253~v11.cs~366246~v11.s~643aad40-3962-11ef-a6bd-d9580adc49ff~v11.sla~1720028316867~gtrk.la~ly64g6uc~lcw~1720028316867"
XSRF_TOKEN = "eyJpdiI6InZQNUxKUXF5MDRVczQ2cUUxeWpOWkE9PSIsInZhbHVlIjoiK1NnR0J6ajdIRUZLcVdCUDRmem9oT2hmK1R0OE5TRUF4cUlnZzIzT2g1dnhtUjBXVVhnTG4rQTlxQm9EeTdpcmszZjV2d1ZrSjg0TitwRUJ0UXMwdzB3QVJmMjB3dnI5S1NCUzNnT0tTdEhGaDVFbW9DbGc5RTgvdVlSV1gxenUiLCJtYWMiOiJiMmJkMDYzZjc1OGE0MGQzNzkxYmJiNDkwMzA0NGVhZWQyZjE3NWQzNWQxZDgwZTEyMGM4ZDNjZGY3ODhhMWE2IiwidGFnIjoiIn0="

url = 'https://api.jobscan.co/v4/scan'
myobj = {
    "cv": "resume",
    "jd": "jd",
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
    "Cookie": COOKIE,
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
    "X-Xsrf-Token": XSRF_TOKEN
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


response = Response.model_validate(json.loads(content.decode(encoding='latin-1')))

print(f"Job Scan Score: {response.matchRate.score}")
