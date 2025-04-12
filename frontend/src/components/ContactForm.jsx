import React, { useState } from "react";
import axios from "axios";
import "../../styles/contactform.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await axios.post("http://localhost:5001/api/contact", formData);
      setStatus(res.data.message);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      setStatus("Error sending message.");
    }
  };

  return (
    <div className="contact-form-container">
      <h2>Contact the Team</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <input type="text" name="name" placeholder="Name" required value={formData.name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone Number" required value={formData.phone} onChange={handleChange} />
        <input type="text" name="subject" placeholder="Subject" required value={formData.subject} onChange={handleChange} />
        <textarea name="message" placeholder="Message" required value={formData.message} onChange={handleChange} />
        <button type="submit">Submit</button>
        <p className="form-status">{status}</p>
      </form>
    </div>
  );
};

export default ContactForm;
