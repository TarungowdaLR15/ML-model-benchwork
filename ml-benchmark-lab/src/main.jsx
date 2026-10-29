import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

const rootEl = document.getElementById('root')
if (!rootEl) {
  document.body.innerHTML =
    '<pre style="color:#f87171;background:#0a0e1a;padding:24px;font-family:monospace">' +
    'Fatal: #root element missing from index.html</pre>'
  throw new Error('#root not found')
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)