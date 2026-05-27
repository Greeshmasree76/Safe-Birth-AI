const bcrypt = require("bcryptjs");

const User = require("../models/User");

const demoUsers = [
  {
    name: "Admin Manager",
    email: "admin@safebirth.ai",
    password: "admin123",
    role: "Admin",
    title: "Hospital Administrator",
  },
  {
    name: "Dr. Priya Sharma",
    email: "doctor@safebirth.ai",
    password: "doctor123",
    role: "Doctor",
    title: "Gynecologist",
  },
  {
    name: "Nurse Anjali",
    email: "nurse@safebirth.ai",
    password: "nurse123",
    role: "Nurse/Staff",
    title: "Hospital Staff",
  },
  {
    name: "Data Analyst",
    email: "analyst@safebirth.ai",
    password: "analyst123",
    role: "Data Analyst",
    title: "Clinical Data Analyst",
  },
];

const seedDemoUsers = async () => {
  try {
    for (const demoUser of demoUsers) {
      const existingUser = await User.findOne({
        email: demoUser.email,
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(demoUser.password, 10);

        await User.create({
          ...demoUser,
          password: hashedPassword,
        });

        console.log(`Demo user created: ${demoUser.email}`);
      }
    }
  } catch (error) {
    console.log("Demo user seed error:", error.message);
  }
};

module.exports = seedDemoUsers;