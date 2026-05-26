import { useState } from "react";
import TicketBookingModal from "./TicketBookingModal";

function Home() {
  const [showTicketModal, setShowTicketModal] = useState(false);

  return (
    <section className="home-video-section">
      <video
        className="intro-video"
        src="/videos/intro.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="video-overlay">
        <div className="home-video-content">
          <span className="home-badge">Premium cinema experience</span>

          <h1>Discover stories on the big screen</h1>

          <p>
            Watch the latest movies, explore showtimes and book your cinema
            experience in a modern ticket booking platform.
          </p>

          <div className="home-actions">
            <a href="#movies" className="primary-btn">
              View Movies
            </a>
            <button className="secondary-btn" onClick={() => setShowTicketModal(true)}>
              Book Tickets
            </button>
          </div>
        </div>
      </div>

      {showTicketModal && (
        <TicketBookingModal onClose={() => setShowTicketModal(false)} />
      )}

    </section>
  );
}

export default Home;