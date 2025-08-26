import React from "react";
import "./Contact_Us.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const ContactUs = () => {
  return (
    <div className="contact-page">

      {/* Banner */}
      <div className="contact-banner">
        <h1>Contact Us</h1>
      </div>

      {/* Main Section */}
      <div className="contact-main">

        {/* Google Map */}
        <div className="contact-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d4490.705142484458!2d75.56225672598542!3d21.013766980631875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sgolani%20market%20Jalgaon!5e1!3m2!1sen!2sus!4v1755681759075!5m2!1sen!2sus"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Google Map"
          ></iframe>
        </div>

        {/* Contact Info */}
        <div className="contact-info">
          <p>📞 +466723723666</p>
          <p>📍 Hanuman Nagar, Jalgaon</p>

          {/* Email */}
          <p>
            <FontAwesomeIcon icon={faEnvelope} />{" "}
            <a   href="https://mail.google.com/mail/?view=cm&fs=1&to=wmall.help@gmail.com.com&su=Subject&body=Hello"
  target="_blank"
  rel="noopener noreferrer"
  className="Email"
>wmall.help@gmail.com</a>
          </p>

          {/* Social Media Links */}
          <div className="social-links">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} size="2x" />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} size="2x" />
            </a>
            <a href="mailto:contact@admin.com">
              <FontAwesomeIcon icon={faEnvelope} size="2x" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactUs;
