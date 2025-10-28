import express from "express";
import UserModel from "../../models/userModel.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters long" });
    }

    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await UserModel.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const defaultProfileImages = {
      male: "https://i.pravatar.cc/300?img=12",
      female: "https://i.pravatar.cc/300?img=47"
    };

    const newUser = new UserModel({
      email,
      username,
      password,
      sex,
      profileImage: defaultProfileImages[sex]
    });

    await newUser.save();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  res.send("login");
});

export default router;
