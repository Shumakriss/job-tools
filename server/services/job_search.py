from flask import Request
from psycopg import Connection

from database.job import *


def handle(request: Request, conn: Connection):
    page = request.args.get("page", default=0)
    page_size = request.args.get("page_size", default=50)

    response = {"results": []}
    with JobCursor(conn) as cur:
        cur.select_job_page(page=page, page_size=page_size)

        for record in cur.fetchall():
            job = Job(row_tuple=record)
            job_json = job.serializable()
            response["results"].append(job_json)

    return response
