// Footer.js
import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'; // Import icons from Font Awesome
import './Footer.css'; // Import CSS for Footer component styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <h3>Medradar</h3>
          <p>Find Your Needy Hospital</p>
        </div>
        <div className="footer-center">
          <h3>Contact</h3>
          <p>Email: info@medradar.com</p>
          <p>Phone: +1 234 567 890</p>
        </div>
        <div className="footer-right">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Medradar. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
