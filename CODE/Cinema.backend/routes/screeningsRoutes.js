const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");

// GET all screenings with movie and hall details
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT 
        s.Id,
        s.MovieId,
        m.Title AS MovieTitle,
        m.Genre,
        m.Description,
        m.ImageUrl,
        s.HallId,
        h.Name AS HallName,
        s.ScreeningDate,
        s.ScreeningTime,
        s.BasePrice,
        s.Status
      FROM dbo.Screenings s
      INNER JOIN dbo.Movies m ON s.MovieId = m.Id
      INNER JOIN dbo.Halls h ON s.HallId = h.Id
      ORDER BY s.ScreeningDate, s.ScreeningTime
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching screenings",
      error: err.message
    });
  }
});

// GET seats for one screening
router.get("/:id/seats", async (req, res) => {
  try {
    const screeningId = req.params.id;
    const pool = await poolPromise;

    const screeningResult = await pool
      .request()
      .input("ScreeningId", sql.Int, screeningId)
      .query(`
        SELECT 
          s.Id,
          s.HallId,
          h.Name AS HallName,
          h.TotalRows,
          h.SeatsPerRow
        FROM dbo.Screenings s
        INNER JOIN dbo.Halls h ON s.HallId = h.Id
        WHERE s.Id = @ScreeningId
      `);

    if (screeningResult.recordset.length === 0) {
      return res.status(404).json({
        message: "Screening not found"
      });
    }

    const screening = screeningResult.recordset[0];

    const seatsResult = await pool
      .request()
      .input("HallId", sql.Int, screening.HallId)
      .input("ScreeningId", sql.Int, screeningId)
      .query(`
        SELECT
          seats.Id,
          seats.RowLabel,
          seats.SeatNumber,
          seats.SeatType,
          CASE 
            WHEN reserved.SeatId IS NULL THEN 0
            ELSE 1
          END AS IsReserved
        FROM dbo.Seats seats
        LEFT JOIN (
          SELECT srs.SeatId
          FROM dbo.SeatReservationSeats srs
          INNER JOIN dbo.SeatReservations sr 
            ON srs.SeatReservationId = sr.Id
          WHERE sr.ScreeningId = @ScreeningId
        ) reserved ON seats.Id = reserved.SeatId
        WHERE seats.HallId = @HallId
        ORDER BY seats.RowLabel, seats.SeatNumber
      `);

    res.json({
      screening,
      seats: seatsResult.recordset
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching seats",
      error: err.message
    });
  }
});

module.exports = router;