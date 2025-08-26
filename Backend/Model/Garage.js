// models/Garage.js
import mongoose from "mongoose";

const garageSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  garageName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  services: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Garage", garageSchema);
