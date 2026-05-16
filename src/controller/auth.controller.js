import * as authService from "../service/auth.service.js";
import AppError from "../utils/AppError.js";
import { registerSchema } from "../validation/auth.validator.js";



/**
 * REGISTER
 */
export const register = async (req, res, next) => {
  try {

    /**
     * VALIDATION 
     */
    const {error} = registerSchema.validate(req.body);

    if(error){
       throw new AppError(error.details[0].message,400);
    }
    
    const { name, email, password } = req.body;
    
    const result = await authService.registerUser(name, email, password);

    return res.status(201).json(result);

  } catch (err) {
    next(err);
  }
};



/**
 * LOGIN
 * Controller only handles HTTP layer
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);

    // set cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json(result);

  } catch (err) {
    next(err);
  }
};



/**
 * FORGOT PASSWORD
 */
export const forgetPassword = async (req, res, next) => {

    try {
      const { email } = req.body;

      const result = await authService.generateResetToken(email);

      return res.status(200).json(result);

    } catch (err) {
      next(err);
    }
};


/**
 * RESET PASSWORD
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    const result = await authService.resetUserPassword(token, newPassword);

    return res.status(200).json(result);

  } catch (err) {
    next(err);
  }
};