# Loads data from various sites into the database

import scrape.levels_fyi as levels_fyi
from database.job import *
from database.postgres import *

SEED_QUERY = "software engineer"

if __name__ == "__main__":
    print("Scraping new jobs and writing to ingest table")

    jobs = levels_fyi.search(SEED_QUERY, soft_limit=1000)

    with ConfigurableConnection("../database/secrets.json") as conn:
        with JobCursor(conn) as cur:
            cur.create_table_job_ingest()
            cur.truncate_table_job_ingest()
            cur.batch_insert_table_job_ingest(jobs)
