from flask import Blueprint, request, jsonify
from models import Product

products_bp = Blueprint("products", __name__)

@products_bp.get("")
def list_products():
    category = request.args.get("category")
    q = Product.query
    if category:
        q = q.filter_by(category=category)
    products = q.order_by(Product.id.asc()).all()
    return jsonify([{
    "id": p.id,
    "name": p.name,
    "category": p.category,
    "price": p.price,
    "imageUrl": p.image_url
} for p in products])


@products_bp.get("/categories")
def categories():
    
    return jsonify(["milk", "meat", "fruits", "vegetables"])
