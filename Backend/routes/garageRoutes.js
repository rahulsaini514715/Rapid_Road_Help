// routes/garageRoutes.js
import express from "express";
import { authenticateUser } from "../Middleware/authentication.js";
import { deleteGarage, getGarages, registerGarage, updateGarage } from "../Controller/garageController.js";

const router = express.Router();

// POST => Register a garage
router.post("/register",authenticateUser, registerGarage);

// GET => Get all garages
router.get("/getGarages",authenticateUser, getGarages);


router.put("/garagesUpdate/:id", updateGarage);        // Update garage
router.delete("/garages/:id", deleteGarage);     // Delete garage


export default router;



