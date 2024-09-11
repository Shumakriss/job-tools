from psycopg import Connection, Cursor


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
                 score: int = 0,
                 row_tuple: tuple = None
                 ):
        if row_tuple:
            (self.title,
             self.location,
             self.company,
             self.summary,
             self.description,
             self.application_url,
             self.details_url,
             self.posted_date,
             self.score) = row_tuple
        else:
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

    def as_tuple(self):
        return (self.title,
                self.location,
                self.company,
                self.summary,
                self.description,
                self.application_url,
                self.details_url,
                self.posted_date,
                self.score)


class JobCursor:
    def __init__(self, conn: Connection):
        self.conn = conn
        self.cur = None

    def __enter__(self):
        self.cur = self.conn.cursor()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.cur.close()

    def fetchall(self):
        return self.cur.fetchall()

    def create_table_job_ingest(self):
        q = (
            f"CREATE UNLOGGED TABLE IF NOT EXISTS job_ingest ("
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
        self.cur.execute(q)

    def create_table_job(self):
        q = (
            f"CREATE TABLE IF NOT EXISTS job ("
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
        self.cur.execute(q)

    def batch_insert_table_job_ingest(self, jobs: list[Job]):
        tuples = [job.as_tuple() for job in jobs]
        q = (
            f"INSERT INTO job_ingest "
            f"VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);"
        )

        self.cur.executemany(q, tuples)

    def select_job_ingest(self, size: int = 100):
        q = (
            f"SELECT * "
            f"FROM job_ingest "
            f"LIMIT %s;"
        )
        self.cur.execute(q, (size,))

    def select_job(self, size: int = 100):
        q = (
            f"SELECT * "
            f"FROM job "
            f"LIMIT %s;"
        )
        self.cur.execute(q, (size,))

    def select_job_page(self, page: int = 0, page_size: int = 50):
        q = (
            f"SELECT title, "
            f"location, "
            f"company, "
            f"summary, "
            f"description, "
            f"application_url, "
            f"details_url, "
            f"posted_date, "
            f"score "
            f"FROM (SELECT *, rank() OVER (ORDER BY details_url) AS rownum FROM JOB) "
            f"WHERE rownum BETWEEN "
            f"CAST(%(page)s AS INTEGER) * CAST(%(page_size)s AS INTEGER) "
            f"AND (((CAST(%(page)s AS INTEGER) + 1) * CAST(%(page_size)s AS INTEGER))-1);"
        )

        self.cur.execute(q, {"page": page, "page_size": page_size})

    def truncate_table_job_ingest(self):
        self.cur.execute(f"TRUNCATE TABLE job_ingest")

    def copy_table_job_ingest_to_job(self):
        query = (
            f"INSERT INTO job "
            f"SELECT * "
            f"FROM job_ingest "
            f"WHERE details_url NOT IN ("
            f"  SELECT details_url FROM job"
            f");"
        )
        self.cur.execute(query)
