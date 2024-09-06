import json

import duckdb
import pyarrow as pa



class Job:
    title: str = ""
    locations: str = ""
    company: str = ""
    summary: str = ""
    description: str = ""
    application_url: str = ""
    details_url: str = ""
    posted_date: str = ""
    score: int = 0

    def __init__(self,
                 title: str = "",
                 location: str = "",
                 company: str = "",
                 summary: str = "",
                 description: str = "",
                 application_url: str = "",
                 details_url: str = "",
                 posted_date: str = "",
                 score: int = 0
                 ):
        self.title = title
        self.location = location
        self.company = company
        self.summary = summary
        self.description = description
        self.application_url = application_url
        self.details_url = details_url
        self.posted_date = posted_date
        self.score = score

    def serializable(self):
        return {
            "title": self.title,
            "location": self.location,
            "company": self.company,
            "summary": self.summary,
            "description": self.description,
            "application_url": self.application_url,
            "details_url": self.details_url,
            "posted_date": self.posted_date,
            "score": self.score
        }


def setup_job_db():
    sql = (
        f"CREATE TABLE job ("
        f"title VARCHAR, "
        f"location VARCHAR, "
        f"company VARCHAR, "
        f"summary VARCHAR, "
        f"description VARCHAR, "
        f"application_url VARCHAR, "
        f"details_url VARCHAR, "
        f"posted_date VARCHAR, "
        f"score VARCHAR"
        f");"
    )
    duckdb.sql(sql)


def get_jobs(quantity: int = 10):
    sql = (
        f"SELECT * "
        f"FROM job "
        f"LIMIT {quantity};"
    )
    result = duckdb.sql(sql)
    jobs = []
    for job in result.fetchall():
        (title,
         location,
         company,
         summary,
         description,
         application_url,
         detail_url,
         posted_date,
         score) = job

        jobs.append(Job(title,
                        location,
                        company,
                        summary,
                        description,
                        application_url,
                        detail_url,
                        posted_date,
                        score))
    return jobs


def batch_insert_job(jobs: list[Job]):
    jobs_arrow = pa.Table.from_pylist([job.serializable() for job in jobs])
    duckdb.sql("INSERT INTO job SELECT * FROM jobs_arrow")
