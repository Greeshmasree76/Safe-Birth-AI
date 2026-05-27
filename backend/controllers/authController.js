const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET || "fallbacksecret",
    {
      expiresIn: "7d",
    }
  );
};

const sanitizeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
  };
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, title } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password and role are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const allowedRoles = ["Admin", "Doctor", "Nurse/Staff", "Data Analyst"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role selected",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      title: title || role,
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password and role are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      role,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid login details",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "User account is inactive",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid login details",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCurrentUser = async (req, res) => {
  res.status(200).json({
    user: sanitizeUser(req.user),
  });
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};