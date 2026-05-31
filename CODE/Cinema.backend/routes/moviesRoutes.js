// CREATE movie + screenings
router.post("/", async (req, res) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

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
      Status,
      HallId
    } = req.body;

    if (
      !Title ||
      !Genre ||
      !Description ||
      !DurationMinutes ||
      !AgeRating ||
      !ReleaseYear ||
      !Language ||
      !TicketPrice ||
      !Status
    ) {
      return res.status(400).json({
        message: "All required movie fields must be completed."
      });
    }

    await transaction.begin();

    const selectedHallId = Number(HallId || 1);

    let hallName = "Hall 1";

    if (selectedHallId === 2) {
      hallName = "Hall 2";
    } else if (selectedHallId === 3) {
      hallName = "Hall 3";
    } else if (selectedHallId === 4) {
      hallName = "VIP Hall";
    }

    const mainShowTime = Status === "Coming Soon" ? "TBA" : "16:00";

    const movieInsert = await new sql.Request(transaction)
      .input("Title", sql.NVarChar, Title)
      .input("Genre", sql.NVarChar, Genre)
      .input("Description", sql.NVarChar, Description)
      .input("DurationMinutes", sql.Int, Number(DurationMinutes))
      .input("AgeRating", sql.NVarChar, AgeRating)
      .input("ReleaseYear", sql.Int, Number(ReleaseYear))
      .input("Language", sql.NVarChar, Language)
      .input("TicketPrice", sql.Decimal(10, 2), Number(TicketPrice))
      .input("ImageUrl", sql.NVarChar, ImageUrl || "default-movie.jpg")
      .input("AvailableSeats", sql.Int, 100)
      .input("ShowTime", sql.NVarChar, mainShowTime)
      .input("HallName", sql.NVarChar, hallName)
      .input("Status", sql.NVarChar, Status)
      .query(`
        INSERT INTO dbo.Movies
        (
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
        )
        OUTPUT INSERTED.Id
        VALUES
        (
          @Title,
          @Genre,
          @Description,
          @DurationMinutes,
          @AgeRating,
          @ReleaseYear,
          @Language,
          @TicketPrice,
          @ImageUrl,
          @AvailableSeats,
          @ShowTime,
          @HallName,
          @Status
        )
      `);

    const movieId = movieInsert.recordset[0].Id;

    if (Status !== "Coming Soon") {
      for (let day = 0; day <= 7; day++) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + day);

        const formattedDate = currentDate.toISOString().split("T")[0];
        const times = ["16:00", "19:30", "21:00"];

        for (const time of times) {
          await new sql.Request(transaction)
            .input("MovieId", sql.Int, movieId)
            .input("HallId", sql.Int, selectedHallId)
            .input("ScreeningDate", sql.Date, formattedDate)
            .input("ScreeningTime", sql.NVarChar, time)
            .input("BasePrice", sql.Decimal(10, 2), Number(TicketPrice))
            .input("Status", sql.NVarChar, "Available")
            .query(`
              INSERT INTO dbo.Screenings
              (
                MovieId,
                HallId,
                ScreeningDate,
                ScreeningTime,
                BasePrice,
                Status
              )
              VALUES
              (
                @MovieId,
                @HallId,
                @ScreeningDate,
                @ScreeningTime,
                @BasePrice,
                @Status
              )
            `);
        }
      }
    }

    await transaction.commit();

    res.status(201).json({
      message: "Movie added successfully.",
      movieId
    });
  } catch (err) {
    try {
      await transaction.rollback();
    } catch (rollbackError) {
      console.error("Rollback error:", rollbackError);
    }

    console.error("Error adding movie:", err);

    res.status(500).json({
      message: "Error adding movie",
      error: err.message
    });
  }
});