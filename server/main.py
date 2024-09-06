from server.services.app import app
from server.scrape import levels_fyi
from server.model.job import setup_job_db, batch_insert_job
from server.model.company import setup_company_db

SEED_QUERY = "software engineer"

if __name__ == '__main__':
    setup_job_db()
    setup_company_db()

    jobs = levels_fyi.search(SEED_QUERY)

    for job in jobs:
        levels_fyi.job_description(job)

    batch_insert_job(jobs)

    app.run(port=3000)
