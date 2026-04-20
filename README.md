# Lexa Translate: Private Sequence-to-Sequence Local Translator

Lexa Translate is a modern, fast, and completely private translation application. By leveraging pre-trained Hugging Face *Opus-MT* Sequence-to-Sequence models locally, your text data is never sent to a third-party API (like Google or OpenAI). All translation logic happens entirely on your machine.

With a beautiful React/Vite frontend using modern glassmorphism aesthetics and a highly concurrent Python/FastAPI backend, the system represents state-of-the-art applied machine learning.

![Lexa Translate UI Demo](https://images.unsplash.com/photo-1546422904-90eab23c3d7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80) 
*(Demo representation of neural network abstraction, as actual UI runs locally)*

---

## 🏗 System Architecture

The application is split into two independent domains:

1. **Backend (`/backend`)**: A robust Python API powered by `FastAPI` and `transformers`. We use the `Helsinki-NLP/opus-mt` Sequence-to-Sequence models for translating English text to local target languages (Hindi, Spanish, French).
   - **Lazy Loading**: Huge ML models are not loaded until they are requested by the user, drastically speeding up application boot time and reducing RAM overhead if only one language is used.
2. **Frontend (`/frontend`)**: A blazing-fast `Vite + React` client. Includes custom dark-mode aesthetics, responsive CSS grids, and smooth animations during the inference delay.


## 🚀 Getting Started

Follow these step-by-step instructions to get the application running on your local machine. Ensure you have **Python 3.8+** and **Node.js (18+)** installed.

### ⚡ Easy Auto-Start (Windows)

We've provided a simple batch script to automatically load both the React Frontend and the Python Backend at the same time:

1. Double-click the `start.bat` file located in the root of the project directory.
2. It will open two new terminal windows that automatically handle activation and starting the servers. 
3. Once fully loaded, open your browser to `http://localhost:5173`.

---

### 🛠 Manual Start (Mac, Linux, or alternative)

### Step 1: Start the Translation Backend

The backend needs to parse input text through PyTorch models. We use a virtual environment to manage dependencies locally.

1. Open a new terminal and navigate to the project directory:
   ```bash
   cd Desktop/LanguageTranslatorApp/backend
   ```
2. Activate the Python virtual environment:
   ```bash
   # On Windows:
   .\venv\Scripts\activate
   ```
3. Run the FastAPI server via Uvicorn:
   ```bash
   uvicorn main:app --reload
   ```
   > You should see output indicating that UVICORN is running on `http://127.0.0.1:8000`. Leave this terminal running.*

### Step 2: Start the React Frontend

Now, we need to run the UI client.

1. Open a **second, separate terminal** and navigate to the frontend folder:
   ```bash
   cd Desktop/LanguageTranslatorApp/frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to the URL provided (usually `http://localhost:5173`).

---

## 🧠 Using the App (What to Expect)

1. Type an English sentence in the left dialogue box.
2. Select your target language. By default:
   - **Hindi**
   - **Spanish**
   - **French**
3. Click **"Translate"**.
   - **Note on the First Translation:** Because these are Sequence-to-Sequence neural networks, the *very first time* you translate a language, the Python backend must load the ~300MB model into your computer's RAM. This might take **15-30 seconds** on the first request. The React UI will show a pulsing animation while this happens.
   - **Subsequent Translations:** Will be lightning-fast (usually under 2 seconds depending on CPU/GPU power).

---

## 🛠 Troubleshooting

* **"Failed to load resource: the server responded with a status of 422 Unprocessable Entity"**
  Ensure the backend is running. If it's running but failing, check the python backend terminal logs to ensure models downloaded correctly without internet interruptions.
* **Backend cannot find `main.py`**
  Make sure your terminal is actually *inside* the `backend/` directory when running `uvicorn main:app --reload`.
* **"File cannot be loaded because running scripts is disabled on this system." (Powershell Execution Policy)**
  Open your command prompt (`cmd.exe`) rather than Powershell to run the activation scripts, or run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` in powershell.

Enjoy private, professional-grade offline translations!
