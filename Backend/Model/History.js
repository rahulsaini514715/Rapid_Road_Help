import mongoose from "mongoose";


const historySchema = new mongoose.Schema({
  serviceName: String,
  price: Number,
  address: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  completedAt: { type: Date, default: Date.now },
});

export default mongoose.model("History", historySchema);
