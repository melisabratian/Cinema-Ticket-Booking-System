import { useEffect, useState } from "react";

function TicketBookingModal({ onClose }) {
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [formData, setFormData] = useState({
    ClientName: "",
    Email: "",
    Phone: "",
    NumberOfTickets: 1
  });

  const selectedMovie = movies.find((movie) => String(movie.Id) === selectedMovieId);

  useEffect(() => {
    fetch("http://localhost:4000/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMovie) {
      alert("Please select a movie.");
      return;
    }

    const response = await fetch("http://localhost:4000/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        MovieId: selectedMovie.Id,
        ...formData,
        NumberOfTickets: Number(formData.NumberOfTickets)
      })
    });

    const data = await response.json();

    if (response.ok) {
      onClose();
      alert(
`Reservation confirmed!

Movie: ${selectedMovie.Title}
Date: ${new Date(selectedMovie.ShowDate).toLocaleDateString("en-GB")}
Time: ${selectedMovie.ShowTime}
Hall: ${selectedMovie.HallName}
Duration: ${selectedMovie.DurationMinutes} min
Tickets: ${formData.NumberOfTickets}

Total: ${data.totalPrice} RON`
      );
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="booking-modal">
        <h2>Book Tickets</h2>

        <form onSubmit={handleSubmit}>
          <select
            value={selectedMovieId}
            onChange={(e) => setSelectedMovieId(e.target.value)}
            required
          >
            <option value="">Choose a movie</option>
            {movies.map((movie) => (
              <option key={movie.Id} value={movie.Id}>
                {movie.Title}
              </option>
            ))}
          </select>

          {selectedMovie && (
            <div className="booking-movie-details">
              <p>Date: {new Date(selectedMovie.ShowDate).toLocaleDateString("en-GB")}</p>
              <p>Time: {selectedMovie.ShowTime}</p>
              <p>Hall: {selectedMovie.HallName}</p>
              <p>Price: {selectedMovie.TicketPrice} RON</p>
            </div>
          )}

          <input name="ClientName" placeholder="Your name" onChange={handleChange} required />
          <input name="Email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="Phone" placeholder="Phone" onChange={handleChange} required />
          <input name="NumberOfTickets" type="number" min="1" placeholder="Number of tickets" onChange={handleChange} required />

          <button type="submit">Confirm Reservation</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default TicketBookingModal;