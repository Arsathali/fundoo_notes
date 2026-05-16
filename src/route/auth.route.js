import express from "express";
import { login , register , forgetPassword, resetPassword }from '../controller/auth.controller.js';


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: Test@123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', login);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register New User
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Arsha
 *               email:
 *                 type: string
 *                 example: arsha@gmail.com
 *               password:
 *                 type: string
 *                 example: Test@123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: User already exists
 */
router.post('/register',register);

/**
 * @swagger
 * /forget-password:
 *   post:
 *     summary: Send Password Reset Link
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *     responses:
 *       200:
 *         description: Reset link sent successfully
 */
router.post('/forget-password',forgetPassword);

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset User Password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 example: NewPass@123
 *     responses:
 *       200:
 *         description: Password reset successful
 *       401:
 *         description: Invalid or expired token
 */
router.post('/reset-password', resetPassword);


export default router;