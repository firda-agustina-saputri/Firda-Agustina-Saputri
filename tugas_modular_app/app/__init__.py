from flask import Flask
from flask_cors import CORS
from app.routes.product_routes import product_bp

def create_app():
    app = Flask(__name__)
    CORS(app) # Mengizinkan koneksi dari frontend
    app.register_blueprint(product_bp)
    return app