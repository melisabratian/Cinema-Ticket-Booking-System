import BookingModal from "./BookingModal";
import { useEffect, useState } from "react";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/movies")
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  const nowShowing = movies.filter((movie) => movie.Status === "Now Showing" || movie.status === "Now Showing");
  const comingSoon = movies.filter((movie) => movie.Status === "Coming Soon" || movie.status === "Coming Soon");
  const premieres = movies.filter((movie) => movie.Status === "Premiere" || movie.status === "Premiere");

  const renderMovies = (movieList) => (
    <div className="movies-grid">
      {movieList.map((movie) => (
        <div className="movie-card" key={movie.Id}>
          <img
            src={`/images/${movie.ImageUrl}`}
            alt={movie.Title}
            className="movie-image"
          />

          <div className="movie-info">
            <h3>{movie.Title}</h3>
            <p>{movie.Description}</p>

            <div className="movie-details">
                <span>{movie.Genre}</span>
                <span>{movie.DurationMinutes} min</span>
                <span>{movie.AgeRating}</span>
                <span>{movie.ReleaseYear}</span>
            </div>

            <div className="show-info">
                <p>
                Date:{" "}
                {movie.ShowDate
                    ? new Date(movie.ShowDate).toLocaleDateString("en-GB")
                    : "TBA"}
                </p>
                <p>Time: {movie.ShowTime}</p>
                <p>Hall: {movie.HallName}</p>
            </div>

            <div className="movie-bottom">
              <strong>{movie.TicketPrice} RON</strong>
              <button onClick={() => setSelectedMovie(movie)}>Book Now</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section id="movies" className="movies-section">
      <h2>Movies</h2>
      <p className="movies-subtitle">
        Explore our cinema selection by category.
      </p>

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

      {selectedMovie && (
        <BookingModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
        />
      )}
    </section>
  );
}

export default Movies;