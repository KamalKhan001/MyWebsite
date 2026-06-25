from fastapi import FastAPI, APIRouter, HTTPException, Query, Request, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_admin as _get_current_admin,
)


async def require_admin(request: Request):
    """FastAPI dependency that resolves the current admin from the request."""
    return await _get_current_admin(request, db)


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="KK-TRUST COMP API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ============= Models =============

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    description: str
    image: str
    min_order: str
    colors: List[str]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    company: str
    country: str
    image: str
    text: str
    rating: int = 5
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactInquiryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    phone: str = Field(min_length=1, max_length=50)
    company: str = Field(min_length=1, max_length=200)
    country: str = Field(min_length=1, max_length=100)
    product_interest: str = Field(min_length=1, max_length=100)
    message: str = Field(min_length=1, max_length=5000)


class ContactInquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    company: str
    country: str
    product_interest: str
    message: str
    status: str = "new"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ============= Helper Functions =============

def serialize_datetime(doc: dict) -> dict:
    """Convert datetime fields to ISO strings for MongoDB storage."""
    if 'created_at' in doc and isinstance(doc['created_at'], datetime):
        doc['created_at'] = doc['created_at'].isoformat()
    return doc


def deserialize_datetime(doc: dict) -> dict:
    """Convert ISO strings back to datetime objects when reading from MongoDB."""
    if 'created_at' in doc and isinstance(doc['created_at'], str):
        doc['created_at'] = datetime.fromisoformat(doc['created_at'])
    return doc


# ============= Routes =============

@api_router.get("/")
async def root():
    return {"message": "KK-TRUST COMP API is running", "status": "healthy"}


# Products Endpoints
@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = Query(None)):
    """Get all products or filter by category."""
    query = {}
    if category and category.lower() != "all":
        query["category"] = category
    
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    return [deserialize_datetime(p) for p in products]


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get a single product by ID."""
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return deserialize_datetime(product)


# Testimonials Endpoints
@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    """Get all testimonials."""
    testimonials = await db.testimonials.find({}, {"_id": 0}).to_list(1000)
    return [deserialize_datetime(t) for t in testimonials]


# Contact Inquiries Endpoints
@api_router.post("/contact-inquiries", response_model=ContactInquiry, status_code=201)
async def create_contact_inquiry(inquiry: ContactInquiryCreate):
    """Submit a new contact inquiry."""
    inquiry_obj = ContactInquiry(**inquiry.model_dump())
    doc = serialize_datetime(inquiry_obj.model_dump())
    
    await db.contact_inquiries.insert_one(doc)
    logger.info(f"New contact inquiry from {inquiry.email} ({inquiry.company})")
    return inquiry_obj


@api_router.get("/contact-inquiries", response_model=List[ContactInquiry])
async def get_contact_inquiries(admin: dict = Depends(require_admin)):
    """Get all contact inquiries (admin only)."""
    inquiries = await db.contact_inquiries.find(
        {}, {"_id": 0}
    ).sort("created_at", -1).to_list(1000)
    return [deserialize_datetime(i) for i in inquiries]


@api_router.patch("/contact-inquiries/{inquiry_id}", response_model=ContactInquiry)
async def update_inquiry_status(
    inquiry_id: str,
    payload: dict,
    admin: dict = Depends(require_admin),
):
    """Update inquiry status (admin only). Accepts {status: 'new'|'in_progress'|'closed'}."""
    new_status = payload.get("status")
    if new_status not in ("new", "in_progress", "closed"):
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.contact_inquiries.update_one(
        {"id": inquiry_id}, {"$set": {"status": new_status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    doc = await db.contact_inquiries.find_one({"id": inquiry_id}, {"_id": 0})
    return deserialize_datetime(doc)


@api_router.delete("/contact-inquiries/{inquiry_id}", status_code=204)
async def delete_inquiry(
    inquiry_id: str,
    admin: dict = Depends(require_admin),
):
    """Delete an inquiry (admin only)."""
    result = await db.contact_inquiries.delete_one({"id": inquiry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return None


# ============= Auth Endpoints =============

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


@api_router.post("/auth/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    """Admin login."""
    user = await db.users.find_one({"email": payload.email.lower()})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user_id=user["id"], email=user["email"], role=user.get("role", "admin"))
    return LoginResponse(
        access_token=token,
        user={
            "id": user["id"],
            "email": user["email"],
            "name": user.get("name", "Admin"),
            "role": user.get("role", "admin"),
        },
    )


@api_router.get("/auth/me")
async def get_me(request: Request):
    """Return the current authenticated admin."""
    admin = await _get_current_admin(request, db)
    return admin


# ============= Seed Data =============

SEED_PRODUCTS = [
    {
        "name": "Premium Cotton T-Shirt",
        "category": "T-shirts",
        "description": "High-quality 100% cotton t-shirts available in multiple colors and sizes",
        "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
        "min_order": "500 pieces",
        "colors": ["White", "Black", "Navy", "Grey"]
    },
    {
        "name": "Athletic Performance Tee",
        "category": "Sportswear",
        "description": "Moisture-wicking fabric perfect for athletic performance",
        "image": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
        "min_order": "300 pieces",
        "colors": ["Red", "Blue", "Green", "Yellow"]
    },
    {
        "name": "Compression Gym Wear",
        "category": "Gym Wear",
        "description": "Compression fit for enhanced performance and muscle support",
        "image": "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80",
        "min_order": "400 pieces",
        "colors": ["Black", "Grey", "Navy"]
    },
    {
        "name": "Training Gloves",
        "category": "Gloves",
        "description": "Professional quality training gloves with reinforced grip",
        "image": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&q=80",
        "min_order": "200 pairs",
        "colors": ["Black", "Red", "Blue"]
    },
    {
        "name": "Polo Sport Shirt",
        "category": "Sportswear",
        "description": "Classic polo design with breathable fabric",
        "image": "https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=500&q=80",
        "min_order": "400 pieces",
        "colors": ["White", "Navy", "Black", "Red"]
    },
    {
        "name": "Workout Shorts",
        "category": "Gym Wear",
        "description": "Lightweight and comfortable gym shorts with pockets",
        "image": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80",
        "min_order": "500 pieces",
        "colors": ["Black", "Grey", "Navy", "Red"]
    },
    {
        "name": "V-Neck Basic Tee",
        "category": "T-shirts",
        "description": "Comfortable v-neck design in premium fabric",
        "image": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80",
        "min_order": "600 pieces",
        "colors": ["White", "Black", "Grey", "Navy"]
    },
    {
        "name": "Boxing Gloves Professional",
        "category": "Gloves",
        "description": "Heavy-duty boxing gloves for professional training",
        "image": "https://images.unsplash.com/photo-1517438322307-e67111335449?w=500&q=80",
        "min_order": "150 pairs",
        "colors": ["Red", "Black", "Blue"]
    },
    {
        "name": "Track Jacket",
        "category": "Sportswear",
        "description": "Stylish track jacket with zipper closure",
        "image": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
        "min_order": "300 pieces",
        "colors": ["Black", "Navy", "Grey"]
    },
    {
        "name": "Yoga Pants",
        "category": "Gym Wear",
        "description": "Flexible and comfortable yoga pants with high waist",
        "image": "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&q=80",
        "min_order": "400 pieces",
        "colors": ["Black", "Grey", "Navy", "Purple"]
    },
    {
        "name": "Crew Neck T-Shirt",
        "category": "T-shirts",
        "description": "Classic crew neck design for everyday wear",
        "image": "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&q=80",
        "min_order": "700 pieces",
        "colors": ["White", "Black", "Grey", "Navy", "Red"]
    },
    {
        "name": "Weightlifting Gloves",
        "category": "Gloves",
        "description": "Padded palm gloves for weightlifting and gym workouts",
        "image": "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=500&q=80",
        "min_order": "250 pairs",
        "colors": ["Black", "Grey", "Blue"]
    }
]

SEED_TESTIMONIALS = [
    {
        "name": "Michael Roberts",
        "company": "Sports Hub USA",
        "country": "United States",
        "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
        "text": "KK-TRUST COMP has been our reliable partner for over 3 years. Their quality is consistently excellent and delivery is always on time. Highly recommended for bulk orders.",
        "rating": 5
    },
    {
        "name": "Sarah Williams",
        "company": "FitGear UK",
        "country": "United Kingdom",
        "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        "text": "Outstanding service and product quality. The team is professional and always willing to accommodate custom requirements. Our customers love their products.",
        "rating": 5
    },
    {
        "name": "Ahmed Al-Rashid",
        "company": "Dubai Sports Center",
        "country": "UAE",
        "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
        "text": "Best quality gym wear and sportswear we've imported. The attention to detail and customer service is exceptional. A trustworthy export partner.",
        "rating": 5
    },
    {
        "name": "Emma Johnson",
        "company": "Active Lifestyle Store",
        "country": "Australia",
        "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
        "text": "We've worked with several suppliers, but KK-TRUST COMP stands out for their reliability and product excellence. Great communication throughout the process.",
        "rating": 5
    },
    {
        "name": "Hans Mueller",
        "company": "Berlin Athletic Supplies",
        "country": "Germany",
        "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
        "text": "Professional team, high-quality products, and competitive pricing. They understand international business requirements perfectly.",
        "rating": 5
    },
    {
        "name": "Lisa Chen",
        "company": "Shanghai Sports Co.",
        "country": "China",
        "image": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&q=80",
        "text": "Excellent manufacturing standards and swift shipping. KK-TRUST COMP has become our preferred supplier for sportswear imports.",
        "rating": 5
    }
]


async def seed_database():
    """Seed the database with initial product and testimonial data if collections are empty."""
    # Seed products
    products_count = await db.products.count_documents({})
    if products_count == 0:
        product_docs = []
        for p in SEED_PRODUCTS:
            product = Product(**p)
            product_docs.append(serialize_datetime(product.model_dump()))
        await db.products.insert_many(product_docs)
        logger.info(f"Seeded {len(product_docs)} products")
    
    # Seed testimonials
    testimonials_count = await db.testimonials.count_documents({})
    if testimonials_count == 0:
        testimonial_docs = []
        for t in SEED_TESTIMONIALS:
            testimonial = Testimonial(**t)
            testimonial_docs.append(serialize_datetime(testimonial.model_dump()))
        await db.testimonials.insert_many(testimonial_docs)
        logger.info(f"Seeded {len(testimonial_docs)} testimonials")


async def seed_admin():
    """Idempotently create / update the admin user from env vars."""
    admin_email = os.environ.get("ADMIN_EMAIL", "").lower().strip()
    admin_password = os.environ.get("ADMIN_PASSWORD", "")
    if not admin_email or not admin_password:
        logger.warning("ADMIN_EMAIL/ADMIN_PASSWORD not set; skipping admin seeding")
        return

    # Ensure unique index on email
    await db.users.create_index("email", unique=True)

    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        user_doc = {
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.users.insert_one(user_doc)
        logger.info(f"Seeded admin user: {admin_email}")
    else:
        # Update password hash if it has changed in env
        if not verify_password(admin_password, existing["password_hash"]):
            await db.users.update_one(
                {"email": admin_email},
                {"$set": {"password_hash": hash_password(admin_password)}},
            )
            logger.info(f"Updated admin password for: {admin_email}")


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    await seed_database()
    await seed_admin()
    logger.info("KK-TRUST COMP API started successfully")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
