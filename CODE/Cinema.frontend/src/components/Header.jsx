function Header({ isAdmin, onAdminLoginClick, onAdminLogout }) {
  return (
    <header className="header">
      <a href="#home" className="header-logo" aria-label="Go to home section">
        <img src="/images/logo.png" alt="Cinema logo" className="logo-image" />
      </a>

      <nav className="header-nav">
        <div className="nav-item">
          <a href="#movies" className="nav-main-link">Movies</a>
          <div className="submenu">
            <a href="#movies">All Movies</a>
            <a href="#now-showing">Now Showing</a>
            <a href="#coming-soon">Coming Soon</a>
            <a href="#premieres">Premieres</a>
          </div>
        </div>

        <div className="nav-item">
          <a href="#tickets" className="nav-main-link">Tickets</a>
          <div className="submenu">
            <a href="#tickets">Book Tickets</a>
            <a href="#tickets-info">Ticket Rules</a>
            <a href="#tickets-info">Seat Availability</a>
          </div>
        </div>

        <div className="nav-item">
          <a href="#experience" className="nav-main-link">Experience</a>
          <div className="submenu">
            <a href="#experience">VIP Hall</a>
            <a href="#experience">Premium Seats</a>
            <a href="#experience">Dolby Atmos</a>
          </div>
        </div>

        <div className="nav-item">
          <a href="#offers" className="nav-main-link">Offers</a>
          <div className="submenu">
            <a href="#offers">Student Discount</a>
            <a href="#offers">Family Pack</a>
            <a href="#offers">Combo Offers</a>
          </div>
        </div>

        <div className="nav-item">
          <a href="#contact" className="nav-main-link">Contact</a>
        </div>

        {isAdmin && (
          <div className="nav-item admin-nav-link">
            <a href="#admin" className="nav-main-link">Admin</a>
          </div>
        )}
      </nav>

      {isAdmin ? (
        <button className="admin-login-btn active-admin" onClick={onAdminLogout}>
          Logout
        </button>
      ) : (
        <button className="admin-login-btn" onClick={onAdminLoginClick}>
          Admin Login
        </button>
      )}
    </header>
  );
}

export default Header;
