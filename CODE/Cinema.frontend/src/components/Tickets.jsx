import { useEffect, useState } from "react";
import SeatSelectionModal from "./SeatSelectionModal";

function Tickets() {
  const [screenings, setScreenings] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showSeatModal, setShowSeatModal] = useState(false);

  const [selectedScreeningId, setSelectedScreeningId] = useState("");
  const [selectedScreening, setSelectedScreening] = useState(null);

  const [formData, setFormData] = useState({
    ClientName: "",
    Email: "",
    Phone: ""
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadScreenings() {
      try {
        const response = await fetch("http://localhost:4000/screenings");

        if (!response.ok) {
          throw new Error("Failed to load screenings");
        }

        const data = await response.json();
        setScreenings(data);
      } catch (error) {
        console.error("Error loading screenings:", error);
      }
    }

    loadScreenings();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  function handleScreeningChange(event) {
    const screeningId = event.target.value;
    setSelectedScreeningId(screeningId);

    const screening = screenings.find(
      (item) => String(item.Id) === String(screeningId)
    );

    setSelectedScreening(screening || null);
  }

  function handleContinue(event) {
    event.preventDefault();

    if (!selectedScreening) {
      setErrorMessage("Please select a movie screening.");
      return;
    }

    if (!formData.ClientName || !formData.Email) {
      setErrorMessage("Please complete your name and email.");
      return;
    }

    if (selectedScreening.Status === "Coming Soon") {
      setErrorMessage("Tickets are not available yet for this movie.");
      return;
    }

    setErrorMessage("");
    setShowBookingForm(false);
    setShowSeatModal(true);
  }

  function formatDate(dateValue) {
    if (!dateValue) return "TBA";
    return new Date(dateValue).toLocaleDateString("en-GB");
  }

  return (
    <section id="tickets" className="info-section tickets-section">
      <div className="section-heading">
        <span>Ticket booking</span>
        <h2>Reserve your cinema seat</h2>
        <p>
          Choose a movie, complete your details and select the exact seats you
          want from the cinema hall map.
        </p>
      </div>

      <div className="ticket-panel highlight-panel ticket-action-card">
  <button
    className="red-action-btn big-book-btn"
    onClick={() => setShowBookingForm(true)}
       >
     Book Now
     </button>
    </div>

        <div className="ticket-panel cinema-preview-panel">
          <img
            src="/images/cinema-hall.jpg"
            alt="Cinema hall"
            className="ticket-hall-image"
            onError={(event) => {
              event.currentTarget.src = "/images/default-hall.jpg";
            }}
          />
        </div>

        <div className="ticket-panel ticket-message-card">
       <h3>Select your seat</h3>

      <p>
    Choose your preferred seat from the cinema map. Reserved seats are marked in red and cannot be selected again.
        </p>
      </div>

      {showBookingForm && (
        <div className="modal-overlay">
          <div className="booking-modal">
            <h2>Book tickets</h2>

            <form onSubmit={handleContinue}>
              <select
                value={selectedScreeningId}
                onChange={handleScreeningChange}
                required
              >
                <option value="">Select movie screening</option>

                {screenings.map((screening) => (
                  <option key={screening.Id} value={screening.Id}>
                    {screening.MovieTitle} |{" "}
                    {formatDate(screening.ScreeningDate)} |{" "}
                    {screening.ScreeningTime} | {screening.HallName}
                  </option>
                ))}
              </select>

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

              {selectedScreening && (
                <div className="booking-movie-details">
                  <p>
                    <strong>Movie:</strong> {selectedScreening.MovieTitle}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {formatDate(selectedScreening.ScreeningDate)}
                  </p>
                  <p>
                    <strong>Time:</strong> {selectedScreening.ScreeningTime}
                  </p>
                  <p>
                    <strong>Hall:</strong> {selectedScreening.HallName}
                  </p>
                  <p>
                    <strong>Price:</strong> {selectedScreening.BasePrice} RON /
                    seat
                  </p>
                </div>
              )}

              {errorMessage && <p className="error-message">{errorMessage}</p>}

              <button type="submit">Continue to seat selection</button>

              <button
                type="button"
                onClick={() => {
                  setShowBookingForm(false);
                  setErrorMessage("");
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {showSeatModal && selectedScreening && (
        <SeatSelectionModal
          screening={selectedScreening}
          clientData={formData}
          onClose={() => setShowSeatModal(false)}
        />
      )}
    </section>
  );
}

export default Tickets;