# Loads data from various sites into the database
from threading import Thread
from typing import Callable

import scrape.levels_fyi as levels_fyi
import scrape.outerjoin as outerjoin
from database.job import *
from database.postgres import *

SEED_QUERY = "software engineer"
LIMIT = 100


def thread_wrapper(func: Callable, results: list[Job], **keyword_args):
    results += func(**keyword_args)


if __name__ == "__main__":
    print("Scraping new jobs and writing to ingest table")
    jobs = []

    kwargs = {
        "query": SEED_QUERY,
        "soft_limit": LIMIT
    }

    threads = [
        Thread(target=thread_wrapper, args=[levels_fyi.search, jobs], kwargs=kwargs),
        Thread(target=thread_wrapper, args=[outerjoin.search, jobs], kwargs=kwargs)
    ]

    for t in threads:
        t.start()

    for t in threads:
        t.join()

    with ConfigurableConnection("../database/secrets.json") as conn:
        with JobCursor(conn) as cur:
            cur.create_table_job_ingest()
            cur.truncate_table_job_ingest()
            cur.batch_insert_table_job_ingest(jobs)
