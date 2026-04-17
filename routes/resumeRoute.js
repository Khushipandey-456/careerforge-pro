const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const { createResume, getResumes, updateResume, deleteResume} = require("../controllers/resumeController");

router.post("/create", protect, createResume);
router.get("/",getResumes);
router.put("/update/:id", protect, updateResume);
router.delete("/:id", protect, deleteResume);

module.exports = router;