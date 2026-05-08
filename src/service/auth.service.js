import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import AppError from "../utils/AppError.js";

/**
 * Utility: Generate JWT
 */
const generateToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};


/**
 * REGISTER LOGIC
 */
export const registerUser = async (name, email, password) => {

  console.log(name,password,email);
  
  if (!name || !email || !password) {
    throw new AppError("Invalid credentials", 401);
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists",401);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    message: "User registered successfully",
    user,
  };
};

/**
 * LOGIN LOGIC
 */
export const loginUser = async (email, password) => {
  
  if (!email || !password) {
    throw new AppError("Invalid credentials", 401);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("User Not Found",401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Wrong Password",401);
  }

  const token = generateToken({ userId: user._id });

  return {
     message : "User Logged In",
     token 
    };
};


/**
 * GENERATE RESET TOKEN
 */
export const generateResetToken = async (email) => {

  if (!email) {
    throw new AppError("Email is required",400);
  }

  const user = await User.findOne({ email });

  // Security: don't expose user existence
  if (!user) {
    return {
      message: "If the email exists, a reset token has been sent",
    };
  }

  const token = generateToken(
    { userId: user._id, type: "reset" },
    "10m"
  );

  return {
    message: "Reset token generated",
    token,
  };
};


/**
 * RESET PASSWORD LOGIC
 */
export const resetUserPassword = async (token, newPassword) => {

  if (!token || !newPassword) {
    throw new AppError("Token and new password are required",400);
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new AppError("Invalid or expired token",401);
  }

  if (decoded.type !== "reset") {
    throw new AppError("Invalid token type",401);
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new AppError("User not found", 401);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();

  return {
    message: "Password reset successful",
  };
};