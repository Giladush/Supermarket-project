from flask import Blueprint, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token
from db import db
from models import User
from security import hash_password, verify_password
import os

auth_bp = Blueprint("auth", __name__)


_jwt = JWTManager()

@auth_bp.record_once
def on_load(state):
    app = state.app
    _jwt.init_app(app)

@auth_bp.post("/register")
def register():
    data = request.get_json(force=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"message": "email and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "email already exists"}), 409

    user = User(email=email, password_hash=hash_password(password))
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "registered"}), 201

@auth_bp.post("/login")
def login():
    data = request.get_json(force=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if not user or not verify_password(password, user.password_hash):
        return jsonify({"message": "invalid credentials"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": token, "user": {"id": user.id, "email": user.email}})
