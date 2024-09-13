# Moves data from staging area to transactional tables for web server

from database.postgres import *
from database.job import *

if __name__ == "__main__":
    print("Copy new scraped batch to main tables")

    with ConfigurableConnection("../database/secrets.json") as conn:
        with JobCursor(conn) as cur:
            cur.create_table_job()
            cur.copy_table_job_ingest_to_job()
