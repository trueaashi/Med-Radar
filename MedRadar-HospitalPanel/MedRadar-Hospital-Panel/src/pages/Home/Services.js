// Services.js
import React from 'react';
import './Services.css'; // Import CSS for Services component styling

const Services = () => {
  return (
    <section className="services">
      <h2 className="section-heading">Our Service Specialists and Amenities</h2>
      <div className="container">
        <div className="service">
          <h3>Covid-19 Testing</h3>
          <p>Get tested for Covid-19 quickly and safely with our reliable testing services.</p>
        </div>
        <div className="service">
          <h3>Heart and Lung Services</h3>
          <p>Comprehensive care for heart and lung conditions to keep you healthy and active.</p>
        </div>
      </div>
      <div className="container">
        <div className="service">
          <h3>Supplements</h3>
          <p>Discover our range of high-quality supplements to support your health and wellness goals.</p>
        </div>
        <div className="service">
          <h3>Mental Health Services</h3>
          <p>Expert care and support for mental health concerns to help you live a fulfilling life.</p>
        </div>
      </div>
    </section>
  );
}

export default Services;
