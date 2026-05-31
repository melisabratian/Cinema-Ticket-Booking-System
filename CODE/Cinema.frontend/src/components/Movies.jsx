import { useEffect, useState } from "react";

function Movies({ refreshKey, onBooked, onMovieBook }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadMovies() {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch("http://localhost:4000/movies");

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Could not load movies. Please check the backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMovies();
  }, [refreshKey]);

  const nowShowing = movies.filter((movie) => {
    const status = String(movie.Status || movie.status || "").toLowerCase();
    return status === "now showing" || status === "available";
  });

  const comingSoon = movies.filter((movie) => {
    const status = String(movie.Status || movie.status || "").toLowerCase();
    return status === "coming soon";
  });

  const premieres = movies.filter((movie) => {
    const status = String(movie.Status || movie.status || "").toLowerCase();
    return status === "premiere" || status === "premier";
  });

  function isComingSoon(movie) {
    const status = String(movie.Status || movie.status || "").toLowerCase();
    return status === "coming soon";
  }

  function handleMovieBookClick(movie) {
    if (onMovieBook) {
      onMovieBook(movie);
    }
  }

  function renderMovies(movieList) {
    if (movieList.length === 0) {
      return (
        <p className="empty-category">
          No movies available in this category yet.
        </p>
      );
    }

    return (
      <div className="movies-grid">
        {movieList.map((movie) => (
          <article className="movie-card" key={movie.Id}>
            <div className="movie-poster-wrapper">
              <img
                src={`/images/${movie.ImageUrl}`}
                alt={movie.Title}
                className="movie-image"
                onError={(event) => {
                  event.currentTarget.src = "/images/default-movie.jpg";
                }}
              />
            </div>

            <div className="movie-info">
              <div className="movie-top">
                <span className="movie-genre">{movie.Genre}</span>
                <span className="movie-status">{movie.Status}</span>
              </div>

              <h3>{movie.Title}</h3>

              <p className="movie-description">{movie.Description}</p>

              <div className="movie-details">
                <span>{movie.DurationMinutes} min</span>
                <span>{movie.AgeRating}</span>
                <span>{movie.ReleaseYear}</span>
                <span>{movie.Language}</span>
              </div>

              <div className="show-info">
                <p>
                  <strong>{isComingSoon(movie) ? "Release date:" : "Time:"}</strong>{" "}
                  {movie.ShowTime || "TBA"}
                </p>

                <p>
                  <strong>Hall:</strong> {movie.HallName || "TBA"}
                </p>

                <p>
                  <strong>Available seats:</strong> {movie.AvailableSeats}
                </p>
              </div>

              <div className="movie-bottom">
                <strong>{movie.TicketPrice} RON</strong>

                {isComingSoon(movie) ? (
                  <button className="disabled-book-btn" disabled>
                    Coming Soon
                  </button>
                ) : Number(movie.AvailableSeats) <= 0 ? (
                  <button className="disabled-book-btn" disabled>
                    Sold Out
                  </button>
                ) : (
                  <button onClick={() => handleMovieBookClick(movie)}>
                    Book Now
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <section id="movies" className="movies-section">
      <h2>Movies</h2>

      <p className="movies-subtitle">
          Discover the latest movies, upcoming releases and special premieres. Choose your favorite film and reserve your seat for the perfect cinema experience.
      </p>

      {loading && <p className="loading-text">Loading movies...</p>}

      {errorMessage && <p className="error-text">{errorMessage}</p>}

      {!loading && !errorMessage && (
        <>
          <div id="now-showing" className="movie-category">
            <h3 className="category-title">Now Showing</h3>
            {renderMovies(nowShowing)}
          </div>

          <div id="coming-soon" className="movie-category">
            <h3 className="category-title">Coming Soon</h3>
            {renderMovies(comingSoon)}
          </div>

          <div id="premieres" className="movie-category">
            <h3 className="category-title">Premieres</h3>
            {renderMovies(premieres)}
          </div>
        </>
      )}
    </section>
  );
}

export default Movies;