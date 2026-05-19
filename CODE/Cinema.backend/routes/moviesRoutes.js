const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");

// GET all movies
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Movies");

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: "Error fetching movies", error: err.message });
  }
});

// GET movie by id
router.get("/:id", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT * FROM Movies WHERE Id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching movie", error: err.message });
  }
});

// CREATE movie
router.post("/", async (req, res) => {
  try {
    const {
      Title,
      Genre,
      Description,
      DurationMinutes,
      AgeRating,
      ReleaseYear,
      Language,
      TicketPrice,
      ImageUrl,
      AvailableSeats,
      ShowTime,
      HallName,
      Status
    } = req.body;

    const pool = await poolPromise;

    await pool
      .request()
      .input("Title", sql.NVarChar, Title)
      .input("Genre", sql.NVarChar, Genre)
      .input("Description", sql.NVarChar, Description)
      .input("DurationMinutes", sql.Int, DurationMinutes)
      .input("AgeRating", sql.NVarChar, AgeRating)
      .input("ReleaseYear", sql.Int, ReleaseYear)
      .input("Language", sql.NVarChar, Language)
      .input("TicketPrice", sql.Decimal(10, 2), TicketPrice)
      .input("ImageUrl", sql.NVarChar, ImageUrl)
      .input("AvailableSeats", sql.Int, AvailableSeats)
      .input("ShowTime", sql.NVarChar, ShowTime)
      .input("HallName", sql.NVarChar, HallName)
      .input("Status", sql.NVarChar, Status)
      .query(`
        INSERT INTO Movies 
        (Title, Genre, Description, DurationMinutes, AgeRating, ReleaseYear, Language, TicketPrice, ImageUrl, AvailableSeats, ShowTime, HallName, Status)
        VALUES
        (@Title, @Genre, @Description, @DurationMinutes, @AgeRating, @ReleaseYear, @Language, @TicketPrice, @ImageUrl, @AvailableSeats, @ShowTime, @HallName, @Status)
      `);

    res.status(201).json({ message: "Movie created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error creating movie", error: err.message });
  }
});

// UPDATE movie
router.put("/:id", async (req, res) => {
  try {
    const {
      Title,
      Genre,
      Description,
      DurationMinutes,
      AgeRating,
      ReleaseYear,
      Language,
      TicketPrice,
      ImageUrl,
      AvailableSeats,
      ShowTime,
      HallName,
      Status
    } = req.body;

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("Id", sql.Int, req.params.id)
      .input("Title", sql.NVarChar, Title)
      .input("Genre", sql.NVarChar, Genre)
      .input("Description", sql.NVarChar, Description)
      .input("DurationMinutes", sql.Int, DurationMinutes)
      .input("AgeRating", sql.NVarChar, AgeRating)
      .input("ReleaseYear", sql.Int, ReleaseYear)
      .input("Language", sql.NVarChar, Language)
      .input("TicketPrice", sql.Decimal(10, 2), TicketPrice)
      .input("ImageUrl", sql.NVarChar, ImageUrl)
      .input("AvailableSeats", sql.Int, AvailableSeats)
      .input("ShowTime", sql.NVarChar, ShowTime)
      .input("HallName", sql.NVarChar, HallName)
      .input("Status", sql.NVarChar, Status)
      .query(`
        UPDATE Movies
        SET 
          Title = @Title,
          Genre = @Genre,
          Description = @Description,
          DurationMinutes = @DurationMinutes,
          AgeRating = @AgeRating,
          ReleaseYear = @ReleaseYear,
          Language = @Language,
          TicketPrice = @TicketPrice,
          ImageUrl = @ImageUrl,
          AvailableSeats = @AvailableSeats,
          ShowTime = @ShowTime,
          HallName = @HallName,
          Status = @Status
        WHERE Id = @Id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json({ message: "Movie updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating movie", error: err.message });
  }
});

// DELETE movie
router.delete("/:id", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("Id", sql.Int, req.params.id)
      .query("DELETE FROM Movies WHERE Id = @Id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json({ message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting movie", error: err.message });
  }
});

module.exports = router;