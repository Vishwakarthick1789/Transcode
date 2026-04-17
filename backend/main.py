from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Language Translator API")

# Allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supported target languages and their respective Helsinki-NLP models
# Using models from Hugging Face's Opus-MT
SUPPORTED_LANGUAGES = {
    "hi": "Helsinki-NLP/opus-mt-en-hi", # Hindi
    "es": "Helsinki-NLP/opus-mt-en-es", # Spanish
    "fr": "Helsinki-NLP/opus-mt-en-fr", # French
}

# Dictionary to hold the loaded pipelines locally
# We lazy-load them to avoid long startup times and excessive memory use on boot
pipelines = {}

class TranslationRequest(BaseModel):
    text: str
    target_language: str

class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    target_language: str

def get_pipeline(target_language: str):
    if target_language not in SUPPORTED_LANGUAGES:
        raise ValueError(f"Language '{target_language}' is not supported.")
        
    model_name = SUPPORTED_LANGUAGES[target_language]
    
    # Load on-demand and cache in memory
    if target_language not in pipelines:
        logger.info(f"Loading translation model {model_name}... This might take a bit on first run.")
        try:
            # We use translation pipeline from transformers
            pipelines[target_language] = pipeline("translation", model=model_name)
            logger.info(f"Successfully loaded {model_name}")
        except Exception as e:
            logger.error(f"Error loading model {model_name}: {e}")
            raise e
            
    return pipelines[target_language]

@app.get("/languages")
async def get_languages():
    """Return the list of supported languages."""
    return {
        "supported_languages": [
            {"code": "hi", "name": "Hindi"},
            {"code": "es", "name": "Spanish"},
            {"code": "fr", "name": "French"},
        ]
    }

@app.post("/translate", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
        
    if request.target_language not in SUPPORTED_LANGUAGES:
        raise HTTPException(
            status_code=400, 
            detail=f"Target language '{request.target_language}' not supported. Expected one of: {list(SUPPORTED_LANGUAGES.keys())}"
        )
        
    try:
        # Get or load the pipeline
        translator = get_pipeline(request.target_language)
        
        # Translate
        # For sequence-to-sequence, the pipeline returns a target text key, sometimes 'translation_text'
        result = translator(request.text)
        translated_text = result[0]['translation_text']
        
        return TranslationResponse(
            original_text=request.text,
            translated_text=translated_text,
            target_language=request.target_language
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Translation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during translation.")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Language Translator API. Access /docs for Swagger UI."}
