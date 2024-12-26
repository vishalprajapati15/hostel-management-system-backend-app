// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RoomManagement from './components/RoomManagement';
import StudentManagement from './components/StudentManagement';
import Allocations from './components/Allocations';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h1>Hostel Management System</h1>
          <div className="nav-links">
            <Link to="/">Rooms</Link>
            <Link to="/students">Students</Link>
            <Link to="/allocations">Allocations</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<RoomManagement />} />
          <Route path="/students" element={<StudentManagement />} />
          <Route path="/allocations" element={<Allocations />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;