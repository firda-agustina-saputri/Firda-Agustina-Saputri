class ProductRepository:
    def __init__(self):
        self.products = [
            { "id": 1, "name": "Teh Original", "category": "Minuman", "price": 3500, "stok": 50 },
            { "id": 2, "name": "Teh susu", "category": "Minuman", "price": 5000, "stok": 30 },
            { "id": 3, "name": "Teh yakult", "category": "Minuman", "price": 7000, "stok": 25 },
            { "id": 4, "name": "Teh cappucino", "category": "Minuman", "price": 7000, "stok": 40 },
            { "id": 5, "name": "Teh susu coklat", "category": "Minuman", "price": 5000, "stok": 30 },
            { "id": 6, "name": "Teh lemon", "category": "Minuman", "price": 5000, "stok": 40 },
            { "id": 7, "name": "Teh strowbery", "category": "Minuman", "price": 5000, "stok": 30 },
            { "id": 8, "name": "Teh madu", "category": "Minuman", "price": 5000, "stok": 35 },
        ]

    def get_all(self):
        return self.products

    def get_by_name(self, name):
        return next((p for p in self.products if p["name"].lower() == name.lower()), None)

    def create(self, name, category, price, stok):
        product = {
            "id": len(self.products) + 1,
            "name": name,
            "category": category,
            "price": price,
            "stok": stok
        }
        self.products.append(product)
        return product