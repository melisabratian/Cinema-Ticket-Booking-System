function Header() {
  return (
    <header className="header">
      <div className="header-logo">
        <img src="/images/logo.png" alt="Cinema logo" className="logo-image" />
      </div>

      <nav className="header-nav">
        <div className="nav-item">
          <a href="#movies" className="nav-main-link">Movies</a>

          <div className="submenu">
            <a href="#now-showing">Now Showing</a>
            <a href="#coming-soon">Coming Soon</a>
            <a href="#premieres">Premieres</a>
          </div>
        </div>

        <div className="nav-item">
          Tickets
          <div className="submenu">
            <span>Ticket Prices</span>
            <span>Reservations</span>
            <span>My Tickets</span>
          </div>
        </div>

        <div className="nav-item">
          Experience
          <div className="submenu">
            <span>VIP Hall</span>
            <span>Premium Seats</span>
            <span>Dolby Atmos</span>
          </div>
        </div>

        <div className="nav-item">
          Offers
          <div className="submenu">
            <span>Student Discount</span>
            <span>Family Pack</span>
            <span>Weekend Offers</span>
          </div>
        </div>

        <div className="nav-item">Contact</div>
      </nav>

      <button className="admin-login-btn">Admin Login</button>
    </header>
  );
}

export default Header;