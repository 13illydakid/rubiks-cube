import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'

const routing = (
  <Router>
    <Routes>
      <Route path="*" element={<App />} />
    </Routes>
  </Router>
)
const container = document.getElementById('root');
const root = createRoot(container);
root.render(routing);

// Service worker disabled during migration. Consider adding vite-plugin-pwa to restore PWA later.
