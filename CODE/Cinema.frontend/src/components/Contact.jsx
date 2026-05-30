function Contact() {
  return (
    <section id="contact" className="info-section contact-section">
      <div className="section-heading">
        <span>Contact</span>
        <h2>Get in touch</h2>
        <p>
          For questions about movies, reservations or cinema services, contact the support team.
        </p>
      </div>

      <div className="contact-layout">
        <div className="contact-card">
          <h3>Cinema location</h3>
          <p>Cluj-Napoca Central, Romania</p>
          <p>Program: Monday - Sunday, 10:00 - 23:00</p>
        </div>

        <div className="contact-card">
          <h3>Contact details</h3>
          <p>Email: support@lumierecinema.ro</p>
          <p>Phone: +40 700 000 000</p>
        </div>

        <form className="contact-form">
          <input placeholder="Your name" />
          <input placeholder="Email address" />
          <textarea placeholder="Message" />
          <button type="button">Send Message</button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
