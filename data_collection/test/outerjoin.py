import unittest

from data_collection.scrape import outerjoin


class TestLevelsFyi(unittest.TestCase):

    def test_scrape_search(self):
        with open("../../examples/outerjoin_search.html", "r") as file:
            self.html = file.read()
        output = outerjoin._scrape_search_results(self.html)

        found_links = []
        for job in output:
            if job.details_url in found_links:
                raise Exception("Duplicate job scraped")
            else:
                found_links.append(job.details_url)

        if len(output) == 50:
            raise Exception("Empty output")

    def test_scrape_jd(self):
        with open("../../examples/outerjoin_jd.html", "r") as file:
            self.html = file.read()
        output = outerjoin._scrape_job_description(self.html)

        if not output:
            raise Exception("No job found")

        if not output.description:
            raise Exception("No description found")

        if not output.application_url:
            raise Exception("No application link found")
