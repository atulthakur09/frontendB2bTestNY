import React from 'react';
import './Footer.css';
// footer icon
import FACEBOOK from "../../images/facebook.svg";
import INSTAGRAM from "../../images/instagram.svg";
import TWITTER from "../../images/twitter.svg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Contact Us Section */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>📍 #191, Subbarama Chetty Road, Nettakallappa Circle, Basavanagudi, Bangalore South, Bangalore- 560004, Karnataka..</p>
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
        <p>
          
        </p>
        <div className="footer-icons">
          <span><img src={FACEBOOK} alt="Dr. MechNY Logo" style={{ width: '40px', height: '40px' }} /></span> {/* Replace with icons */}<span><img src={INSTAGRAM} alt="Dr. MechNY Logo" style={{ width: '40px', height: '40px' }} /></span><span><img src={TWITTER} alt="Dr. MechNY Logo" style={{ width: '40px', height: '40px' }} /></span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
