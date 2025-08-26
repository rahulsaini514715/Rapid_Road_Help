import express from "express";
import {   assignGarageAndMechanic, createBooking, deleteBooking, getAllBookings, getBookingById, getHistory, getUserBookings, updateBookingStatus } from "../Controller/bookingController.js";
import { loginUser, Signup } from "../Controller/authController.js";
import { authenticateUser } from "../Middleware/authentication.js";


const router = express.Router();

router.post("/",authenticateUser, createBooking);

router.get("/getAllBookings", getAllBookings);

router.get("/getHistory",getHistory)

// for user 
router.get("/bookings/user", authenticateUser, getUserBookings);



router.get("/:id",authenticateUser, getBookingById); // NEW


//admin 
router.put("/:id", updateBookingStatus);
router.delete("/:id", deleteBooking);


// Admin assigns garage & mechanic
router.put("/assignGarage/:bookingId", assignGarageAndMechanic);


router.post("/signup", Signup);


router.post("/login", loginUser);

export default router;
