const User = require("../models/user");
const jwt = require("jsonwebtoken");


const signup = async (req, res) => {
  try {
    return res.status(201).json({
      success: true,
      message: "User created"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,   
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, login };