import { useState } from "react";

function BookingModal({ movie, onClose }) {
  const [formData, setFormData] = useState({
    ClientName: "",
    Email: "",
    Phone: "",
    NumberOfTickets: 1
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:4000/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        MovieId: movie.Id,
        ...formData,
        NumberOfTickets: Number(formData.NumberOfTickets)
      })
    });

    const data = await response.json();

    if (response.ok) {
      onClose();
      alert(
        `Reservation confirmed!

        Movie: ${movie.Title}
        Date: ${new Date(movie.ShowDate).toLocaleDateString("en-GB")}
        Time: ${movie.ShowTime}
        Hall: ${movie.HallName}
        Duration: ${movie.DurationMinutes} min
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
        <h2>Book: {movie.Title}</h2>
            <div className="booking-movie-details">
                <p>Date: {new Date(movie.ShowDate).toLocaleDateString("en-GB")}</p>
                <p>Time: {movie.ShowTime}</p>
                <p>Hall: {movie.HallName}</p>
                <p>Duration: {movie.DurationMinutes} min</p>
            </div>

        <form onSubmit={handleSubmit}>
          <input
            name="ClientName"
            placeholder="Your name"
            onChange={handleChange}
            required
          />

          <input
            name="Email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            name="Phone"
            placeholder="Phone"
            onChange={handleChange}
            required
          />

          <input
            name="NumberOfTickets"
            type="number"
            min="1"
            placeholder="Number of tickets"
            onChange={handleChange}
            required
          />

          <button type="submit">Confirm Reservation</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;