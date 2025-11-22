const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const boardRoutes = require("./routes/boardRoutes");
const columnRoutes = require("./routes/columnRoutes");
const cardRoutes = require("./routes/cardRoutes");

const app = express();

const parseAllowedOrigins = () => {
  if (!process.env.CLIENT_URL) {
    return [];
  }

  return process.env.CLIENT_URL.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const buildCorsConfig = () => {
  const allowedOrigins = parseAllowedOrigins();

  return {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS error: Origin not allowed"));
    },
    credentials: true,
  };
};

app.use(cors(buildCorsConfig()));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Routers
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes); // board + board-column
app.use("/api/columns", columnRoutes); // column update/delete
app.use("/api/cards", cardRoutes); // card CRUD + move

app.use((req, res, next) => {
  const error = new Error("Kaynak bulunamadı");
  error.statusCode = 404;
  next(error);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const response = {
    message: err.message || "Sunucuda beklenmeyen bir hata oluştu",
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
});

module.exports = app;
