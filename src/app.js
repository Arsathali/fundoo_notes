import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoute from './route/auth.route.js';
import noteRoute from './route/note.route.js';
import labelRoute from './route/label.route.js';
import oauthRoute from './route/oauth.route.js';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/error.middleware.js';
import { connectRabbitMQ } from './config/rabitMq.js';
import { startWorker } from './worker/email.worker.js';
import passport from "./config/passport.js";
import { swaggerSpec, swaggerUi } from "./config/swagger.js";


//database Connection
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(passport.initialize());

app.use('/api/auth', authRoute);
app.use('/api/auth', oauthRoute);

app.use('/api', noteRoute);

app.use('/api', labelRoute);

app.use(
    '/api-docs' , 
    swaggerUi.serve , 
    swaggerUi.setup(swaggerSpec)
);



//error handler middleware
app.use(errorHandler);


// connect RABBITMQ
await connectRabbitMQ();

// WORKER
await startWorker();

export default app;