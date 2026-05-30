function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <h3>AMC CINEMA</h3>
        <p>
          A client-server cinema ticket booking application developed for the
          Data Transmission project.
        </p>
      </div>

      <div className="footer-column">
        <h4>Navigation</h4>
        <p>Movies</p>
        <p>Tickets</p>
        <p>Offers</p>
      </div>

      <div className="footer-column">
        <h4>Technology</h4>
        <p>React Frontend</p>
        <p>Express Backend</p>
        <p>SQL Server Database</p>
      </div>

      <div className="footer-column">
        <h4>Contact</h4>
        <p>Cluj-Napoca, Romania</p>
        <p>support@amccinema.ro</p>
      </div>
    </footer>
  );
}

export default Footer;