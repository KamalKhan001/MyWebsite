"""Backend API tests for KK-TRUST COMP."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL") or open("/app/frontend/.env").read().split("REACT_APP_BACKEND_URL=")[1].splitlines()[0].strip()
BASE_URL = BASE_URL.rstrip("/")

EXPECTED_CATEGORIES = ["T-shirts", "Sportswear", "Gym Wear", "Gloves"]


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---- Health ----
def test_health(session):
    r = session.get(f"{BASE_URL}/api/")
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "healthy"


# ---- Products ----
class TestProducts:
    def test_get_all_products(self, session):
        r = session.get(f"{BASE_URL}/api/products")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 12, f"Expected 12 products, got {len(data)}"
        required = {"id", "name", "category", "description", "image", "min_order", "colors"}
        for p in data:
            missing = required - set(p.keys())
            assert not missing, f"Missing fields {missing} in product {p.get('name')}"
            assert isinstance(p["colors"], list)
            assert p["category"] in EXPECTED_CATEGORIES

    @pytest.mark.parametrize("category", EXPECTED_CATEGORIES)
    def test_filter_by_category(self, session, category):
        r = session.get(f"{BASE_URL}/api/products", params={"category": category})
        assert r.status_code == 200
        data = r.json()
        assert len(data) > 0, f"No products returned for category {category}"
        for p in data:
            assert p["category"] == category

    def test_category_counts(self, session):
        r = session.get(f"{BASE_URL}/api/products")
        data = r.json()
        counts = {}
        for p in data:
            counts[p["category"]] = counts.get(p["category"], 0) + 1
        # Should have all 4 categories
        for c in EXPECTED_CATEGORIES:
            assert c in counts, f"Missing category {c}"


# ---- Testimonials ----
class TestTestimonials:
    def test_get_all_testimonials(self, session):
        r = session.get(f"{BASE_URL}/api/testimonials")
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 6, f"Expected 6 testimonials, got {len(data)}"
        required = {"id", "name", "company", "country", "image", "text", "rating"}
        for t in data:
            missing = required - set(t.keys())
            assert not missing, f"Missing fields {missing}"
            assert isinstance(t["rating"], int)


# ---- Contact Inquiries ----
class TestContactInquiries:
    def test_create_valid_inquiry(self, session):
        payload = {
            "name": "TEST_John Doe",
            "email": "test_john@example.com",
            "phone": "+1234567890",
            "company": "TEST_Acme Corp",
            "country": "United States",
            "product_interest": "T-shirts",
            "message": "TEST_We are interested in bulk orders of T-shirts.",
        }
        r = session.post(f"{BASE_URL}/api/contact-inquiries", json=payload)
        assert r.status_code == 201, f"Got {r.status_code}: {r.text}"
        data = r.json()
        assert "id" in data and data["id"]
        assert data["email"] == payload["email"]
        assert data["product_interest"] == payload["product_interest"]
        assert data["status"] == "new"

        # Verify persistence
        list_r = session.get(f"{BASE_URL}/api/contact-inquiries")
        assert list_r.status_code == 200
        ids = [i["id"] for i in list_r.json()]
        assert data["id"] in ids

    def test_invalid_email(self, session):
        payload = {
            "name": "TEST_Bad Email",
            "email": "not-an-email",
            "phone": "+123",
            "company": "TEST_X",
            "country": "Pakistan",
            "product_interest": "Gloves",
            "message": "TEST_message",
        }
        r = session.post(f"{BASE_URL}/api/contact-inquiries", json=payload)
        assert r.status_code == 422

    def test_missing_required_fields(self, session):
        # missing message, country
        payload = {
            "name": "TEST_X",
            "email": "x@example.com",
            "phone": "+1",
            "company": "TEST_Y",
            "product_interest": "Gym Wear",
        }
        r = session.post(f"{BASE_URL}/api/contact-inquiries", json=payload)
        assert r.status_code == 422

    def test_inquiries_sorted_desc(self, session):
        # create two with explicit ordering
        for i in range(2):
            payload = {
                "name": f"TEST_Order {i}",
                "email": f"test_order{i}@example.com",
                "phone": "+1",
                "company": "TEST_Co",
                "country": "Pakistan",
                "product_interest": "Sportswear",
                "message": f"TEST_msg {i}",
            }
            session.post(f"{BASE_URL}/api/contact-inquiries", json=payload)

        r = session.get(f"{BASE_URL}/api/contact-inquiries")
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 2
        # Verify desc order by created_at
        created_ats = [i["created_at"] for i in data]
        assert created_ats == sorted(created_ats, reverse=True), "Not sorted desc by created_at"
