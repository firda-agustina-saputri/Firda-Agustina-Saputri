from flask import Blueprint, request, jsonify
from app.repositories.product_repo import ProductRepository
from app.services.product_service import ProductService

product_bp = Blueprint('products', __name__, url_prefix='/api/v1/products')

repo = ProductRepository()
service = ProductService(repo)

@product_bp.route('', methods=['GET'])
def list_products():
    return jsonify({"status": "success", "data": service.fetch_products()}), 200

@product_bp.route('', methods=['POST'])
def create_product():
    data = request.get_json() if request.is_json else None
    resp, code = service.add_new_product(data)
    return jsonify(resp), code