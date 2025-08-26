import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext/AuthContext";
import "../../../App.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const { token, logout } = useContext(AuthContext); // ✅ fixed
  const navigate = useNavigate();
  const [isResponsive, setIsResponsive] = useState(false);

  const handleLogout = () => {
    logout(); // ✅ use context logout
    navigate("/login", { replace: true });
    setIsResponsive(false);
  };

  const toggleResponsive = () => {
    setIsResponsive(!isResponsive);
  };

  const handleLinkClick = () => {
    setIsResponsive(false);
  };

  return (
    <div className="bgr">
      <nav className={`navbar ${isResponsive ? "responsive" : ""}`}>
        <img
          className="navbar-brand"
          src="https://cdn-icons-png.flaticon.com/512/5899/5899590.png"
          alt="Logo"
        />

        {/* Left links */}
        <ul className="nav-links left-links">
          {token && <li><Link to="/" onClick={handleLinkClick}>DASHBOARD</Link></li>}
          {token && <li><Link to="/services" onClick={handleLinkClick}>SERVICES</Link></li>}
          {token && <li><Link to="/track-request" onClick={handleLinkClick}>TRACK REQUEST</Link></li>}
          {token && <li><Link to="/faq" onClick={handleLinkClick}>FAQS</Link></li>}
          <li><Link to="/about" onClick={handleLinkClick}>ABOUT US</Link></li>
          <li><Link to="/contact" onClick={handleLinkClick}>CONTACT US</Link></li>
        </ul>

        {/* Right logout/login */}
        <ul className="nav-links right-links">
          {token ? (
            <li>
              <button onClick={handleLogout} className="animated-logout-btn">
                LOGOUT
              </button>
             
            </li>
          ) : (
            <li><Link to="/login" onClick={handleLinkClick}>LOGIN</Link></li>
          )}
        </ul>

        {/* Hamburger icon for mobile */}
        <a href="#!" className="icon" onClick={toggleResponsive}>
          <FontAwesomeIcon className="FabarFontAwesomeIcon" icon={faBars}  />
        </a>
      </nav>
    </div>
  );
}

export default Navbar;
