import unittest
from server.scrape import levels_fyi

EXPECTED_JD = """At City Storage Systems, we're
                                            building Infrastructure for Better Food. We help restaurateurs around the
                                            world succeed in online food delivery. Our goal is to make food more
                                            affordable, higher quality, and convenient for everyone. We're changing the
                                            game for restaurateurs, whether they’re entrepreneurs opening their first
                                            restaurant all the way through to your favorite global quick-service
                                            restaurant chains"""

class TestLevelsFyi(unittest.TestCase):

    def test_scrape_jd(self):
        with open("../../examples/levels_jd_2.html", "r") as file:
            self.html = file.read()
        output = levels_fyi._scrape_job_description(self.html)

        if len(output) == 0:
            raise Exception("Empty job description")

        if type(output) != dict:
            raise Exception("Job description is not a string")


    def test_scrape_search(self):
        with open("../../examples/levels_search.html", "r") as file:
            self.html = file.read()
        output = levels_fyi._scrape_search_results(self.html)
        if len(output) == 0:
            raise Exception("")

    # # TODO: Tag for integration
    # def test_fetch_jd(self):
    #     output = levels_fyi._fetch_job_description("https://www.levels.fyi/jobs?jobId=103126329490055878")
    #     if len(output) == 0:
    #         raise Exception("")
    #
    # # TODO: Tag for integration
    # def test_fetch_search(self):
    #     output = levels_fyi._fetch_search_results("https://www.levels.fyi/jobs")
    #     if len(output) == 0:
    #         raise Exception("")
    #
    # # TODO: Tag for integration
    # def test_fetch_search(self):
    #     output = levels_fyi._fetch_search_results("software engineer")
    #     if len(output) == 0:
    #         raise Exception("")
    #
    # # TODO: Tag for integration
    # def test_search(self):
    #     output = levels_fyi.search("software engineer")
    #     if len(output) == 0:
    #         raise Exception("")
