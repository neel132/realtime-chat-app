const express = require("express");
const path = require("path");
const cors = require("cors");

const logger = require("./src/middleware/logger.middleware");
const errorHandler = require("./src/middleware/error.middleware");

const authRoutes = require("./src/routes/auth.routes");
const chatRoutes = require("./src/routes/chat.routes");

const app = express();

app.use(express.json())
app.use(cors())

app.use(logger);

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    })
});

app.use(errorHandler);

module.exports = app;