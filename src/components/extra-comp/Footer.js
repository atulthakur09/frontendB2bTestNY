import React from "react";
import "./Footer.css";
// footer icon
import FACEBOOK from "../../images/facebook.svg";
import INSTAGRAM from "../../images/instagram.svg";
import TWITTER from "../../images/twitter.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faFacebook,
  faInstagram,
  faTwitter,
  faYoutube,
  faLinkedin   } from '@fortawesome/free-brands-svg-icons';  // Example icons


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Contact Us Section */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>
            📍 #191, Subbarama Chetty Road, Nettakallappa Circle, Basavanagudi,
            Bangalore South, Bangalore- 560004, Karnataka..
          </p>
          <p>📞 +91-1111111111 10am-6pm, Mon-Sat</p>
          <p>📧 dr.MechNY@gmail.com</p>
        </div>

        {/* Policies & Info Section */}
        <div className="footer-section">
          <h4>Policies & Info</h4>
          <ul>
            <li>Terms Conditions</li>
            <li>Shipping & Refund</li>
            <li>Wholesale Policy</li>
          </ul>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>Home</li>
            <li>Products</li>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Shipping & Refund</li>
          </ul>
        </div>

        {/* Subscribe Section */}
        <div className="footer-section">
          <h4>Subscribe Us</h4>
          <p>For new updates</p>
          <input type="text" placeholder="Enter your email" />
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p></p>
        <div className="footer-icons">
      <span>
        <a
          href="https://www.instagram.com/drmechny/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={INSTAGRAM}
            alt="Instagram"
            style={{ width: '40px', height: '40px' }}
          />
        </a>
      </span>
      <span>
        <a
          href="https://x.com/DrMechny"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={TWITTER}
            alt="Twitter"
            style={{ width: '40px', height: '40px' }}
          />
        </a>
      </span>
      <span>
        <a
          href="https://www.youtube.com/channel/UCyRLCLvr77qhDP93xhU0HvA"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon
            icon={faYoutube}
            style={{ color: '#e11414', fontSize: '40px' }}
          />
        </a>
      </span>
      <span>
        <a
          href="https://www.linkedin.com/company/drmechny/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon
            icon={faLinkedin}
            style={{ color: '#0077b5', fontSize: '40px' }}
          />
        </a>
      </span>
    </div>
      </div>
    </footer>
  );
};

export default Footer;
