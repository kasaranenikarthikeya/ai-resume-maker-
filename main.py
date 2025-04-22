from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router

app = FastAPI()

# Hard-coded CORS origins
ALLOWED_ORIGINS = [
    "https://ai-resume-client.onrender.com",
    "http://localhost:3000",
    "http://localhost:3001"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "AI Resume Builder Backend is running..."}
