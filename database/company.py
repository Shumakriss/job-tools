class Company:
    name: str = ""
    description: str = ""
    rating: float = 0
    street_address: str = ""
    city: str = ""
    zip_code: str = ""
    state: str = ""
    employee_count: int = 0

    def __init__(self,
                 name: str = "",
                 description: str = "",
                 rating: float = 3.5,
                 street_address: str = "",
                 city: str = "",
                 zip_code: str = "",
                 state: str = "",
                 employee_count: int = 0):
        self.name = name
        self.description = description
        self.rating = rating
        self.street_address = street_address
        self.city = city
        self.zip_code = zip_code
        self.state = state
        self.employee_count = employee_count

    def serializable(self):
        return {
            "name": self.name,
            "description": self.description,
            "rating": self.rating,
            "street_address": self.street_address,
            "city": self.city,
            "zip_code": self.zip_code,
            "state": self.state,
            "employee_count": self.employee_count
        }


def setup_company_db():
    pass
