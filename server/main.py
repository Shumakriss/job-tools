import threading

from flask import Flask, request
from flask_cors import CORS, cross_origin

import jobscan
import levels_fyi

app = Flask(__name__)
cors = CORS(app, origins=["http://localhost:63342"])
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/job")
@cross_origin()
def job_detail():
    if "job_url" not in request.json:
        return "No way dawg"

    response = {
        "job_description": levels_fyi.job_description(request.json["job_url"])
    }

    if "resume" in request.json:
        response["scan_results"] = jobscan.scan(request.json["resume"],
                                                response["job_description"])

    return response


def scan_async(resume, jd, results):
    job_description = levels_fyi.job_description(jd["link"])
    summary = jd["summary"]
    link = job_description["applicationUrl"]
    desc = job_description["description"]

    record = {
        "summary": summary,
        "link": link,
        "score": jobscan.scan(resume, desc).matchRate.score
    }
    results.append(record)


# TODO: Paginating
@app.route("/search", methods=["POST", "OPTIONS"])
@cross_origin()
def search():
    query = request.json["query"]
    levels_results = levels_fyi.search(query)

    results = []
    threads = []
    for jd in levels_results:

        if "resume" in request.json:
            t = threading.Thread(target=scan_async, args=[request.json["resume"], jd, results])
            threads.append(t)
            t.start()
        else:
            results.append(jd)

    for t in threads:
        t.join()

    return {"results": results}


if __name__ == '__main__':
    app.run()
