from server.model.job import get_jobs


def search(request):
    response = {"results": []}
    for job in get_jobs():
        job_json = job.serializable()
        response["results"].append(job_json)
    return response


def job_detail(request):
    pass
