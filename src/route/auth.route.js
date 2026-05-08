import express from "express";
import { login , register , forgetPassword, resetPassword }from '../controller/auth.controller.js';


const router = express.Router();


router.post('/login', login);
router.post('/register',register);
router.post('/forget-password',forgetPassword);
router.post('/reset-password', resetPassword);



export default router;