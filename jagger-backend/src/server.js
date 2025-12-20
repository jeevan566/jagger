import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import indexRoutes from './routes/index.js';
import authRoutes from './routes/authRoutes.js';

import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { uploads } from './middlewares/upload.js';


const userRoutes = require("./routes/userRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const rfqRoutes = require("./routes/rfqRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const poRoutes = require("./routes/poRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const auditRoutes = require("./routes/auditRoutes")
const notificationRoutes = require("./routes/notificationRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
import "./jobs/cron.js";

dotenv.config();

const app = express();

// middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// connect DB
connectDB();

// routes
app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/rfqs", rfqRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/pos", poRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/settings", settingsRoutes);
app.use("/api/inventory", inventoryRoutes);


// 404 + error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
