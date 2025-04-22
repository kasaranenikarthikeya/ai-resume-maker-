from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import aiohttp
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Error: GEMINI_API_KEY is not set")
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"

class ResumeRequest(BaseModel):
    prompt: str

@router.post("/generate-resume")
async def generate_resume(request: ResumeRequest):
    if not request.prompt or not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt is required and cannot be empty")

    print(f"Received prompt: {request.prompt}")  # Debug
    try:
        async with aiohttp.ClientSession() as session:
            print("Sending request to Gemini API")  # Debug
            async with session.post(GEMINI_API_URL, json={
                "contents": [
                    {
                        "parts": [
                            {
                                "text": (
                                    "Generate a professional resume based on the following prompt: "
                                    f"\"{request.prompt}\". "
                                    "Structure the resume with the following sections: "
                                    "**Personal** (include Name, Email, Phone), "
                                    "**Summary** (brief professional overview), "
                                    "**Skills** (list relevant skills), "
                                    "**Experience** (list job roles with company, title, dates, and responsibilities), "
                                    "**Education** (list degrees, institutions, and dates), "
                                    "**Projects** (list relevant projects with descriptions), "
                                    "**Certifications** (list certifications with dates). "
                                    "Use bullet points (•) for lists and bold text (**text**) for section headings. "
                                    "Ensure each section is clearly labeled and separated by a new line. "
                                    "If the prompt lacks specific details, use realistic placeholder data that aligns with the prompt's context."
                                )
                            }
                        ]
                    }
                ]
            }) as response:
                print(f"Gemini API response status: {response.status}")  # Debug
                response.raise_for_status()
                data = await response.json()
                print(f"Gemini API response data: {data}")  # Debug

                # Check for valid response
                candidates = data.get("candidates", [])
                if not candidates or not isinstance(candidates, list) or len(candidates) == 0:
                    print("No candidates received from Gemini API")  # Debug
                    raise HTTPException(status_code=500, detail="No resume data received from Gemini API")

                # Extract resume text
                content = candidates[0].get("content", {})
                parts = content.get("parts", [])
                if not parts or not isinstance(parts, list) or len(parts) == 0:
                    print("No parts found in Gemini API response")  # Debug
                    raise HTTPException(status_code=500, detail="Invalid response structure from Gemini API")

                resume_text = parts[0].get("text", "")
                if not resume_text:
                    print("Empty resume text received")  # Debug
                    raise HTTPException(status_code=500, detail="Empty resume text received from Gemini API")

                print(f"Generated resume: {resume_text}")  # Debug
                return {"resume": resume_text}

    except aiohttp.ClientResponseError as e:
        error_message = e.message or "Error generating resume"
        print(f"ClientResponseError: {error_message}")  # Debug
        raise HTTPException(status_code=500, detail=error_message)
    except aiohttp.ClientError as e:
        print(f"ClientError: {str(e)}")  # Debug
        raise HTTPException(status_code=500, detail=f"Network error: {str(e)}")
    except Exception as e:
        print(f"General error: {str(e)}")  # Debug
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")