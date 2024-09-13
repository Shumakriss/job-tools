from random import randrange
import requests
import time

from bs4 import PageElement

from fake_useragent import UserAgent


def get_text_recursive(element):
    child_text = ""
    for child in element.contents:
        if isinstance(child, PageElement):
            child_text += get_text_recursive(child)

    return element.get_text() + child_text


def random_request(method: str,
                   url: str,
                   params: dict = None,
                   headers: dict = None,
                   random_user_agent: bool = True,
                   random_delay: bool = True,
                   delay_min_millis: int = 1000,
                   delay_max_millis: int = 7000,
                   json=None,
                   stream=False,
                   allow_redirects=True):
    ua = UserAgent()

    if not headers:
        headers = {}

    if random_user_agent:
        agent = ua.random
        print(f"Making request with agent: {agent}")
        headers["User-Agent"] = ua.random

    if not params:
        params = {}

    if random_delay:
        wait_millis = randrange(delay_min_millis, delay_max_millis)
        print(f"Waiting {wait_millis} milliseconds")
        time.sleep(wait_millis / 1000)

    if method == "GET":
        return requests.get(url, params=params, headers=headers, json=json, stream=stream,
                            allow_redirects=allow_redirects)
    if method == "POST":
        return requests.post(url, params=params, headers=headers, json=json, stream=stream,
                             allow_redirects=allow_redirects)
