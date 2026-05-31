import { useEffect, useState } from "react";

function SeatSelectionModal({ screening, clientData, onClose }) {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  async function loadSeats() {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:4000/screenings/${screening.Id}/seats`
      );

      if (!response.ok) {
        throw new Error("Failed to load seats");
      }

      const data = await response.json();
      setSeats(data.seats);
    } catch (error) {
      console.error("Error loading seats:", error);
      setErrorMessage("Could not load seat map.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSeats();
  }, [screening.Id]);

  function toggleSeat(seat) {
    if (seat.IsReserved || bookingConfirmed) {
      return;
    }

    const alreadySelected = selectedSeats.includes(seat.Id);

    if (alreadySelected) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seat.Id));
    } else {
      setSelectedSeats([...selectedSeats, seat.Id]);
    }
  }

  function getSeatClass(seat) {
    if (seat.IsReserved) {
      return "seat reserved";
    }

    if (selectedSeats.includes(seat.Id)) {
      return "seat selected";
    }

    return "seat available";
  }

  function groupSeatsByRow() {
    const grouped = {};

    seats.forEach((seat) => {
      if (!grouped[seat.RowLabel]) {
        grouped[seat.RowLabel] = [];
      }

      grouped[seat.RowLabel].push(seat);
    });

    return grouped;
  }

  function getSelectedSeatLabels() {
    return seats
      .filter((seat) => selectedSeats.includes(seat.Id))
      .map((seat) => `${seat.RowLabel}${seat.SeatNumber}`)
      .join(", ");
  }

  async function handleConfirmBooking() {
    if (selectedSeats.length === 0) {
      setErrorMessage("Please select at least one seat.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/seat-reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ScreeningId: screening.Id,
          ClientName: clientData.ClientName,
          Email: clientData.Email,
          Phone: clientData.Phone,
          SeatIds: selectedSeats
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Reservation failed");
      }

      setMessage(data.message);
      setErrorMessage("");
      setBookingConfirmed(true);
    } catch (error) {
      console.error("Reservation error:", error);
      setErrorMessage(error.message);
      setMessage("");
    }
  }

  const groupedSeats = groupSeatsByRow();
  const selectedSeatLabels = getSelectedSeatLabels();
  const totalPrice = Number(screening.BasePrice) * selectedSeats.length;

  return (
    <div className="modal-overlay">
      <div className="seat-selection-modal">
        <button className="seat-modal-close" onClick={onClose}>
          ×
        </button>

        {!bookingConfirmed && (
          <>
            <h2>Select your seats</h2>

            <p className="seat-modal-subtitle">
              {screening.MovieTitle} | {screening.HallName} |{" "}
              {screening.ScreeningTime}
            </p>

            {loading && <p className="loading-text">Loading seat map...</p>}

            {!loading && (
              <>
                <div className="screen-area">
                  <span>SCREEN</span>
                </div>

                <div className="seat-map">
                  {Object.keys(groupedSeats).map((rowLabel) => (
                    <div className="seat-row" key={rowLabel}>
                      <span className="row-label">{rowLabel}</span>

                      <div className="seat-row-items">
                        {groupedSeats[rowLabel].map((seat) => (
                          <button
                            key={seat.Id}
                            className={getSeatClass(seat)}
                            onClick={() => toggleSeat(seat)}
                            disabled={seat.IsReserved}
                          >
                            {seat.SeatNumber}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="seat-selection-summary">
                  <p>
                    <strong>Selected seats:</strong>{" "}
                    {selectedSeats.length === 0
                      ? "None"
                      : selectedSeatLabels}
                  </p>

                  <p>
                    <strong>Total price:</strong> {totalPrice} RON
                  </p>
                </div>

                <div className="seat-legend modal-seat-legend">
                  <div>
                    <span className="legend-seat available"></span>
                    Available
                  </div>

                  <div>
                    <span className="legend-seat selected"></span>
                    Selected
                  </div>

                  <div>
                    <span className="legend-seat reserved"></span>
                    Reserved
                  </div>
                </div>

                <button className="confirm-seat-btn" onClick={handleConfirmBooking}>
                  Confirm booking
                </button>
              </>
            )}

            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </>
        )}

        {bookingConfirmed && (
          <div className="booking-confirmation-card">
            <h3>Booking confirmed!</h3>

            <p>{message}</p>

            <div className="booking-confirmation-details">
              <p>
                <strong>Movie:</strong> {screening.MovieTitle}
              </p>

              <p>
                <strong>Hall:</strong> {screening.HallName}
              </p>

              <p>
                <strong>Time:</strong> {screening.ScreeningTime}
              </p>

              <p>
                <strong>Seats:</strong> {selectedSeatLabels}
              </p>

              <p>
                <strong>Total:</strong> {totalPrice} RON
              </p>
            </div>

            <button className="confirm-seat-btn" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeatSelectionModal;