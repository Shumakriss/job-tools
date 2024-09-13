from psycopg import Connection, Cursor


class Resume:
    name: str
    text: str

    def __init__(self, name: str, text: str):
        self.name = name
        self.text = text

    def serializable(self):
        return {
            "name": self.name,
            "text": self.text
        }

    def as_tuple(self) -> tuple:
        return (self.name,
                self.text)


class ResumeCursor:
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

    def create_table_resume(self):
        q = (
            f"CREATE TABLE IF NOT EXISTS resume ("
            f"title VARCHAR"
            f");"
        )
        self.cur.execute(q)

    def insert_resume(self, resume: Resume):
        q = (
            f"INSERT INTO resume "
            f"VALUES (%s);"
        )

        self.cur.execute(q, resume.as_tuple())

    def select_resume(self, size: int = 100):
        q = (
            f"SELECT * "
            f"FROM resume "
            f"LIMIT %s;"
        )
        self.cur.execute(q, (size,))
