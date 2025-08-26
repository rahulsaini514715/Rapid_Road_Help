import express from "express";
import dotenv from "dotenv";
import bookingRoutes from "./routes/bookingRoutes.js";
import garageRoutes from "./routes/garageRoutes.js";
// import contactRoutes from "./routes/contactRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/garages", garageRoutes)



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
