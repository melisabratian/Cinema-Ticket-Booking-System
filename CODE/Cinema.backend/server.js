const express = require("express");
const cors = require("cors");
require("dotenv").config();

const moviesRoutes = require("./routes/moviesRoutes");
const reservationsRoutes = require("./routes/reservationsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/movies", moviesRoutes);
app.use("/reservations", reservationsRoutes);

app.get("/", (req, res) => {
  res.send("Cinema Ticket Booking API is running");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});