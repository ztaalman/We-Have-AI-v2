import React from 'react';
import styles from './Contact.module.css';

const Contact = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const result = document.getElementById('result');
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    object.access_key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY; // Access key from env
    const json = JSON.stringify(object);
    result.style.display = 'block'; // Make the result visible
    result.innerHTML = "Please wait...";

    console.log('Submitting form with data:', object); // Log the data being sent

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      });

      console.log('Received response:', response); // Log the entire response object

      const jsonResponse = await response.json();
      console.log('Received JSON response:', jsonResponse); // Log the JSON response

      if (response.status === 200) {
        result.innerHTML = "Form submitted successfully";
      } else {
        console.log('Error submitting form:', jsonResponse); // Log the JSON response for better error details
        result.innerHTML = jsonResponse.message;
      }
    } catch (error) {
      console.error('An error occurred:', error); // Log any exceptions
      result.innerHTML = "Something went wrong!";
    } finally {
      form.reset();
      setTimeout(() => {
        result.style.display = "none";
      }, 3000);
    }
  };

  return (
    <div className={styles.contactContainer}>
      <h1>Contact Us</h1>
      <div className={styles.contactContent}>
        <div className={styles.contactInfo}>
          <h2>Get in Touch</h2>
          <p>
            Have questions or feedback? We'd love to hear from you.
            Fill out the form and we'll get back to you as soon as possible.
          </p>
          <div className={styles.contactDetails}>
            <div className={styles.contactItem}>
              <h3>Email</h3>
              <p>zach@wehave.ai</p>
            </div>
            <div className={styles.contactItem}>
              <h3>Location</h3>
              <p>Chicago, IL</p>
            </div>
          </div>
        </div>

        <form className={styles.contactForm} id="form" onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              required
              rows="5"
            ></textarea>
          </div>
          <input type="checkbox" name="botcheck" className={styles.hidden} style={{ display: 'none' }}></input>
          <button type="submit" className={styles.submitBtn}>Send Message</button>
          <div id="result"></div>
        </form>
      </div>
    </div>
  );
};

export default Contact; 