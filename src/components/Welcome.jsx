// Welcome.jsx
import React from 'react';
import {Link} from 'react-router-dom';
import Navbar from './Navbar';  
import './Welcome.css';
import Slider from "react-slick";

const subjects = ["WT", "CC", "DSBDA", "AI"];

const Welcome = () => {
  return (
    <div className="welcome-container">
      <Navbar />
      <div className="adjacent-box-section">
        {[1, 2, 3, 4].map((division) => (
          <div key={division} className="division-box-row">
            <h2>Division {division}</h2>
            <div className="box-carousel">
              {subjects.map((subject, i) => (
                <div key={i} className="subject-box">
                  {subject}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Welcome;
