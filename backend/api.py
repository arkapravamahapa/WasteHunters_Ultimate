import os
import json
import urllib.parse  # 🌟 NEW: Needed to handle the '+' in your password
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel

load_dotenv()

# Initialize Gemini Client
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

app = FastAPI(title="WasteHunters API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# DATABASE SETUP (UPDATED FOR SUPABASE)
# ==========================================

# 🌟 YOUR SUPABASE LINK (Password encoded to handle the '+' character)
raw_password = "SWo7h+Trls7A"
encoded_password = urllib.parse.quote_plus(raw_password)

# This is your new permanent cloud address
# This pulls the link from your .env file instead of hardcoding it
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# If DATABASE_URL starts with postgres://, SQLAlchemy might need postgresql://
if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Note: Removed connect_args because it is only for SQLite
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class DBUser(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    green_tokens = Column(Integer, default=0)
    total_recycling_events = Column(Integer, default=0)

class DBLesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    category = Column(String) 
    content_summary = Column(String)
    video_url = Column(String) 
    quiz_data = Column(String) 

class DBCampaign(Base):
    __tablename__ = "campaigns"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    location = Column(String)
    date = Column(String)
    volunteers = Column(Integer, default=0)
    max_volunteers = Column(Integer)
    creator = Column(String)

class DBCenter(Base):
    __tablename__ = "centers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    status = Column(String)
    fill = Column(String)

# Pydantic models
class CampaignCreate(BaseModel):
    title: str
    location: str
    date: str
    max_volunteers: int
    creator: str = "GreenHacker"

class CenterCreate(BaseModel):
    name: str
    lat: float
    lng: float
    status: str = "Active"
    fill: str = "0% Full"

# This creates the tables in Supabase automatically
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==========================================
# STARTUP & SEEDING
# ==========================================
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    # Seed User
    if not db.query(DBUser).filter(DBUser.id == "user_123").first():
        test_user = DBUser(id="user_123", username="GreenHacker", green_tokens=150, total_recycling_events=4)
        db.add(test_user)
    
    # Seed Diverse Lessons
    if not db.query(DBLesson).first():
        lessons = [
            DBLesson(
                title="The 3 R's of Waste", 
                category="General",
                content_summary="Learn the basics of Reduce, Reuse, and Recycle.",
                video_url="https://www.youtube.com/embed/OasbYWF4_S8",
                quiz_data=json.dumps([
                    {"q": "What does the first 'R' stand for?", "options": ["Recycle", "Reduce", "Rebound"], "correct": "Reduce"},
                    {"q": "Instead of throwing away a carton box, you should...", "options": ["Burn it", "Bury it", "Reuse it creatively"], "correct": "Reuse it creatively"}
                ])
            ),
            DBLesson(
                title="The Story of Plastic", 
                category="Plastic",
                content_summary="Understand the lifecycle of plastic and its environmental impact.",
                video_url="https://www.youtube.com/embed/iO3SA4YyEYU",
                quiz_data=json.dumps([
                    {"q": "What are plastics primarily made from?", "options": ["Trees", "Fossil Fuels", "Ocean water"], "correct": "Fossil Fuels"},
                    {"q": "What happens to most recycled plastic?", "options": ["It becomes a new bottle", "It is downcycled into something worse", "It disappears"], "correct": "It is downcycled into something worse"}
                ])
            ),
            DBLesson(
                title="Safe Battery Disposal", 
                category="E-Waste",
                content_summary="How to tape terminals to prevent fires.",
                video_url="https://www.youtube.com/embed/aLzk1zsRQCU",
                quiz_data=json.dumps([
                    {"q": "Why should you tape battery terminals?", "options": ["To make them look nice", "To prevent sparks and fires", "To hold a charge"], "correct": "To prevent sparks and fires"},
                    {"q": "Which type of tape is recommended?", "options": ["Wet tape", "Clear sticky tape", "Paper tape"], "correct": "Clear sticky tape"}
                ])
            )
        ]
        db.add_all(lessons)

    # Seed Campaigns
    if not db.query(DBCampaign).first():
        campaigns = [
            DBCampaign(title="Sector V Tech-Cleanup", location="Salt Lake, Sector V", date="2026-03-05", volunteers=12, max_volunteers=20, creator="Rahul S."),
            DBCampaign(title="New Town Battery Drive", location="Action Area I, New Town", date="2026-03-12", volunteers=45, max_volunteers=50, creator="Priya K."),
            DBCampaign(title="Eco Park E-Waste Awareness", location="Eco Park Main Gate", date="2026-03-20", volunteers=8, max_volunteers=15, creator="Aditya Roy")
        ]
        db.add_all(campaigns)

    # Seed Recycling Centers
    if not db.query(DBCenter).first():
        centers = [
            DBCenter(name="Salt Lake Sector V Hub", lat=22.5800, lng=88.4500, status="Active", fill="45% Full"),
            DBCenter(name="New Town Action Area I", lat=22.5900, lng=88.4700, status="Active", fill="20% Full"),
            DBCenter(name="Eco Park Collection Point", lat=22.6186, lng=88.4630, status="Active", fill="98% Full"),
            DBCenter(name="Chinar Park Dropoff", lat=22.6244, lng=88.4417, status="Active", fill="15% Full"),
            DBCenter(name="Jadavpur University Campus", lat=22.4989, lng=88.3715, status="Active", fill="60% Full"),
            DBCenter(name="South City Mall Dropoff", lat=22.5015, lng=88.3619, status="Busy", fill="85% Full")
        ]
        db.add_all(centers)
        
    db.commit()
    db.close()

# ==========================================
# ENDPOINTS
# ==========================================

@app.get("/api/lessons")
async def get_lessons(db: Session = Depends(get_db)):
    lessons = db.query(DBLesson).all()
    return [
        {
            "id": lesson.id,
            "title": lesson.title,
            "category": lesson.category,
            "content_summary": lesson.content_summary,
            "video_url": lesson.video_url,
            "quiz_data": json.loads(lesson.quiz_data)
        } for lesson in lessons
    ]

@app.get("/api/user-stats")
async def get_stats(db: Session = Depends(get_db)):
    user = db.query(DBUser).filter(DBUser.id == "user_123").first()
    return {"tokens": user.green_tokens, "events": user.total_recycling_events}

@app.post("/api/claim-tokens")
async def claim_tokens(payload: dict, db: Session = Depends(get_db)):
    user = db.query(DBUser).filter(DBUser.id == "user_123").first()
    tokens_to_add = payload.get("tokens", 0)
    user.green_tokens += tokens_to_add
    db.commit()
    return {"status": "success", "new_balance": user.green_tokens}

@app.get("/api/centers")
def get_active_centers(db: Session = Depends(get_db)):
    centers = db.query(DBCenter).all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "lat": c.lat,
            "lng": c.lng,
            "status": c.status,
            "fill": c.fill
        } for c in centers
    ]

@app.post("/api/centers")
def create_center(center: CenterCreate, db: Session = Depends(get_db)):
    new_center = DBCenter(
        name=center.name,
        lat=center.lat,
        lng=center.lng,
        status=center.status,
        fill=center.fill
    )
    db.add(new_center)
    db.commit()
    db.refresh(new_center)
    return {"status": "success", "id": new_center.id}

@app.delete("/api/centers/{center_id}")
def delete_center(center_id: int, db: Session = Depends(get_db)):
    center = db.query(DBCenter).filter(DBCenter.id == center_id).first()
    if not center:
        raise HTTPException(status_code=404, detail="Center not found")
    db.delete(center)
    db.commit()
    return {"status": "success", "message": f"Hub {center_id} deleted successfully."}

@app.post("/api/classify")
async def classify_ewaste(file: UploadFile = File(...)):
    image_bytes = await file.read()
    prompt = """
    Analyze this waste item and provide a detailed recovery report.
    1. Identify the 'item' and its 'category'.
    2. Estimate 'recoverable_materials' (e.g., Gold: 0.05g, Copper: 20g).
    3. Estimate 'carbon_offset' (kg of CO2 saved if recycled).
    4. Provide a 'disposal_guide'.
    5. Assign a 'token_value' between 10 and 100.
    
    Return ONLY a JSON object in this format:
    {
      "item": "name",
      "category": "category",
      "materials": [{"name": "Gold", "amount": "0.02g"}, {"name": "Copper", "amount": "15g"}],
      "carbon_saved": 2.5,
      "disposal_guide": "instructions",
      "tokens": 50
    }
    """
    response = client.models.generate_content(
        model="gemini-1.5-flash", 
        contents=[prompt, types.Part.from_bytes(data=image_bytes, mime_type=file.content_type)]
    )
    clean_json = response.text.replace("```json", "").replace("```", "").strip()
    return {"status": "success", "classification": json.loads(clean_json)}

@app.get("/api/campaigns")
async def get_campaigns(db: Session = Depends(get_db)):
    campaigns = db.query(DBCampaign).all()
    return [
        {
            "id": camp.id,
            "title": camp.title,
            "location": camp.location,
            "date": camp.date,
            "volunteers": camp.volunteers,
            "max_volunteers": camp.max_volunteers,
            "creator": camp.creator
        } for camp in campaigns
    ]

@app.post("/api/campaigns/{campaign_id}/join")
async def join_campaign(campaign_id: int, db: Session = Depends(get_db)):
    campaign = db.query(DBCampaign).filter(DBCampaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    if campaign.volunteers >= campaign.max_volunteers:
        raise HTTPException(status_code=400, detail="Campaign is full")
    campaign.volunteers += 1
    db.commit()
    return {"status": "success", "volunteers": campaign.volunteers}

@app.post("/api/campaigns")
async def create_campaign(campaign: CampaignCreate, db: Session = Depends(get_db)):
    new_campaign = DBCampaign(
        title=campaign.title,
        location=campaign.location,
        date=campaign.date,
        max_volunteers=campaign.max_volunteers,
        creator=campaign.creator,
        volunteers=0
    )
    db.add(new_campaign)
    db.commit()
    db.refresh(new_campaign)
    return {"status": "success", "id": new_campaign.id}

@app.post("/api/redeem-tokens")
async def redeem_tokens(payload: dict, db: Session = Depends(get_db)):
    user = db.query(DBUser).filter(DBUser.id == "user_123").first()
    cost = payload.get("cost", 0)
    if user.green_tokens < cost:
        raise HTTPException(status_code=400, detail="Insufficient tokens")
    user.green_tokens -= cost
    db.commit()
    return {"status": "success", "new_balance": user.green_tokens}

@app.get("/api/chart-data")
async def get_chart_data():
    return [
        {"month": "Jan", "recycled": 40, "carbon": 25},
        {"month": "Feb", "recycled": 30, "carbon": 15},
        {"month": "Mar", "recycled": 55, "carbon": 45},
        {"month": "Apr", "recycled": 80, "carbon": 60},
        {"month": "May", "recycled": 65, "carbon": 50},
        {"month": "Jun", "recycled": 90, "carbon": 70}
    ]

@app.get("/api/live-feed")
async def get_live_feed():
    return [
        {"id": 101, "user": "Rahul S.", "action": "dropped off 5kg of E-Waste", "hub": "Sector V Hub", "time": "2 mins ago"},
        {"id": 102, "user": "Priya K.", "action": "recycled 12 lithium batteries", "hub": "New Town Action Area I", "time": "15 mins ago"},
        {"id": 103, "user": "Admin", "action": "deployed a new collection bin", "hub": "Eco Park", "time": "1 hour ago"},
        {"id": 104, "user": "Aditya", "action": "claimed 50 Green Tokens", "hub": "System", "time": "3 hours ago"}
    ]
    
@app.get("/api/community-goal")
async def get_community_goal():
    return {
        "target_kg": 1000,
        "current_kg": 642.5,
        "contributor_count": 128,
        "city": "Kolkata"
    }