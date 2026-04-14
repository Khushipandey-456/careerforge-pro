const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: String,
  skills: [String],
  experience: String,
}, { timestamps: true });

module.exports = mongoose.model("Resume", resumeSchema);