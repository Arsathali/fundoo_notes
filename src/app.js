import express from 'express';
import cors from 'cors';
import authRoute from './route/auth.route.js';
import noteRoute from './route/note.route.js';
import labelRoute from './route/label.route.js';
import dotenv from "dotenv";
import connectDB from './config/db.js';
import { errorHandler } from './middleware/error.middleware.js';


dotenv.config();

//database Connection
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/auth',authRoute);

app.use('/api', noteRoute);

app.use('/api', labelRoute);

//error handler middleware
app.use(errorHandler)


export default app;