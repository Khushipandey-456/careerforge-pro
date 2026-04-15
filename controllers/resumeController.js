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
// Update Resume 

const updateResume = async (req, res) => {
  try {
    const resumeId = req.params.id; // ✅ use resume id from URL

    const resumeData = req.body;

    const updatedResume = await Resume.findByIdAndUpdate(
      resumeId,
      resumeData,
      { new: true, runValidators: true }
    );

    if (!updatedResume) {
      return res.status(404).json({
        message: "Resume not found",
        error: true
      });
    }

    res.status(200).json({
      message: "Resume updated successfully",
      data: updatedResume,
      error: false
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
      error: true
    });
  }
};

module.exports = {createResume,getResumes,updateResume};