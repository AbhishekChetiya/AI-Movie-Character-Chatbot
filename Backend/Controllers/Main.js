import { User } from "../Model/user.model.js";
import { avengers_endgame } from "../Model/Dialogue.model.js";
import jwt from "jsonwebtoken";

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.TOKEN, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if ([name, email, password].some((field) => field?.trim() === "")) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  const isExist = await User.findOne({ $or: [{ email }] });
  if (isExist) {
    return res.status(400).json({ message: "User Already Present" });
  }

  try {
    await User.create({ name, email, password });
    return res.status(200).json({ message: "User Successfully Login" })
  } catch (error) {
    const checkUser = await User.findById(newUser._id).select("-password -refreshToken");
    if (!checkUser) {
      return res.status(500).json({ message: "Something went wrong while registering the user" });
    }
  }
  return res.status(200).json({ message: "User Successfully Login" });
};

const loginuser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Unauthorized User" });
  }

  const check = await user.isPasswordCorrect(password);
  if (!check) {
    return res.status(400).json({ message: "Incorrect Password" });
  }
  const RefreshToken = generateRefreshToken(user);
  user.refreshToken = RefreshToken;
  user.save({ validateBeforeSave: false });
  return res.status(200).
    cookie("refreshToken", RefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    }).
    json({ user, message: "User Successfully Login" });
};


const getDialogue = async (req, res) => {
  const dialogue = await avengers_endgame.find().limit(10);
  return res.status(200).json(dialogue);
}

const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.body.id,
      { refreshToken: "" },
      { new: true }
    );
    return res.status(200).
    clearCookie("refreshToken" ,  {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    } ). json({ message: "User Logged Out Successfully" });
  }
  catch (error) {
    return res.status(500).json({ message: "Something went wrong while logging out the user" });
  }
};
export { registerUser, loginuser, getDialogue , logout };