import React, { useState , useRef , useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [division, setDivision] = useState("");
  const [subject, setSubject] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-logo">MyApp</div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/about" className="nav-item">About Us</Link>
        <Link to="/contacts" className="nav-item">Contacts</Link>
        <button className="edit-button" onClick={() => setShowForm(!showForm)}>Edit</button>
      </div>

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX /> : <FiMenu />}
      </div>

      {/* Edit Form */}
      {showForm && (
        <div className="edit-form"  ref={formRef}>      
          <label>Division:</label>
          <select value={division} onChange={(e) => setDivision(e.target.value)}>
            <option value="">Select Division</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>

          <label>Subject:</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">Select Subject</option>
            <option value="WT">WT</option>
            <option value="CC">CC</option>
            <option value="AI">AI</option>
            <option value="DSBDA">DSBDA</option>
          </select>

          <button className="curled-submit">Submit</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
