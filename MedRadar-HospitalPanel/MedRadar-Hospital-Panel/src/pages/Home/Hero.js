// Hero.js
import React from 'react';
import doctorsImage from './images/doctors.jpg'; // Import your image here
import './Hero.css'; // Import CSS for Hero component styling

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="text-container">
          <h1>Find &amp; <span className="highlight">Search Your Needy Hospital</span></h1>
          <p>Healthcare for Today, Tomorrow, and Forever</p>
          <button>Find a Hospital</button>
        </div>
        <div className="image-container">
          <img src={doctorsImage} alt="Doctors" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
