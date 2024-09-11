from flask import Flask, request
from flask_cors import CORS, cross_origin
from psycopg_pool import ConnectionPool

from server.services import job_search, job_detail
from database.postgres import get_pg_connection_string, get_credentials

SECRETS_FILE = f"../database/secrets.json"  # Running from ./server/
CONNINFO = get_pg_connection_string(get_credentials(SECRETS_FILE))
POOL = ConnectionPool(conninfo=CONNINFO)

app = Flask(__name__)
cors = CORS(app, origins=["http://localhost:63342"])
app.config['CORS_HEADERS'] = 'Content-Type'


# @app.teardown_appcontext
# def teardown_pool(exception):
#     if POOL is not None:
#         POOL.close()


@app.route("/job")
@cross_origin()
def job_detail():
    with POOL.connection() as conn:
        return job_detail.handle(request, conn)


@app.route("/search", methods=["POST", "OPTIONS"])
@cross_origin()
def search():
    with POOL.connection() as conn:
        return job_search.handle(request, conn)
