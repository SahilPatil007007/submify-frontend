import { useState } from 'react'
import viteLogo from '/vite.svg'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './App.css'
import LoginSignup from './components/LoginSignup'
import Welcome from './components/Welcome';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/welcome" element={<Welcome />} />
      </Routes>
    </Router>
  )
}

export default App
