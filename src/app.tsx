
import { useState, useMemo, useEffect } from 'react'
import './App.css'
import type { ActivityType, ActivityConfig, SequenceConfig } from './types'
import { SEQUENCES, CASE_STUDIES } from './constants/sequences'
import { generateSequence, checkPalindrome, runDivisionAlgorithm, runEuclideanAlgorithm, generateCollatz } from './utils/math'

const formatNumber = (num: number) => num.toLocaleString();

const TypingText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('')
  
  useEffect(() => {
    setDisplayedText('')
    let i = 0
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i))
      i++
      if (i >= text.length) clearInterval(timer)
    }, 20)
    return () => clearInterval(timer)
  }, [text])

  return <p className="typing-text">{displayedText}</p>
}

const MatrixRain = () => {
  useEffect(() => {
    const canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%&@#'.split('')
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops: number[] = []

    for (let i = 0; i < columns; i++) {
      drops[i] = 1
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 12, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#ff66b2' // Razer Pink
      ctx.font = fontSize + 'px monospace'

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)
    
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas id="matrix-canvas" style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, opacity: 0.3 }} />
}

function App() {
  const [view, setView] = useState<'menu' | 'activity'>('menu')
  const [selectedType, setSelectedType] = useState<ActivityType | null>(null)
  const [inputValue, setInputValue] = useState<string>('')
  const [inputB, setInputB] = useState<string>('') // For division algorithm
  
  const config = useMemo(() => {
    if (!selectedType) return null
    return (SEQUENCES[selectedType] || CASE_STUDIES[selectedType]) as ActivityConfig
  }, [selectedType])

  const handleSelect = (type: ActivityType) => {
    setSelectedType(type)
    setInputValue('')
    setInputB('')
    setView('activity')
  }

  const warning = useMemo(() => {
    if (!selectedType) return null
    if (!inputValue && !inputB) return null

    if (selectedType in SEQUENCES) {
      const res = generateSequence(SEQUENCES[selectedType] as SequenceConfig, inputValue)
      return res.status !== 'Valid' && inputValue ? res.message : null
    }

    if (selectedType === 'division-algorithm' || selectedType === 'euclidean') {
      const a = parseInt(inputValue)
      const b = parseInt(inputB)
      
      if (inputValue && isNaN(a)) return 'First integer (a) must be a numeric value.'
      if (inputB && isNaN(b)) return 'Second integer (b) must be a numeric value.'
      
      if (inputValue && !isNaN(a) && a <= 0) return 'First integer (a) must be a positive number (greater than 0).'
      if (inputB && !isNaN(b) && b <= 0) return 'Second integer (b) must be a positive number (greater than 0).'
      
      return null
    }

    if (selectedType === 'collatz') {
      const n = parseInt(inputValue)
      if (inputValue && isNaN(n)) return 'Please enter a numeric integer.'
      if (inputValue && !isNaN(n) && n <= 0) return 'Collatz sequence requires a positive integer.'
    }

    return null
  }, [selectedType, inputValue, inputB])

  const renderResults = () => {
    if (!selectedType || warning) return null

    if (selectedType in SEQUENCES) {
      const res = generateSequence(SEQUENCES[selectedType] as SequenceConfig, inputValue)
      if (res.status === 'Valid' && res.terms.length > 0) {
        return (
          <div className="results-list">
            <p>The {config?.name} are: </p>
            <div className="scrollable-results">
              {res.terms.map(formatNumber).join(', ')}
            </div>
          </div>
        )
      }
      return null
    }

    if (selectedType === 'palindrome') {
      if (!inputValue.trim()) return null
      const res = checkPalindrome(inputValue)
      return (
        <div className="palindrome-result">
          <p>Cleaned: <strong>{res.cleanInput}</strong></p>
          <p>Reversed: <strong>{res.reversed}</strong></p>
          <p className={res.isPalindrome ? 'success' : 'error'}>
            {res.isPalindrome ? '✅ VALID PALINDROME DETECTED' : '❌ NOT A PALINDROME'}
          </p>
        </div>
      )
    }

    if (selectedType === 'division-algorithm' || selectedType === 'euclidean') {
      const a = parseInt(inputValue)
      const b = parseInt(inputB)
      
      if (!isNaN(a) && !isNaN(b)) {
        if (selectedType === 'division-algorithm') {
          const res = runDivisionAlgorithm(a, b)
          return (
            <div className="division-results">
              <p><strong>Solution:</strong></p>
              <p className="formula-box">
                {formatNumber(res.dividend)} = {formatNumber(res.divisor)}({formatNumber(res.quotient)}) + {formatNumber(res.remainder)}
              </p>
              <div className="details-box">
                <p>The dividend is {formatNumber(res.dividend)}</p>
                <p>The divisor is {formatNumber(res.divisor)}</p>
                <p>The quotient is {formatNumber(res.quotient)} and the remainder is {formatNumber(res.remainder)}</p>
              </div>
            </div>
          )
        } else {
          const res = runEuclideanAlgorithm(a, b)
          return (
            <div className="division-results">
              <h3>Iteration Steps:</h3>
              <ul className="steps-list">
                {res.steps.map((s, i) => (
                  <li key={i}>
                    {formatNumber(s.dividend)} = {formatNumber(s.divisor)}({formatNumber(s.quotient)}) + {formatNumber(s.remainder)}
                  </li>
                ))}
              </ul>
              <div className="summary-box">
                <p><strong>GCD:</strong> {formatNumber(res.gcd)}</p>
                <p><strong>LCM:</strong> {formatNumber(res.lcm)}</p>
              </div>
            </div>
          )
        }
      }
      return null
    }

    if (selectedType === 'collatz') {
      const n = parseInt(inputValue)
      if (!isNaN(n)) {
        const seq = generateCollatz(n)
        return (
          <div className="results-list">
            <p>The Collatz sequence for {formatNumber(n)} is:</p>
            <div className="scrollable-results">
              {seq.map(formatNumber).join(' → ')}
            </div>
          </div>
        )
      }
      return null
    }

    return null
  }

  return (
    <div className="dashboard">
      <MatrixRain />
      <header className="header">
        <h1>Case Studies</h1>
      </header>

      {view === 'menu' ? (
        <div className="menu-container">
          <nav className="menu-list">
            <button onClick={() => handleSelect('palindrome')}>Palindrome Checker</button>
            <button onClick={() => handleSelect('division-algorithm')}>Division Algorithm</button>
            <button onClick={() => handleSelect('euclidean')}>Euclidean Algorithm (GCD & LCM)</button>
            <button onClick={() => handleSelect('collatz')}>Collatz Sequence</button>
            
            <div className="submenu-list">
              <button onClick={() => handleSelect('fibonacci')}>Fibonacci Numbers</button>
              <button onClick={() => handleSelect('lucas')}>Lucas Numbers</button>
              <button onClick={() => handleSelect('tribonacci')}>Tribonacci Numbers</button>
            </div>

            <button className="exit-btn" onClick={() => {
              window.open('', '_self', ''); 
              window.close();
              // Fallback for browsers that block script-initiated closing
              setTimeout(() => {
                alert("SYSTEM SHUTDOWN INITIATED: Please close this tab manually to complete the process.");
              }, 200);
            }}>Exit System</button>
          </nav>
        </div>
      ) : config ? (
        <div className="activity-container">
          <button className="back-btn" onClick={() => setView('menu')}>← Back to Menu</button>
          <h2>{config.name}</h2>
          <div className="discussion">
            {selectedType && selectedType in SEQUENCES && (
              <div className="image-placeholder">
                <img 
                  src={`/${config.id}-discussion.png`} 
                  alt={`${config.name} Discussion`} 
                  key={config.id}
                />
              </div>
            )}
            <p><strong>Formula/Description:</strong></p>
            <TypingText text={config.formula || config.discussion} />
          </div>
          
          <div className="input-section">
            {selectedType === 'division-algorithm' || selectedType === 'euclidean' ? (
              <>
                <div className="input-group">
                  <label>First Integer (a): </label>
                  <input 
                    type="number" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g. 48"
                  />
                </div>
                <div className="input-group">
                  <label>Second Integer (b): </label>
                  <input 
                    type="number" 
                    value={inputB} 
                    onChange={(e) => setInputB(e.target.value)}
                    placeholder="e.g. 18"
                  />
                </div>
              </>
            ) : (
              <div className="input-group">
                <label>{selectedType === 'palindrome' ? 'Input Text: ' : 'Input Number: '}</label>
                <input 
                  type={selectedType === 'palindrome' ? 'text' : 'number'} 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={selectedType === 'palindrome' ? 'e.g. racecar' : 'e.g. 5'}
                />
              </div>
            )}
          </div>

          {warning && (
            <div className="warning-container">
              <p className="error-message">⚠️ {warning}</p>
            </div>
          )}

          <div className="results-area">
            {renderResults()}
          </div>
        </div>
      ) : null}

      <footer className="footer">
        <p>Arcilla, Calica, Camacho, Carullo, Santos, Tucker III-CCASD | Automata Lab Exercise Finals</p>
      </footer>
    </div>
  )
}

export default App
