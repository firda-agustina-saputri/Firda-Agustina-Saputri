class ProductService:
    def __init__(self, repo):
        self.repo = repo

    def fetch_products(self):
        return self.repo.get_all()

    def get_product_by_id(self, product_id):
        product = self.repo.get_by_id(product_id)
        if not product:
            return {"error": "Produk tidak ditemukan!"}, 404
        return {"status": "success", "data": product}, 200

    def add_new_product(self, data):
        if not data or not all(k in data for k in ("name", "category", "price", "stok")):
            return {"error": "Nama, kategori, harga, dan stok wajib diisi lengkap!"}, 400

        name = str(data["name"]).strip()
        category = str(data["category"]).strip()
        
        try:
            price = float(data["price"])
            stok = int(data["stok"])
        except (ValueError, TypeError):
            return {"error": "Format harga atau stok tidak valid!"}, 400

        if not name or not category or price <= 0 or stok < 0:
            return {"error": "Validasi gagal! Harga harus > 0 dan stok tidak boleh negatif."}, 400

        existing_product = self.repo.get_by_name(name)
        if existing_product:
            return {"error": f"Gagal! Produk dengan nama '{name}' sudah terdaftar di sistem."}, 400

        created = self.repo.create(name=name, category=category, price=price, stok=stok)
        return {"status": "success", "data": created}, 201

    def update_product(self, product_id, data):
        product = self.repo.get_by_id(product_id)
        if not product:
            return {"error": "Produk tidak ditemukan!"}, 404

        if not data or not all(k in data for k in ("name", "category", "price", "stok")):
            return {"error": "Nama, kategori, harga, dan stok wajib diisi lengkap!"}, 400

        name = str(data["name"]).strip()
        category = str(data["category"]).strip()
        
        try:
            price = float(data["price"])
            stok = int(data["stok"])
        except (ValueError, TypeError):
            return {"error": "Format harga atau stok tidak valid!"}, 400

        if not name or not category or price <= 0 or stok < 0:
            return {"error": "Validasi gagal! Harga harus > 0 dan stok tidak boleh negatif."}, 400

        existing_product = self.repo.get_by_name(name)
        if existing_product and existing_product["id"] != product_id:
            return {"error": f"Gagal! Produk dengan nama '{name}' sudah terdaftar di sistem."}, 400

        updated = self.repo.update(product_id, name=name, category=category, price=price, stok=stok)
        return {"status": "success", "data": updated}, 200

    def delete_product(self, product_id):
        product = self.repo.get_by_id(product_id)
        if not product:
            return {"error": "Produk tidak ditemukan!"}, 404

        self.repo.delete(product_id)
        return {"status": "success", "message": f"Produk dengan ID {product_id} berhasil dihapus"}, 200