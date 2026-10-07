import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import LoginScreen from './coach/LoginScreen.jsx'

// Note: intentionally not wrapped in <StrictMode> — its dev-mode double-invoke
// of effects causes camera streams (getUserMedia / html5-qrcode) to be opened
// and torn down in rapid succession, which many browsers/devices handle badly.
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginScreen mode="login" />} />
      <Route path="/signup" element={<LoginScreen mode="signup" />} />
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>,
)
