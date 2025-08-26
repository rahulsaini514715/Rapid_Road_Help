// controllers/garageController.js
import Garage from "../Model/Garage.js";

// Register a new garage
export const registerGarage = async (req, res) => {
  try {
    const { ownerName, garageName, email, phone, address, services } = req.body;

    // Check if garage with same email exists
    const existingGarage = await Garage.findOne({ email });
    if (existingGarage) {
      return res.status(400).json({ message: "Garage already registered with this email." });
    }

    const newGarage = new Garage({
      ownerName,
      garageName,
      email,
      phone,
      address,
      services,
    });

    await newGarage.save();
    res.status(201).json({ message: "Garage registered successfully", garage: newGarage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all garages
export const getGarages = async (req, res) => {
  try {
    const garages = await Garage.find();
    res.status(200).json(garages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const updateGarage = async (req, res) => {
  try {
    const { id } = req.params; // Garage ID from URL
    const { ownerName, garageName, email, phone, address, services } = req.body;

    // Find garage by ID and update
    const updatedGarage = await Garage.findByIdAndUpdate(
      id,
      { ownerName, garageName, email, phone, address, services },
      { new: true } // Return the updated document
    );

    if (!updatedGarage) {
      return res.status(404).json({ message: "Garage not found" });
    }
    
    res.status(200).json({ message: "Garage updated successfully", garage: updatedGarage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};





export const deleteGarage = async (req, res) => {
  try {
    const { id } = req.params; // Garage ID from URL

    const deletedGarage = await Garage.findByIdAndDelete(id);

    if (!deletedGarage) {
      return res.status(404).json({ message: "Garage not found" });
    }

    res.status(200).json({ message: "Garage deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
