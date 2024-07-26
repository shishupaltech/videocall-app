import React from 'react';
import ReactDOM from 'react-dom/client'; // Ensure this import is used
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import { SocketProvider } from './context/SocketContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <SocketProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/call/:id" element={<App />} />
      </Routes>
    </SocketProvider>
  </Router>
);
