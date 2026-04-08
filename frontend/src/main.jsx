import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { HistoryProvider } from './context/HistoryContext.jsx'

createRoot(document.getElementById('root')).render(
    <AuthContextProvider>
      <HistoryProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HistoryProvider>
    </AuthContextProvider>,
)
