import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

async function sendTokenResponse(user, res, statusCode, message) {
  const token = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );

  res.cookie("token", token);

  return res.status(statusCode).json({
    message,
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
}

export const register = async (req, res) => {
  const { email, contact, password, fullname, isSeller } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await userModel.create({
      email,
      contact,
      password,
      fullname,
      role: isSeller ? "seller" : "buyer",
    });

    await sendTokenResponse(user, res, 201, "User registered successfully");
  } catch (error) {
    console.error("Error checking existing user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  await sendTokenResponse(user, res, 200, "User logged in successfully");
}

export const googleCallback = async (req, res) => {
const { id, emails, displayName, photos } = req.user;
const email = emails[0].value;
const profilePic = photos[0].value;

let user = await userModel.findOne({ email });

if(!user){
 user = await userModel.create({
    email,
    googleId: id,
    fullname: displayName,
 });
}
const token = jwt.sign(
  {
    id: user._id,
  },
  config.JWT_SECRET,
  {
    expiresIn: "3d",
  }
);

res.cookie("token", token);
res.redirect("http://localhost:5173/");
  
}