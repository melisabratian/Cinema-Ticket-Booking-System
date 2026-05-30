const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");

// GET all reservations
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT 
        Reservations.Id,
        Reservations.MovieId,
        Movies.Title AS MovieTitle,
        Reservations.ClientName,
        Reservations.Email,
        Reservations.Phone,
        Reservations.NumberOfTickets,
        Reservations.ScreeningDate,
        Reservations.ReservationDate,
        Reservations.TotalPrice
      FROM Reservations
      INNER JOIN Movies ON Reservations.MovieId = Movies.Id
      ORDER BY Reservations.ReservationDate DESC
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching reservations",
      error: err.message
    });
  }
});

// CREATE reservation
router.post("/", async (req, res) => {
  try {
    const {
      MovieId,
      ClientName,
      Email,
      Phone,
      NumberOfTickets,
      ScreeningDate
    } = req.body;

    if (!MovieId || !ClientName || !Email || !NumberOfTickets || !ScreeningDate) {
      return res.status(400).json({
        message: "Movie, name, email, number of tickets and screening date are required."
      });
    }

    const tickets = Number(NumberOfTickets);

    if (tickets <= 0) {
      return res.status(400).json({
        message: "Number of tickets must be greater than 0."
      });
    }

    const selectedDate = new Date(ScreeningDate);
    const today = new Date();
    const maxDate = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    maxDate.setHours(0, 0, 0, 0);
    maxDate.setDate(today.getDate() + 7);

    if (selectedDate < today || selectedDate > maxDate) {
      return res.status(400).json({
        message: "Tickets can only be booked from today up to the next 7 days."
      });
    }

    const pool = await poolPromise;

    const movieResult = await pool
      .request()
      .input("MovieId", sql.Int, MovieId)
      .query(`
        SELECT Title, TicketPrice, AvailableSeats, Status
        FROM Movies
        WHERE Id = @MovieId
      `);

    if (movieResult.recordset.length === 0) {
      return res.status(404).json({
        message: "Movie not found."
      });
    }

    const movie = movieResult.recordset[0];

    if (movie.Status === "Coming Soon") {
      return res.status(400).json({
        message: "Tickets are not available yet for coming soon movies."
      });
    }

    if (movie.AvailableSeats < tickets) {
      return res.status(400).json({
        message: "Not enough available seats."
      });
    }

    const totalPrice = movie.TicketPrice * tickets;

    await pool
      .request()
      .input("MovieId", sql.Int, MovieId)
      .input("ClientName", sql.NVarChar, ClientName)
      .input("Email", sql.NVarChar, Email)
      .input("Phone", sql.NVarChar, Phone || "")
      .input("NumberOfTickets", sql.Int, tickets)
      .input("ScreeningDate", sql.Date, ScreeningDate)
      .input("TotalPrice", sql.Decimal(10, 2), totalPrice)
      .query(`
        INSERT INTO Reservations
        (MovieId, ClientName, Email, Phone, NumberOfTickets, ScreeningDate, TotalPrice)
        VALUES
        (@MovieId, @ClientName, @Email, @Phone, @NumberOfTickets, @ScreeningDate, @TotalPrice)
      `);

    await pool
      .request()
      .input("MovieId", sql.Int, MovieId)
      .input("NumberOfTickets", sql.Int, tickets)
      .query(`
        UPDATE Movies
        SET AvailableSeats = AvailableSeats - @NumberOfTickets
        WHERE Id = @MovieId
      `);

    res.status(201).json({
      message: `Reservation completed successfully. Your online ticket for ${movie.Title} was sent to ${Email}.`,
      totalPrice
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating reservation",
      error: err.message
    });
  }
});

// DELETE reservation
router.delete("/:id", async (req, res) => {
  try {
    const pool = await poolPromise;

    const reservationResult = await pool
      .request()
      .input("Id", sql.Int, req.params.id)
      .query(`
        SELECT MovieId, NumberOfTickets
        FROM Reservations
        WHERE Id = @Id
      `);

    if (reservationResult.recordset.length === 0) {
      return res.status(404).json({
        message: "Reservation not found."
      });
    }

    const reservation = reservationResult.recordset[0];

    await pool
      .request()
      .input("Id", sql.Int, req.params.id)
      .query("DELETE FROM Reservations WHERE Id = @Id");

    await pool
      .request()
      .input("MovieId", sql.Int, reservation.MovieId)
      .input("NumberOfTickets", sql.Int, reservation.NumberOfTickets)
      .query(`
        UPDATE Movies
        SET AvailableSeats = AvailableSeats + @NumberOfTickets
        WHERE Id = @MovieId
      `);

    res.json({
      message: "Reservation deleted successfully."
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting reservation",
      error: err.message
    });
  }
});

module.exports = router;