import React from 'react'
import Translator from './components/Translator'
import './index.css'

function App() {
  return (
    <>
      <h1>Lexa Translate</h1>
      <p className="subtitle">Instant, private, and local sequence-to-sequence translation.</p>
      <div className="glass-card">
        <Translator />
      </div>
    </>
  )
}

export default App
