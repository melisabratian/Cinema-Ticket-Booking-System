const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");

router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT
        sr.Id,
        sr.ClientName,
        sr.Email,
        sr.Phone,
        sr.ReservationDate,
        sr.TotalPrice,
        sc.ScreeningDate,
        sc.ScreeningTime,
        m.Title AS MovieTitle,
        h.Name AS HallName,
        STRING_AGG(CONCAT(se.RowLabel, se.SeatNumber), ', ') AS Seats
      FROM dbo.SeatReservations sr
      INNER JOIN dbo.Screenings sc ON sr.ScreeningId = sc.Id
      INNER JOIN dbo.Movies m ON sc.MovieId = m.Id
      INNER JOIN dbo.Halls h ON sc.HallId = h.Id
      INNER JOIN dbo.SeatReservationSeats srs ON sr.Id = srs.SeatReservationId
      INNER JOIN dbo.Seats se ON srs.SeatId = se.Id
      GROUP BY
        sr.Id,
        sr.ClientName,
        sr.Email,
        sr.Phone,
        sr.ReservationDate,
        sr.TotalPrice,
        sc.ScreeningDate,
        sc.ScreeningTime,
        m.Title,
        h.Name
      ORDER BY sr.ReservationDate DESC
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching seat reservations",
      error: err.message
    });
  }
});

// CREATE seat reservation
router.post("/", async (req, res) => {
  const transaction = new sql.Transaction(await poolPromise);

  try {
    const {
      ScreeningId,
      ClientName,
      Email,
      Phone,
      SeatIds
    } = req.body;

    if (!ScreeningId || !ClientName || !Email || !SeatIds || SeatIds.length === 0) {
      return res.status(400).json({
        message: "Screening, client name, email and selected seats are required."
      });
    }

    await transaction.begin();

    const request = new sql.Request(transaction);

    const screeningResult = await request
      .input("ScreeningId", sql.Int, ScreeningId)
      .query(`
        SELECT 
          sc.Id,
          sc.BasePrice,
          sc.Status,
          sc.ScreeningDate,
          m.Title AS MovieTitle
        FROM dbo.Screenings sc
        INNER JOIN dbo.Movies m ON sc.MovieId = m.Id
        WHERE sc.Id = @ScreeningId
      `);

    if (screeningResult.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Screening not found."
      });
    }

    const screening = screeningResult.recordset[0];

    if (screening.Status === "Coming Soon") {
      await transaction.rollback();
      return res.status(400).json({
        message: "Tickets are not available yet for this movie."
      });
    }

    const selectedDate = new Date(screening.ScreeningDate);
    const today = new Date();
    const maxDate = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    maxDate.setHours(0, 0, 0, 0);
    maxDate.setDate(today.getDate() + 7);

    if (selectedDate < today || selectedDate > maxDate) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Tickets can only be booked from today up to the next 7 days."
      });
    }

    const totalPrice = Number(screening.BasePrice) * SeatIds.length;

    const reservationInsert = await request
      .input("ClientName", sql.NVarChar, ClientName)
      .input("Email", sql.NVarChar, Email)
      .input("Phone", sql.NVarChar, Phone || "")
      .input("TotalPrice", sql.Decimal(10, 2), totalPrice)
      .query(`
        INSERT INTO dbo.SeatReservations
        (ScreeningId, ClientName, Email, Phone, TotalPrice)
        OUTPUT INSERTED.Id
        VALUES
        (@ScreeningId, @ClientName, @Email, @Phone, @TotalPrice)
      `);

    const reservationId = reservationInsert.recordset[0].Id;

    for (const seatId of SeatIds) {
      const seatCheck = await new sql.Request(transaction)
        .input("ScreeningId", sql.Int, ScreeningId)
        .input("SeatId", sql.Int, seatId)
        .query(`
          SELECT srs.Id
          FROM dbo.SeatReservationSeats srs
          INNER JOIN dbo.SeatReservations sr
            ON srs.SeatReservationId = sr.Id
          WHERE sr.ScreeningId = @ScreeningId
            AND srs.SeatId = @SeatId
        `);

      if (seatCheck.recordset.length > 0) {
        await transaction.rollback();
        return res.status(400).json({
          message: "One or more selected seats are already reserved."
        });
      }

      await new sql.Request(transaction)
        .input("SeatReservationId", sql.Int, reservationId)
        .input("SeatId", sql.Int, seatId)
        .query(`
          INSERT INTO dbo.SeatReservationSeats
          (SeatReservationId, SeatId)
          VALUES
          (@SeatReservationId, @SeatId)
        `);
    }

    await transaction.commit();

    res.status(201).json({
      message: `Reservation completed successfully. Your online ticket for ${screening.MovieTitle} was sent to ${Email}.`,
      totalPrice
    });
  } catch (err) {
    try {
      await transaction.rollback();
    } catch (rollbackError) {
      console.error("Rollback error:", rollbackError);
    }

    res.status(500).json({
      message: "Error creating seat reservation",
      error: err.message
    });
  }
});

module.exports = router;