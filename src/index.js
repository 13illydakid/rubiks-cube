import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorkerRegistration.register();
