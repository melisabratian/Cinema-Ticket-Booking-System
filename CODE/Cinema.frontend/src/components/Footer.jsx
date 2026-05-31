function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h3>AMC Cinema</h3>
          <p>
            AMC Cinema offers a modern movie experience in the heart of Cluj,
            with online ticket booking, seat selection and special screenings.
          </p>
        </div>

        <div className="footer-column">
          <h4>Program</h4>
          <p>Monday - Sunday</p>
          <p>15:00 - 24:00</p>
          <p>Premieres and special screenings available weekly.</p>
        </div>

        <div className="footer-column">
          <h4>Contact</h4>
          <p>Central, Cluj-Napoca, Romania</p>
          <p>support@amccinema.ro</p>
          <p>+40 374 132 001</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>All rights reserved AMC Cinema Romania 2026 ©</p>
      </div>
    </footer>
  );
}

export default Footer;