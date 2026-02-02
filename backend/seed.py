import random
from db import db
from models import Product

PRODUCTS_BY_CATEGORY = {
    "milk": [
        "Milk 1L", "Chocolate Milk", "Greek Yogurt", "White Cheese",
        "Cottage Cheese", "Butter", "Cream 38%", "Goat Cheese"
    ],
    "meat": [
        "Chicken Breast", "Ground Beef", "Beef Steak",
        "Turkey Schnitzel", "Sausages", "Lamb Chops"
    ],
    "fruits": [
        "Apple", "Banana", "Orange", "Strawberry",
        "Grapes", "Peach", "Pineapple"
    ],
    "vegetables": [
        "Tomato", "Cucumber", "Carrot", "Potato",
        "Onion", "Pepper", "Broccoli", "Zucchini"
    ]
}

def seed_if_needed():
    if Product.query.count() > 0:
        return

    for category, names in PRODUCTS_BY_CATEGORY.items():
        for name in names:
            db.session.add(Product(
                name=name,
                category=category,
                price=round(random.uniform(3, 50), 2),
                image_url=f"https://source.unsplash.com/400x400/?{name.replace(' ', '-')}"
            ))

    db.session.commit()
