import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000'; // FastAPI default port

const Translator = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('hi');
  const [languages, setLanguages] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState('');
  const [isFirstLoad, setIsFirstLoad] = useState(false);

  // Fetch supported languages on mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/languages`);
        setLanguages(response.data.supported_languages);
      } catch (err) {
        console.error("Failed to fetch languages:", err);
        // Fallback languages if backend isn't ready
        setLanguages([
          { code: 'hi', name: 'Hindi' },
          { code: 'es', name: 'Spanish' },
          { code: 'fr', name: 'French' }
        ]);
      }
    };
    fetchLanguages();
  }, []);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);
    setError('');
    
    // Set a flag to warn the user if it's potentially loading a new model
    if (!translatedText) {
      setIsFirstLoad(true);
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/translate`, {
        text: inputText,
        target_language: targetLanguage
      });
      setTranslatedText(response.data.translated_text);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'An error occurred during translation. Is the backend running?');
    } finally {
      setIsTranslating(false);
      setIsFirstLoad(false);
    }
  };

  return (
    <>
      <div className="translator-grid">
        <div className="input-section">
          <div className="section-header">
            <label>English (Auto-Detect)</label>
          </div>
          <textarea 
            placeholder="Enter text to translate..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTranslating}
          />
        </div>

        <div className="output-section">
          <div className="section-header">
            <label>Target Language</label>
            <select 
              value={targetLanguage} 
              onChange={(e) => {
                setTargetLanguage(e.target.value);
                setTranslatedText(''); // Clear output on language change
              }}
              disabled={isTranslating}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className={`output-box ${isTranslating ? 'pulse' : ''}`}>
            {isTranslating ? (
              <div className="empty-state">
                <Loader2 className="spinner" size={32} />
                <p>Translating...</p>
                {isFirstLoad && <small style={{color: '#94a3b8', fontSize: '0.8rem'}}>First request may take up to 30s as the model loads into memory.</small>}
              </div>
            ) : translatedText ? (
              <p>{translatedText}</p>
            ) : error ? (
              <div className="empty-state" style={{color: '#ef4444'}}>
                <p>{error}</p>
              </div>
            ) : (
              <div className="empty-state">
                <Sparkles size={32} opacity={0.5} />
                <p>Translation will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="action-row">
        <button 
          onClick={handleTranslate} 
          disabled={isTranslating || !inputText.trim()}
        >
          {isTranslating ? (
            <>
              <Loader2 className="spinner" size={20} />
              Processing
            </>
          ) : (
            <>
              Translate
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default Translator;
