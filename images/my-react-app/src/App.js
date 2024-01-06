import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import OSCDataDisplay from './OSCDataDisplay';
import PaintingCanvas from './PaintingCanvas';
import OSCPaintingCanvas from './OSCPaintingCanvas';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import PhoneCatalog from './PhoneCatalog';
import Login from './Login';
import CreateUser from './CreateUser';





function App() {
  return (
    <Router>
      <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <Link className="navbar-brand" to="oscpainting">OSC ART</Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
              <li className="nav-item">
                  <Link className="nav-link" to="/oscpainting">OSC Painting Canvas</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/">OSC Data Display</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/test">PhoneCatalog</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Login">Login</Link>
                </li>

              </ul>
          
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<OSCDataDisplay />} />
      
          <Route path="/oscpainting" element={<OSCPaintingCanvas />} />
          <Route path="/test" element={<PhoneCatalog />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;