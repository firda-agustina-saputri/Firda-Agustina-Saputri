from flask import Blueprint, request, jsonify
from app.repositories.product_repo import ProductRepository
from app.services.product_service import ProductService

product_bp = Blueprint('products', __name__, url_prefix='/api/v1/products')

repo = ProductRepository()
service = ProductService(repo)

@product_bp.route('', methods=['GET'])
def list_products():
    return jsonify({"status": "success", "data": service.fetch_products()}), 200

@product_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    resp, code = service.get_product_by_id(product_id)
    return jsonify(resp), code

@product_bp.route('', methods=['POST'])
def create_product():
    data = request.get_json() if request.is_json else None
    resp, code = service.add_new_product(data)
    return jsonify(resp), code

@product_bp.route('/<int:product_id>', methods=['POST', 'PUT'])
def handle_product_by_id(product_id):
    if request.method == 'POST':
        product = repo.get_by_id(product_id)
        if not product:
            return jsonify({"error": "Produk tidak ditemukan!"}), 404
        return jsonify({"status": "success", "data": product}), 200

    data = request.get_json() if request.is_json else None
    resp, code = service.update_product(product_id, data)
    return jsonify(resp), code

@product_bp.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    resp, code = service.delete_product(product_id)
    return jsonify(resp), code