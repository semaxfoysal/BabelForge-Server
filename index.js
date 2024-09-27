const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectToDatabase = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const teamRoutes = require("./routes/teamRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Middleware and CORS setup
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://babel-forge.vercel.app",
    "https://babel-forge-backup.vercel.app"
  ],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

connectToDatabase()
  .then((db) => {
    app.locals.db = db;
    console.log("Connected to MongoDB");

    app.use("/api", userRoutes);
    app.use('/task', taskRoutes);
    app.use('/team', teamRoutes);

    app.get("/", (req, res) => {
      res.send("Server is Running...");
    });

    app.listen(port, () => {
      console.log(`Babel Server is running on port ${port}`);
    });
  })
  .catch((err) => console.error("Error connecting to MongoDB", err));
