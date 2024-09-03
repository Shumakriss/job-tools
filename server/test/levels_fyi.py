import unittest
from server import levels_fyi


class TestLevelsFyi(unittest.TestCase):

    def test_scrape_jd(self):
        with open("../../examples/levels_jd.html", "r") as file:
            self.html = file.read()
        output = levels_fyi._scrape_job_description(self.html)
        if len(output) == 0:
            raise Exception("")

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
