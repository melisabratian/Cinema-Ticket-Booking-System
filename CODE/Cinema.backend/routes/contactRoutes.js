const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");

router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT 
        Id,
        FullName,
        Email,
        Subject,
        Message,
        CreatedAt
      FROM dbo.ContactMessages
      ORDER BY CreatedAt DESC
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching contact messages",
      error: err.message
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { FullName, Email, Subject, Message } = req.body;

    if (!FullName || !Email || !Message) {
      return res.status(400).json({
        message: "Full name, email and message are required."
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(Email)) {
      return res.status(400).json({
        message: "Please enter a valid email address."
      });
    }

    const pool = await poolPromise;

    await pool
      .request()
      .input("FullName", sql.NVarChar, FullName)
      .input("Email", sql.NVarChar, Email)
      .input("Subject", sql.NVarChar, Subject || "")
      .input("Message", sql.NVarChar, Message)
      .query(`
        INSERT INTO dbo.ContactMessages
        (FullName, Email, Subject, Message)
        VALUES
        (@FullName, @Email, @Subject, @Message)
      `);

    res.status(201).json({
      message: "Your message was sent successfully."
    });
  } catch (err) {
    res.status(500).json({
      message: "Error sending contact message",
      error: err.message
    });
  }
});

// DELETE contact message by id
router.delete("/:id", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("Id", sql.Int, req.params.id)
      .query(`
        DELETE FROM dbo.ContactMessages
        WHERE Id = @Id
      `);

    res.json({
      message: "Contact message deleted successfully."
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting contact message",
      error: err.message
    });
  }
});

module.exports = router;