import { useState } from "react";

function BookingModal({ movie, onClose, onReservationSuccess }) {
  const today = new Date();
  const maxDate = new Date();

  maxDate.setDate(today.getDate() + 7);

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    ClientName: "",
    Email: "",
    Phone: "",
    NumberOfTickets: 1,
    ScreeningDate: formatDate(today)
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          MovieId: movie.Id,
          ClientName: formData.ClientName,
          Email: formData.Email,
          Phone: formData.Phone,
          NumberOfTickets: Number(formData.NumberOfTickets),
          ScreeningDate: formData.ScreeningDate
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Reservation failed.");
      }

      setMessage(data.message);
      setError("");

      if (onReservationSuccess) {
        onReservationSuccess();
      }

      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  }

  return (
    <div className="modal-overlay">
      <div className="booking-modal">
        <h2>Book Ticket</h2>

        <div className="booking-movie-details">
          <h3>{movie.Title}</h3>
          <p>{movie.HallName} | {movie.ShowTime}</p>
          <p>Price: {movie.TicketPrice} RON / ticket</p>
          <p>Available seats: {movie.AvailableSeats}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="ClientName"
            placeholder="Full name"
            value={formData.ClientName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="Email"
            placeholder="Email address"
            value={formData.Email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="Phone"
            placeholder="Phone number"
            value={formData.Phone}
            onChange={handleChange}
          />

          <input
            type="date"
            name="ScreeningDate"
            value={formData.ScreeningDate}
            min={formatDate(today)}
            max={formatDate(maxDate)}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="NumberOfTickets"
            placeholder="Number of tickets"
            min="1"
            max={movie.AvailableSeats}
            value={formData.NumberOfTickets}
            onChange={handleChange}
            required
          />

          <button type="submit">Confirm Booking</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default BookingModal;