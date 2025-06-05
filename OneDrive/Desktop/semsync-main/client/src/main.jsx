// App.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SubjectProvider } from "./context/SubjectContext"; // Changed import

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <SubjectProvider>  {/* Changed provider */}
        <App />
      </SubjectProvider>
    </StrictMode>
  </BrowserRouter>,
)