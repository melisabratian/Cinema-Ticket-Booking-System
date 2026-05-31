import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Subject: "",
    Message: ""
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });

    setErrorMessage("");
    setSuccessMessage("");
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (formData.FullName.trim().length < 2) {
      setErrorMessage("Please enter a valid name.");
      return;
    }

    if (!isValidEmail(formData.Email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (formData.Message.trim().length < 10) {
      setErrorMessage("Please write a message of at least 10 characters.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not send message.");
      }

      setSuccessMessage("Your message has been sent successfully.");
      setErrorMessage("");

      setFormData({
        FullName: "",
        Email: "",
        Subject: "",
        Message: ""
      });
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  }

  return (
    <section id="contact" className="info-section contact-section">
      <div className="section-heading">
        <span>Contact</span>
        <h2>Get in touch</h2>
        <p>
          For questions about movies, reservations or cinema services, contact
          the support team.
        </p>
      </div>

      <div className="contact-layout">
        <div className="contact-card">
          <h3>Cinema location</h3>
          <p>Cluj-Napoca Central, Romania</p>
          <p>Program: Monday - Sunday, 15:00 - 24:00</p>
        </div>

        <div className="contact-card">
          <h3>Contact details</h3>
          <p>Email: support@amccinema.ro</p>
          <p>Phone: +40 374 132 001</p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="FullName"
            placeholder="Your name"
            value={formData.FullName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="Email"
            placeholder="Email address"
            value={formData.Email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="Subject"
            placeholder="Subject"
            value={formData.Subject}
            onChange={handleChange}
          />

          <textarea
            name="Message"
            placeholder="Message"
            value={formData.Message}
            onChange={handleChange}
            required
          />

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
}

export default Contact;