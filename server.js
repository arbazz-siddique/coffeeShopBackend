import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cloudinary from "cloudinary";
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

import connectDB from './config/db.js';
import { errorMiddleware } from './middleware/error.js';

import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import contactRoutes from './routes/contactRoutes.js'

dotenv.config({path: "./config/db.js"});

const app = express();

// 🛑 Move `cookieParser` before `cors`
app.use(cookieParser());

app.use(cors({
    origin: [process.env.FRONTEND_URI, process.env.DASHBOARD_URI],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true, 
}));

// Cloudinary Configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware
app.use(express.json());  // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data
app.use(bodyParser.json()); // (Optional) Parses JSON, but express.json() already does this
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "./temp/",  // ✅ Fix incorrect temp directory
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/reservations', reservationRoutes);
app.use("/api/contacts", contactRoutes);

// ✅ Move Error Middleware to the End
app.use(errorMiddleware);

// Connect to MongoDB before starting the server
connectDB().then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port: ${process.env.PORT || 5000}`);
    });
}).catch(err => {
    console.error('Database connection failed:', err);
});
