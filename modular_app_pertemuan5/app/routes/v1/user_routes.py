from flask import Blueprint, request
from app.utils.response_helper import success_response, fail_response

user_bp_v1 = Blueprint("user_v1", __name__, url_prefix="/api/v1/users")

mock_users = [{
    "id": 1,
    "username": "admin_bwi",
    "email": "admin@stikom.ac.id",
    "role": "admin",
}]


@user_bp_v1.route("", methods=["GET"])
def get_users():
  return success_response(
      data={"users": mock_users, "total": len(mock_users)}
  )


@user_bp_v1.route("", methods=["POST"])
def register_user():
  if not request.is_json:
    return fail_response(
        {"content_type": "Header harus application/json"}, 400
    )

  body = request.get_json()
  errors = {}
  if not body.get("username"):
    errors["username"] = "Field username wajib diisi"
  if not body.get("email") or "@" not in body.get("email"):
    errors["email"] = "Field email tidak valid"

  if errors:
    return fail_response(errors, 400)

  # Perbaikan: Bagian ini dipindah keluar dari blok if errors
  new_u = {
      "id": len(mock_users) + 1,
      "username": body["username"],
      "email": body["email"],
      "role": "user",
  }
  mock_users.append(new_u)
  return success_response(
      data=new_u, message="User berhasil didaftarkan", code=201
  )