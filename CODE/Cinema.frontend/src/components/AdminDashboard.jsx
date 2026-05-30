import { useEffect, useState } from "react";

function AdminDashboard({ refreshKey }) {
  const [movies, setMovies] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadAdminData() {
    try {
      setLoading(true);

      const [moviesResponse, reservationsResponse] = await Promise.all([
        fetch("http://localhost:4000/movies"),
        fetch("http://localhost:4000/reservations")
      ]);

      const moviesData = await moviesResponse.json();
      const reservationsData = await reservationsResponse.json();

      setMovies(moviesData);
      setReservations(reservationsData);
    } catch (error) {
      console.error("Admin dashboard error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, [refreshKey]);

  const totalTickets = reservations.reduce(
    (sum, reservation) => sum + Number(reservation.NumberOfTickets || 0),
    0
  );

  const totalIncome = reservations.reduce(
    (sum, reservation) => sum + Number(reservation.TotalPrice || 0),
    0
  );

  return (
    <section id="admin" className="admin-section">
      <div className="section-heading">
        <span>Admin dashboard</span>
        <h2>Movies and reservations management</h2>
        <p>
          The admin area is only for viewing the current movies, reservations and available seats.
        </p>
      </div>

      {loading ? (
        <p className="loading-text">Loading admin data...</p>
      ) : (
        <>
          <div className="admin-stats">
            <div className="admin-stat-card">
              <strong>{movies.length}</strong>
              <span>Movies</span>
            </div>
            <div className="admin-stat-card">
              <strong>{reservations.length}</strong>
              <span>Reservations</span>
            </div>
            <div className="admin-stat-card">
              <strong>{totalTickets}</strong>
              <span>Tickets sold</span>
            </div>
            <div className="admin-stat-card">
              <strong>{totalIncome.toFixed(2)} RON</strong>
              <span>Total income</span>
            </div>
          </div>

          <div className="admin-table-block">
            <h3>Movies status</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Hall</th>
                    <th>Time</th>
                    <th>Price</th>
                    <th>Available Seats</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map((movie) => (
                    <tr key={movie.Id}>
                      <td>{movie.Id}</td>
                      <td>{movie.Title}</td>
                      <td>{movie.HallName}</td>
                      <td>{movie.ShowTime}</td>
                      <td>{movie.TicketPrice} RON</td>
                      <td>{movie.AvailableSeats}</td>
                      <td>{movie.Status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-table-block">
            <h3>Reservations</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Movie</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Tickets</th>
                    <th>Total</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.Id}>
                      <td>{reservation.Id}</td>
                      <td>{reservation.MovieTitle}</td>
                      <td>{reservation.ClientName}</td>
                      <td>{reservation.Email}</td>
                      <td>{reservation.Phone}</td>
                      <td>{reservation.NumberOfTickets}</td>
                      <td>{reservation.TotalPrice} RON</td>
                      <td>{new Date(reservation.ReservationDate).toLocaleString("en-GB")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default AdminDashboard;
