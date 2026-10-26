from flask import Blueprint, request
from app.utils.response_helper import success_response, fail_response

category_bp_v1 = Blueprint("category_v1", __name__, url_prefix="/api/v1/categories")

mock_categories = [
    {
        "id": 1,
        "name": "Teh Hijau",
        "description": "Kategori produk olahan daun teh hijau pilihan.",
    },
    {
        "id": 2,
        "name": "Teh Hitam",
        "description": "Kategori produk olahan teh hitam tradisional.",
    }
]


@category_bp_v1.route("", methods=["GET"])
def get_categories():
    return success_response(
        data={"categories": mock_categories, "total": len(mock_categories)}
    )


@category_bp_v1.route("", methods=["POST"])
def create_category():
    if not request.is_json:
        return fail_response(
            {"content_type": "Header harus application/json"}, 400
        )

    body = request.get_json()
    errors = {}
    if not body.get("name"):
        errors["name"] = "Field nama kategori wajib diisi"

    if errors:
        return fail_response(errors, 400)

    new_cat = {
        "id": len(mock_categories) + 1,
        "name": body["name"],
        "description": body.get("description", "-"),
    }
    mock_categories.append(new_cat)
    return success_response(
        data=new_cat, message="Kategori berhasil ditambahkan", code=201
    )