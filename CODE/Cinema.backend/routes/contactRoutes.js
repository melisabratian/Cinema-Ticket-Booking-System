const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");

// POST contact message
router.post("/", async (req, res) => {
  try {
    const { FullName, Email, Subject, Message } = req.body;

    if (!FullName || !Email || !Message) {
      return res.status(400).json({
        message: "Full name, email and message are required"
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
        INSERT INTO ContactMessages
        (FullName, Email, Subject, Message)
        VALUES
        (@FullName, @Email, @Subject, @Message)
      `);

    res.status(201).json({
      message: "Contact message sent successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: "Error sending contact message",
      error: err.message
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT *
      FROM ContactMessages
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

module.exports = router;