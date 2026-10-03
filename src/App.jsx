import { useRef, useState } from 'react'
import { ArrowRight, BookOpen, Check, ChevronDown, CircleHelp, FileText, LayoutGrid, Plus, Settings, Sparkles, Upload, X } from 'lucide-react'

const initialDocs = [
  { name: 'Cognitive Psychology — Ch. 4.pdf', meta: '24 pages · 2.8 MB', color: 'mint' },
  { name: 'Lecture notes — Memory Systems.docx', meta: '12 pages · 940 KB', color: 'lilac' },
]

const sampleQuestions = [
  { q: 'Which type of memory temporarily holds a small amount of information in an active, readily available state?', options: ['Episodic memory', 'Working memory', 'Procedural memory', 'Semantic memory'], answer: 1 },
  { q: 'What is the primary role of retrieval cues in memory?', options: ['To erase old memories', 'To create sensory input', 'To help access stored information', 'To reduce attention'], answer: 2 },
  { q: 'The spacing effect suggests that learning is improved when study sessions are…', options: ['Grouped into one session', 'Distributed over time', 'Completed without breaks', 'Limited to recognition'], answer: 1 },
]

function App() {
  const [docs, setDocs] = useState(initialDocs)
  const [dragging, setDragging] = useState(false)
  const [step, setStep] = useState('setup')
  const [loading, setLoading] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [count, setCount] = useState(10)
  const inputRef = useRef(null)

  const addFiles = (files) => {
    const additions = [...files].map((file, i) => ({ name: file.name, meta: `${file.type.includes('pdf') ? 'PDF' : 'Document'} · ${(file.size / 1024 / 1024).toFixed(1)} MB`, color: i % 2 ? 'lilac' : 'mint' }))
    setDocs((current) => [...current, ...additions])
  }

  const generate = () => {
    setLoading(true)
    window.setTimeout(() => { setLoading(false); setStep('quiz') }, 900)
  }

  const answer = (index) => {
    if (selected !== null) return
    setSelected(index)
    if (index === sampleQuestions[questionIndex].answer) setScore((s) => s + 1)
  }

  const next = () => {
    if (questionIndex === sampleQuestions.length - 1) setStep('result')
    else { setQuestionIndex((i) => i + 1); setSelected(null) }
  }

  const reset = () => { setStep('setup'); setQuestionIndex(0); setSelected(null); setScore(0) }

  return (
    <div className="app-shell">
      <header>
        <button className="logo" onClick={reset}><span><Sparkles size={19} /></span>studia</button>
        <nav><button className="nav-active"><LayoutGrid size={16} /> Dashboard</button><button><BookOpen size={16} /> My library</button></nav>
        <div className="header-actions"><button className="help"><CircleHelp size={18} /></button><button className="avatar">AM</button></div>
      </header>

      {step === 'setup' && <main>
        <section className="hero">
          <div className="eyebrow"><Sparkles size={14} /> AI-POWERED STUDY</div>
          <h1>Turn your notes into<br/><em>knowledge.</em></h1>
          <p>Upload your study materials and get a personalized quiz in seconds.<br/>Study smarter, remember longer.</p>
        </section>

        <section className="workspace">
          <div className="panel upload-panel">
            <div className="panel-title"><span>1</span><div><h2>Add your materials</h2><p>We'll use these to create your questions.</p></div></div>
            <div className={`drop-zone ${dragging ? 'dragging' : ''}`} onDragOver={(e) => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }} onClick={() => inputRef.current.click()}>
              <input ref={inputRef} type="file" multiple accept=".pdf,.doc,.docx,.txt,.md" onChange={(e) => addFiles(e.target.files)} />
              <div className="upload-icon"><Upload size={25} /></div>
              <h3>Drop your files here</h3><p>or <button>browse from your computer</button></p><small>PDF, DOCX or TXT · Up to 20 MB each</small>
            </div>
            <div className="files-head"><span>YOUR FILES</span><span>{docs.length} files</span></div>
            <div className="file-list">
              {docs.map((doc, i) => <div className="file" key={`${doc.name}-${i}`}><div className={`file-icon ${doc.color}`}><FileText size={20} /></div><div><strong>{doc.name}</strong><small>{doc.meta}</small></div><span className="ready"><Check size={12} /> Ready</span><button aria-label={`Remove ${doc.name}`} onClick={() => setDocs(docs.filter((_, index) => index !== i))}><X size={17} /></button></div>)}
            </div>
            <button className="add-more" onClick={() => inputRef.current.click()}><Plus size={16} /> Add more files</button>
          </div>

          <div className="panel settings-panel">
            <div className="panel-title"><span>2</span><div><h2>Customize your quiz</h2><p>Choose how you want to be tested.</p></div></div>
            <label>NUMBER OF QUESTIONS</label>
            <div className="count-options">{[5, 10, 15, 20].map(n => <button className={count === n ? 'selected' : ''} onClick={() => setCount(n)} key={n}>{n}</button>)}</div>
            <label>DIFFICULTY</label>
            <div className="select-wrap"><select defaultValue="Balanced"><option>Easy</option><option>Balanced</option><option>Challenging</option></select><ChevronDown size={16}/></div>
            <label>QUESTION TYPES</label>
            <div className="type-cards"><button className="active"><span><Check size={13}/></span><div><strong>Multiple choice</strong><small>Choose one correct answer</small></div></button><button><span></span><div><strong>True or false</strong><small>Quick knowledge checks</small></div></button><button><span></span><div><strong>Short answer</strong><small>Explain in your own words</small></div></button></div>
            <button className="generate" disabled={!docs.length || loading} onClick={generate}>{loading ? 'Reading your materials…' : <><Sparkles size={17}/> Generate my quiz <ArrowRight size={17}/></>}</button>
            <p className="hint"><Settings size={13}/> You can change these settings anytime</p>
          </div>
        </section>
        <div className="trust"><span><Check size={13}/> Your files are private and secure</span><i></i><span>Questions generated in ~10 seconds</span><i></i><span>No account required</span></div>
      </main>}

      {step === 'quiz' && <main className="quiz-page">
        <div className="quiz-top"><div><span>QUIZ IN PROGRESS</span><h2>Memory & Cognition</h2></div><strong>{questionIndex + 1} <small>/ {sampleQuestions.length}</small></strong></div>
        <div className="progress"><i style={{width: `${((questionIndex + 1) / sampleQuestions.length) * 100}%`}} /></div>
        <section className="question-card"><div className="question-number">QUESTION {questionIndex + 1}</div><h1>{sampleQuestions[questionIndex].q}</h1><div className="answers">{sampleQuestions[questionIndex].options.map((option, i) => <button key={option} className={selected === null ? '' : i === sampleQuestions[questionIndex].answer ? 'correct' : selected === i ? 'wrong' : ''} onClick={() => answer(i)}><span>{String.fromCharCode(65 + i)}</span>{option}{selected !== null && i === sampleQuestions[questionIndex].answer && <Check size={18}/>}</button>)}</div>{selected !== null && <div className="feedback"><Sparkles size={17}/><div><strong>{selected === sampleQuestions[questionIndex].answer ? 'Exactly right!' : 'Not quite — keep going.'}</strong><p>Working memory keeps information available while we actively use and process it.</p></div></div>}<div className="quiz-actions"><button onClick={reset}>Exit quiz</button><button className="next" disabled={selected === null} onClick={next}>{questionIndex === sampleQuestions.length - 1 ? 'See results' : 'Next question'} <ArrowRight size={16}/></button></div></section>
      </main>}

      {step === 'result' && <main className="result-page"><section><div className="result-icon"><Sparkles size={30}/></div><span>QUIZ COMPLETE</span><h1>Nice work!</h1><p>You're building strong foundations in Memory & Cognition.</p><div className="score"><strong>{score}/{sampleQuestions.length}</strong><span>questions correct</span></div><button className="generate" onClick={reset}>Create another quiz <ArrowRight size={17}/></button></section></main>}
    </div>
  )
}

export default App
