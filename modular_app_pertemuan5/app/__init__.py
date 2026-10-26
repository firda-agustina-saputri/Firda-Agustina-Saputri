from flask import Flask
from flask_cors import CORS
from app.routes.v1.product_routes import product_bp
from app.routes.v1.category_routes import category_bp_v1

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Registrasi Blueprint
    app.register_blueprint(product_bp)
    app.register_blueprint(category_bp_v1)
    
    return app