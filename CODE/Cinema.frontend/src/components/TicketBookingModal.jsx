import { useEffect, useState } from "react";

function TicketBookingModal({ onClose, onBooked }) {
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [formData, setFormData] = useState({
    ClientName: "",
    Email: "",
    Phone: "",
    NumberOfTickets: 1
  });
  const [submitting, setSubmitting] = useState(false);

  const selectedMovie = movies.find((movie) => String(movie.Id) === selectedMovieId);

  useEffect(() => {
    fetch("http://localhost:4000/movies")
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error("Error loading movies:", error));
  }, []);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedMovie) {
      alert("Please select a movie.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:4000/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          MovieId: Number(selectedMovie.Id),
          ...formData,
          NumberOfTickets: Number(formData.NumberOfTickets)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Reservation failed.");
        return;
      }

      alert(
        `Reservation confirmed!\n\nMovie: ${selectedMovie.Title}\nTime: ${selectedMovie.ShowTime}\nHall: ${selectedMovie.HallName}\nTickets: ${formData.NumberOfTickets}\nTotal: ${data.totalPrice} RON`
      );

      onBooked();
      onClose();
    } catch (error) {
      console.error("Booking error:", error);
      alert("Reservation failed. Please check if the backend server is running.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="booking-modal">
        <h2>Book Tickets</h2>

        <form onSubmit={handleSubmit}>
          <select
            value={selectedMovieId}
            onChange={(event) => setSelectedMovieId(event.target.value)}
            required
          >
            <option value="">Choose a movie</option>
            {movies.map((movie) => (
              <option key={movie.Id} value={movie.Id}>
                {movie.Title} - {movie.AvailableSeats} seats left
              </option>
            ))}
          </select>

          {selectedMovie && (
            <div className="booking-movie-details">
              <p><strong>Time:</strong> {selectedMovie.ShowTime || "TBA"}</p>
              <p><strong>Hall:</strong> {selectedMovie.HallName || "TBA"}</p>
              <p><strong>Price:</strong> {selectedMovie.TicketPrice} RON / ticket</p>
              <p><strong>Available seats:</strong> {selectedMovie.AvailableSeats}</p>
            </div>
          )}

          <input name="ClientName" placeholder="Your name" value={formData.ClientName} onChange={handleChange} required />
          <input name="Email" type="email" placeholder="Email" value={formData.Email} onChange={handleChange} required />
          <input name="Phone" placeholder="Phone" value={formData.Phone} onChange={handleChange} required />
          <input name="NumberOfTickets" type="number" min="1" max={selectedMovie?.AvailableSeats || 100} placeholder="Number of tickets" value={formData.NumberOfTickets} onChange={handleChange} required />

          <button type="submit" disabled={submitting}>
            {submitting ? "Processing..." : "Confirm Reservation"}
          </button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default TicketBookingModal;
