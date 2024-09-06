from flask import Flask, request
from flask_cors import CORS, cross_origin

from server.services import handlers

app = Flask(__name__)
cors = CORS(app, origins=["http://localhost:63342"])
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/job")
@cross_origin()
def job_detail():
    return handlers.job_detail(request)


@app.route("/search", methods=["POST", "OPTIONS"])
@cross_origin()
def search():
    return handlers.search(request)
