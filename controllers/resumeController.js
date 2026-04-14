const Resume = require("../models/resume");

// Create Resume
const createResume = async (req, res) => {
  try {
    const resume = new Resume(req.body);

    // Save to DB
    const saved = await resume.save();

    // Proper response
    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resumeId: saved._id,
      data: saved
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Resumes
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find();

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {createResume,getResumes,};