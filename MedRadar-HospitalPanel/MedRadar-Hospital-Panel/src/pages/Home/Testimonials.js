// Testimonials.js
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa'; // Importing star icon from Font Awesome
import './Testimonials.css'; // Import CSS for Testimonials component styling

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // State to manage current index of displayed review

  // Array of reviews
  const reviews = [
    {
      content: "The services provided through Medradar are truly amazing. Thank you so much!!",
      author: "John Doe",
    },
    {
      content: "Excellent service! Medradar helped me find the right hospital in no time.",
      author: "Jane Smith",
    },
    {
      content: "I'm extremely satisfied with Medradar's services. Highly recommended!",
      author: "David Brown",
    },
  ];

  // Function to handle click event on next button
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  // Function to handle click event on previous button
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="testimonials">
      <div className="description">
        <div className="left">
          <h2>What Our Members Are Saying About Us</h2>
          <p>The valuable feedback from our fittest customers.</p>
        </div>
      </div>
      <div className="testimonials-container">
        <div className="testimonial">
          <div className="stars">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>
          <div className="testimonial-content">
            <p>"{reviews[currentIndex].content}"</p>
            <p>- {reviews[currentIndex].author}</p>
          </div>
        </div>
      </div>
      <div className="controls">
        <button onClick={handlePrev}>Previous</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </section>
  );
}

export default Testimonials;
