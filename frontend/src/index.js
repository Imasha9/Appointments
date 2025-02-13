// src/index.js (for React 18+)
import React from 'react';
import ReactDOM from 'react-dom/client'; // Ensure you import from 'react-dom/client'
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
