import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  price: { type: Number, required: true },
  address: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
  garage: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Garage",
    default: null
  },
  assignedMechanic: {
    name: { type: String, default: null },
    phone: { type: String, default: null }
  },
  status: {
    type: String,
    enum: ["pending", "active", "complete", "Rejected"],
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;
