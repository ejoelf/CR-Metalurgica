import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/global.css';
import './styles/fixes.css';
import './styles/neo-industrial.css';
import './styles/layout-fixes.css';
import './styles/atelier.css';
import './styles/editorial-industrial.css';
import './styles/foundry.css';
import './styles/brand-logo.css';
import './styles/navbar-refinements.css';
import './styles/hero-refinements.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
