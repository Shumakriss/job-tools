import json

import psycopg


def get_credentials(creds_file: str):
    with open(creds_file, "r") as file:
        secrets = json.loads(file.read())

    return secrets


def get_pg_connection_string(secrets: dict):
    return (
        f"host={secrets["host"]} "
        f"port={secrets["port"]} "
        f"dbname={secrets["dbname"]} "
        f"user={secrets["user"]} "
        f"password={secrets["password"]} "
    )


class ConfigurableConnection:
    def __init__(self, secrets_file: str = "secrets.json"):
        self.secrets_file = secrets_file
        self.connect_string = get_pg_connection_string(get_credentials(secrets_file))
        self.conn = None

    def __enter__(self):
        self.conn = psycopg.connect(self.connect_string)
        return self.conn

    def __exit__(self, exc_type, exc_value, traceback):
        self.conn.commit()
        self.conn.close()


class ConnectedCursor:
    def __init__(self, secrets_file: str = "secrets.json"):
        self.secrets_file = secrets_file
        self.connect_string = get_pg_connection_string(get_credentials(secrets_file))
        self.conn = None
        self.cur = None

    def __enter__(self):
        self.conn = psycopg.connect(self.connect_string)
        self.cur = self.conn.cursor()
        return self.cur

    def __exit__(self, exc_type, exc_value, traceback):
        self.cur.close()
        self.conn.commit()
        self.conn.close()
