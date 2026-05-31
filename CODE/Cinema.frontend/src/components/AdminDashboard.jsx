import { useEffect, useState } from "react";

function AdminDashboard({ refreshKey }) {
  const [activeTab, setActiveTab] = useState("movies");
  const [movies, setMovies] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movieMessage, setMovieMessage] = useState("");
  const [movieError, setMovieError] = useState("");

  const [movieForm, setMovieForm] = useState({
    Title: "",
    Genre: "",
    Description: "",
    DurationMinutes: "",
    AgeRating: "",
    ReleaseYear: "",
    Language: "",
    TicketPrice: "",
    ImageUrl: "",
    Status: "Now Showing",
    HallId: "1"
  });

  async function loadAdminData() {
    try {
      setLoading(true);

      const moviesResponse = await fetch("http://localhost:4000/movies");
      const reservationsResponse = await fetch("http://localhost:4000/seat-reservations");

      const moviesData = moviesResponse.ok ? await moviesResponse.json() : [];
      const reservationsData = reservationsResponse.ok ? await reservationsResponse.json() : [];

      setMovies(moviesData);
      setReservations(reservationsData);

      try {
        const contactResponse = await fetch("http://localhost:4000/contact");

        if (contactResponse.ok) {
          const contactData = await contactResponse.json();
          setContactMessages(contactData);
        } else {
          setContactMessages([]);
        }
      } catch {
        setContactMessages([]);
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, [refreshKey]);

  function handleMovieFormChange(event) {
    const { name, value } = event.target;

    setMovieForm({
      ...movieForm,
      [name]: value
    });

    setMovieMessage("");
    setMovieError("");
  }

  async function handleAddMovie(event) {
    event.preventDefault();

    if (
      !movieForm.Title ||
      !movieForm.Genre ||
      !movieForm.Description ||
      !movieForm.DurationMinutes ||
      !movieForm.AgeRating ||
      !movieForm.ReleaseYear ||
      !movieForm.Language ||
      !movieForm.TicketPrice ||
      !movieForm.Status
    ) {
      setMovieError("Please complete all required fields.");
      return;
    }

    if (Number(movieForm.DurationMinutes) <= 0) {
      setMovieError("Duration must be greater than 0.");
      return;
    }

    if (Number(movieForm.TicketPrice) <= 0) {
      setMovieError("Ticket price must be greater than 0.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(movieForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not add movie.");
      }

      setMovieMessage("Movie added successfully.");
      setMovieError("");

      setMovieForm({
        Title: "",
        Genre: "",
        Description: "",
        DurationMinutes: "",
        AgeRating: "",
        ReleaseYear: "",
        Language: "",
        TicketPrice: "",
        ImageUrl: "",
        Status: "Now Showing",
        HallId: "1"
      });

      await loadAdminData();
      setActiveTab("movies");
    } catch (error) {
      setMovieError(error.message);
      setMovieMessage("");
    }
  }

  async function handleDeleteContactMessage(id) {
    const confirmed = window.confirm("Are you sure you want to delete this contact message?");

    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:4000/contact/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Could not delete message.");
      }

      setContactMessages((previousMessages) =>
        previousMessages.filter((message) => message.Id !== id)
      );
    } catch (error) {
      console.error("Delete contact message error:", error);
      alert("Could not delete contact message.");
    }
  }

  function formatDate(dateValue) {
    if (!dateValue) return "TBA";
    return new Date(dateValue).toLocaleDateString("en-GB");
  }

  function formatDateTime(dateValue) {
    if (!dateValue) return "TBA";
    return new Date(dateValue).toLocaleString("en-GB");
  }

  const totalMovies = movies.length;
  const totalReservations = reservations.length;

  const totalTicketsSold = reservations.reduce((sum, reservation) => {
    if (!reservation.Seats) return sum;
    return sum + reservation.Seats.split(",").length;
  }, 0);

  const totalRevenue = reservations.reduce((sum, reservation) => {
    return sum + Number(reservation.TotalPrice || 0);
  }, 0);

  return (
    <section id="admin" className="admin-section">
      <div className="section-heading">
        <span>Admin</span>
        <h2>Management Dashboard</h2>
        <p>
          The administrator can view movies, reservations, contact messages and
          add new movies.
        </p>
      </div>

      {loading && <p className="loading-text">Loading admin dashboard...</p>}

      {!loading && (
        <>
          <div className="admin-stats">
            <div className="admin-stat-card">
              <strong>{totalMovies}</strong>
              <span>Movies</span>
            </div>

            <div className="admin-stat-card">
              <strong>{totalReservations}</strong>
              <span>Reservations</span>
            </div>

            <div className="admin-stat-card">
              <strong>{totalTicketsSold}</strong>
              <span>Tickets Sold</span>
            </div>

            <div className="admin-stat-card">
              <strong>{totalRevenue} RON</strong>
              <span>Total Revenue</span>
            </div>
          </div>

          <div className="admin-tabs">
            <button
              className={activeTab === "movies" ? "admin-tab active" : "admin-tab"}
              onClick={() => setActiveTab("movies")}
            >
              Movies
            </button>

            <button
              className={activeTab === "reservations" ? "admin-tab active" : "admin-tab"}
              onClick={() => setActiveTab("reservations")}
            >
              Reservations
            </button>

            <button
              className={activeTab === "contact" ? "admin-tab active" : "admin-tab"}
              onClick={() => setActiveTab("contact")}
            >
              Contact Messages
            </button>

            <button
              className={activeTab === "addMovie" ? "admin-tab active" : "admin-tab"}
              onClick={() => setActiveTab("addMovie")}
            >
              Add Movie
            </button>
          </div>

          {activeTab === "movies" && (
            <div className="admin-table-block">
              <h3>Movies</h3>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Genre</th>
                      <th>Year</th>
                      <th>Language</th>
                      <th>Status</th>
                      <th>Price</th>
                    </tr>
                  </thead>

                  <tbody>
                    {movies.length === 0 ? (
                      <tr>
                        <td colSpan="6">No movies found.</td>
                      </tr>
                    ) : (
                      movies.map((movie) => (
                        <tr key={movie.Id}>
                          <td>{movie.Title}</td>
                          <td>{movie.Genre}</td>
                          <td>{movie.ReleaseYear}</td>
                          <td>{movie.Language}</td>
                          <td>{movie.Status}</td>
                          <td>{movie.TicketPrice} RON</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "reservations" && (
            <div className="admin-table-block">
              <h3>Ticket Reservations</h3>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Movie</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Hall</th>
                      <th>Seats</th>
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reservations.length === 0 ? (
                      <tr>
                        <td colSpan="9">No reservations yet.</td>
                      </tr>
                    ) : (
                      reservations.map((reservation) => (
                        <tr key={reservation.Id}>
                          <td>{reservation.ClientName}</td>
                          <td>{reservation.Email}</td>
                          <td>{reservation.Phone || "-"}</td>
                          <td>{reservation.MovieTitle}</td>
                          <td>{formatDate(reservation.ScreeningDate)}</td>
                          <td>{reservation.ScreeningTime}</td>
                          <td>{reservation.HallName}</td>
                          <td>{reservation.Seats}</td>
                          <td>{reservation.TotalPrice} RON</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="admin-table-block">
              <h3>Contact Messages</h3>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Subject</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {contactMessages.length === 0 ? (
                      <tr>
                        <td colSpan="6">No contact messages yet.</td>
                      </tr>
                    ) : (
                      contactMessages.map((message) => (
                        <tr key={message.Id}>
                          <td>{message.FullName}</td>
                          <td>{message.Email}</td>
                          <td>{message.Subject || "-"}</td>
                          <td>{message.Message}</td>
                          <td>{formatDateTime(message.CreatedAt)}</td>
                          <td>
                            <button
                              className="admin-delete-btn"
                              onClick={() => handleDeleteContactMessage(message.Id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "addMovie" && (
            <div className="admin-table-block">
              <h3>Add New Movie</h3>

              <form className="admin-movie-form" onSubmit={handleAddMovie}>
                <input
                  type="text"
                  name="Title"
                  placeholder="Movie title"
                  value={movieForm.Title}
                  onChange={handleMovieFormChange}
                  required
                />

                <input
                  type="text"
                  name="Genre"
                  placeholder="Genre"
                  value={movieForm.Genre}
                  onChange={handleMovieFormChange}
                  required
                />

                <textarea
                  name="Description"
                  placeholder="Description"
                  value={movieForm.Description}
                  onChange={handleMovieFormChange}
                  required
                />

                <input
                  type="number"
                  name="DurationMinutes"
                  placeholder="Duration in minutes"
                  value={movieForm.DurationMinutes}
                  onChange={handleMovieFormChange}
                  required
                />

                <input
                  type="text"
                  name="AgeRating"
                  placeholder="Age rating, e.g. PG-13"
                  value={movieForm.AgeRating}
                  onChange={handleMovieFormChange}
                  required
                />

                <input
                  type="number"
                  name="ReleaseYear"
                  placeholder="Release year"
                  value={movieForm.ReleaseYear}
                  onChange={handleMovieFormChange}
                  required
                />

                <input
                  type="text"
                  name="Language"
                  placeholder="Language"
                  value={movieForm.Language}
                  onChange={handleMovieFormChange}
                  required
                />

                <input
                  type="number"
                  name="TicketPrice"
                  placeholder="Ticket price"
                  value={movieForm.TicketPrice}
                  onChange={handleMovieFormChange}
                  required
                />

                <input
                  type="text"
                  name="ImageUrl"
                  placeholder="Image file name, e.g. movie.jpg"
                  value={movieForm.ImageUrl}
                  onChange={handleMovieFormChange}
                />

                <select
                  name="Status"
                  value={movieForm.Status}
                  onChange={handleMovieFormChange}
                  required
                >
                  <option value="Now Showing">Now Showing</option>
                  <option value="Premiere">Premiere</option>
                  <option value="Coming Soon">Coming Soon</option>
                </select>

                <select
                  name="HallId"
                  value={movieForm.HallId}
                  onChange={handleMovieFormChange}
                  required
                >
                  <option value="1">Hall 1</option>
                  <option value="2">Hall 2</option>
                  <option value="3">Hall 3</option>
                  <option value="4">VIP Hall</option>
                </select>

                {movieError && <p className="error-message">{movieError}</p>}
                {movieMessage && <p className="success-message">{movieMessage}</p>}

                <button type="submit" className="red-action-btn">
                  Add Movie
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default AdminDashboard;