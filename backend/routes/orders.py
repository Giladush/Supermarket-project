from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import db
from models import Order, OrderItem, Product

orders_bp = Blueprint("orders", __name__)

@orders_bp.post("")
@jwt_required()
def create_order():
    user_id = int(get_jwt_identity())
    data = request.get_json(force=True) or {}
    items = data.get("items") or []

    if not items:
        return jsonify({"message": "items are required"}), 400

    order = Order(user_id=user_id, total=0)
    db.session.add(order)
    db.session.flush()  

    total = 0.0
    for it in items:
        product_id = int(it.get("productId"))
        qty = int(it.get("quantity", 1))
        product = Product.query.get(product_id)
        if not product:
            db.session.rollback()
            return jsonify({"message": f"product {product_id} not found"}), 404

        line_total = product.price * qty
        total += line_total

        db.session.add(OrderItem(
            order_id=order.id,
            product_id=product.id,
            name=product.name,
            price=product.price,
            quantity=qty
        ))

    order.total = float(total)
    db.session.commit()
    return jsonify({"message": "order created", "orderId": order.id}), 201

@orders_bp.get("/me")
@jwt_required()
def my_orders():
    user_id = int(get_jwt_identity())
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    result = []
    for o in orders:
        items = OrderItem.query.filter_by(order_id=o.id).all()
        result.append({
            "id": o.id,
            "total": o.total,
            "createdAt": o.created_at.isoformat(),
            "items": [{"name": i.name, "price": i.price, "quantity": i.quantity} for i in items]
        })
    return jsonify(result)
