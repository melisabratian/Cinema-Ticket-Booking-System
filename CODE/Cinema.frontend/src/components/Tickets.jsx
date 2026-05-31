import { useEffect, useState } from "react";
import SeatSelectionModal from "./SeatSelectionModal";

function Tickets({ movieToBook, onMovieBookHandled, onBooked }) {
  const [screenings, setScreenings] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showSeatModal, setShowSeatModal] = useState(false);

  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedScreening, setSelectedScreening] = useState(null);

  const [formData, setFormData] = useState({
    ClientName: "",
    Email: "",
    Phone: ""
  });

  const [errorMessage, setErrorMessage] = useState("");

  const availableTimes = ["16:00", "19:30", "21:00"];

  function formatDateForInput(date) {
    return date.toISOString().split("T")[0];
  }

  function normalizeDate(dateValue) {
    if (!dateValue) return "";
    return new Date(dateValue).toISOString().split("T")[0];
  }

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);

  const minDateValue = formatDateForInput(today);
  const maxDateValue = formatDateForInput(maxDate);

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

  useEffect(() => {
    loadScreenings();
  }, []);

  useEffect(() => {
    if (!movieToBook || screenings.length === 0) {
      return;
    }

    const movieId = movieToBook.Id || movieToBook.MovieId;

    setSelectedMovieId(String(movieId));
    setSelectedDate("");
    setSelectedTime("");
    setErrorMessage("");
    setShowBookingForm(true);

    if (onMovieBookHandled) {
      onMovieBookHandled();
    }
  }, [movieToBook, screenings, onMovieBookHandled]);

  const uniqueMovies = screenings.reduce((movies, screening) => {
    const alreadyExists = movies.some(
      (movie) => String(movie.MovieId) === String(screening.MovieId)
    );

    if (!alreadyExists && screening.Status !== "Coming Soon") {
      movies.push({
        MovieId: screening.MovieId,
        MovieTitle: screening.MovieTitle
      });
    }

    return movies;
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });

    setErrorMessage("");
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    if (!phone) return true;
    return /^[0-9+\s()-]{7,15}$/.test(phone);
  }

  function isPastTime(time) {
    if (!selectedDate) {
      return false;
    }

    const todayValue = formatDateForInput(new Date());

    if (selectedDate !== todayValue) {
      return false;
    }

    const now = new Date();
    const [hours, minutes] = time.split(":").map(Number);

    const selectedDateTime = new Date();
    selectedDateTime.setHours(hours, minutes, 0, 0);

    return selectedDateTime <= now;
  }

  function handleContinue(event) {
    event.preventDefault();

    if (!selectedMovieId) {
      setErrorMessage("Please select a movie.");
      return;
    }

    if (!selectedDate) {
      setErrorMessage("Please select a date from the calendar.");
      return;
    }

    if (!selectedTime) {
      setErrorMessage("Please select a screening time.");
      return;
    }

    if (isPastTime(selectedTime)) {
      setErrorMessage(
        "This screening time has already passed. Please select another time."
      );
      return;
    }

    if (formData.ClientName.trim().length < 2) {
      setErrorMessage("Please enter a valid full name.");
      return;
    }

    if (!isValidEmail(formData.Email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!isValidPhone(formData.Phone)) {
      setErrorMessage("Please enter a valid phone number.");
      return;
    }

    const screening = screenings.find((item) => {
      const itemDate = normalizeDate(item.ScreeningDate);

      return (
        String(item.MovieId) === String(selectedMovieId) &&
        itemDate === selectedDate &&
        item.ScreeningTime === selectedTime &&
        item.Status !== "Coming Soon"
      );
    });

    if (!screening) {
      setErrorMessage(
        "This movie is not available for the selected date and time. Please choose another option."
      );
      return;
    }

    setSelectedScreening(screening);
    setErrorMessage("");
    setShowBookingForm(false);
    setShowSeatModal(true);
  }

  function handleCloseForm() {
    setShowBookingForm(false);
    setErrorMessage("");
  }

  function handleCloseSeatModal() {
    setShowSeatModal(false);
    setSelectedScreening(null);

    if (onBooked) {
      onBooked();
    }

    loadScreenings();
  }

  return (
    <section id="tickets" className="info-section tickets-section">
      <div className="section-heading">
        <span>Ticket booking</span>
        <h2>Reserve your cinema seat</h2>
        <p>
          Choose a movie, select a date and time, then pick your exact seat from
          the cinema hall map.
        </p>
      </div>

      <div className="tickets-layout">
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

        <div className="ticket-panel highlight-panel ticket-action-card">
          <button
            className="red-action-btn big-book-btn"
            onClick={() => setShowBookingForm(true)}
          >
            Book Now
          </button>
        </div>

        <div className="ticket-panel ticket-message-card">
          <h3>Select your seat</h3>

          <p>
            Choose your preferred seat from the cinema map. Reserved seats are
            marked in red and cannot be selected again.
          </p>
        </div>
      </div>

      {showBookingForm && (
        <div className="modal-overlay">
          <div className="booking-modal">
            <h2>Book tickets</h2>

            <form onSubmit={handleContinue}>
              <select
                value={selectedMovieId}
                onChange={(event) => {
                  setSelectedMovieId(event.target.value);
                  setSelectedDate("");
                  setSelectedTime("");
                  setErrorMessage("");
                }}
                required
              >
                <option value="">Select movie</option>

                {uniqueMovies.map((movie) => (
                  <option key={movie.MovieId} value={movie.MovieId}>
                    {movie.MovieTitle}
                  </option>
                ))}
              </select>

              <div className="booking-calendar">
                <p className="booking-field-label">Select date</p>

                <input
                  type="date"
                  className="date-calendar-input"
                  value={selectedDate}
                  min={minDateValue}
                  max={maxDateValue}
                  onClick={(event) => {
                    if (event.currentTarget.showPicker) {
                      event.currentTarget.showPicker();
                    }
                  }}
                  onChange={(event) => {
                    setSelectedDate(event.target.value);
                    setSelectedTime("");
                    setErrorMessage("");
                  }}
                  required
                />
              </div>

              <div className="booking-time">
                <p className="booking-field-label">Select time</p>

                <div className="time-buttons">
                  {availableTimes.map((time) => {
                    const disabled = isPastTime(time);

                    return (
                      <button
                        key={time}
                        type="button"
                        className="time-option"
                        data-selected={
                          selectedTime === time ? "true" : "false"
                        }
                        disabled={disabled}
                        onClick={() => {
                          if (disabled) {
                            return;
                          }

                          setSelectedTime(time);
                          setErrorMessage("");
                        }}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              <input
                type="text"
                name="ClientName"
                placeholder="Full name"
                value={formData.ClientName}
                onChange={handleChange}
                minLength="2"
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
                type="tel"
                name="Phone"
                placeholder="Phone number"
                value={formData.Phone}
                onChange={handleChange}
              />

              {errorMessage && <p className="error-message">{errorMessage}</p>}

              <button type="submit">Continue to seat selection</button>

              <button type="button" onClick={handleCloseForm}>
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
          onClose={handleCloseSeatModal}
        />
      )}
    </section>
  );
}

export default Tickets;