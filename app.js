const express = require("express");
const app = express();

app.use(express.json());

const userRoutes = require("./routes/userRoute");
const resumeRoutes = require("./routes/resumeRoute");

app.use("/api/users", userRoutes);
app.use("/api/resume", resumeRoutes);

module.exports = app;