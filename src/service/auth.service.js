import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import AppError from "../utils/AppError.js";
import { getChannel } from "../config/rabitMq.js";

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

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists",409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken({
    userId: user._id
  });

  return {
    message: "User registered successfully",

    token : token ,

    user : {
      id: user._id,
      name: user.name,
      email: user.email
    }
  };
};

/**
 * LOGIN LOGIC
 */
export const loginUser = async (email, password) => {

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Invalid email or password",401);
  }

  if(!user.password){
      throw new AppError(
        "Please login using Google",
        401
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid email or password",401);
  }

  const token = generateToken({ userId: user._id });

  return {
     message : "User logged in successfully",
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

  const resetLink = `http://localhost:3000/api/auth/reset-password?token=${token}`;
  const channel = getChannel();

  channel.sendToQueue(

      "emailQueue",

      Buffer.from(

          JSON.stringify({

            email,

            type: "resetPassword",

            resetLink
          })
      )
  );

  return {
    message: "Reset link sent successfully",
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
    throw new AppError("User not found", 404);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();

  return {
    message: "Password reset successful",
  };
};