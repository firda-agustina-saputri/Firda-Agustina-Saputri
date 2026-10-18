class ProductService:
    def __init__(self, repo):
        self.repo = repo

    def fetch_products(self):
        return self.repo.get_all()

    def add_new_product(self, data):
        if not data or not all(k in data for k in ("name", "category", "price", "stok")):
            return {"error": "Nama, kategori, harga, dan stok wajib diisi lengkap!"}, 400

        name = data["name"].strip()
        category = data["category"].strip()
        price = float(data["price"])
        stok = int(data["stok"])

        # Aturan Bisnis 1: Validasi Harga & Stok
        if price <= 0:
            return {"error": "Harga produk harus lebih besar dari 0!"}, 400
        if stok < 0:
            return {"error": "Stok produk tidak boleh bernilai negatif!"}, 400

        # Aturan Bisnis 2: Validasi Nama Produk Unik (Cek Duplikat)
        existing_product = self.repo.get_by_name(name)
        if existing_product:
            return {"error": f"Gagal! Produk dengan nama '{name}' sudah terdaftar di sistem."}, 400

        created = self.repo.create(name=name, category=category, price=price, stok=stok)
        return {"status": "success", "data": created}, 201