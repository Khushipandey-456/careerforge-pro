const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const { createResume, getResumes } = require("../controllers/resumeController");

router.post("/create", protect, createResume);
router.get("/",getResumes);

module.exports = router;