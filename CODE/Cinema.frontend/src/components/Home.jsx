function Home() {
  return (
    <section id="home" className="home-video-section">
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
            Watch the latest movies, check available seats and book your cinema
            experience in a modern client-server ticket booking platform.
          </p>

          <div className="home-actions">
            <a href="#movies" className="primary-btn">View Movies</a>
            <a href="#tickets" className="secondary-btn">Book Tickets</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
