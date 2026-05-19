function Home() {
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
            <button className="primary-btn">View Movies</button>
            <button className="secondary-btn">Book Tickets</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;