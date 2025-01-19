import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import Chat from './Chat';
import Home from './home';
import Profile from './profile';
import { HomeIcon, ChatIcon, ProfileIcon } from './Icons';
import './App.css';
import bgImage from './assets/bg2.jpg';

function App() {
  return (
    <Router>
      <div className="App" style={{ 
        backgroundColor: '#000000',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh'
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        
        <nav className="bottom-nav">
          <NavLink to="/" className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''}`
          }>
            <HomeIcon />
            <span>Home</span>
          </NavLink>
          <NavLink to="/chat" className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''}`
          }>
            <ChatIcon />
            <span>Chat</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''}`
          }>
            <ProfileIcon />
            <span>Profile</span>
          </NavLink>
        </nav>
      </div>
    </Router>
  );
}

export default App;
