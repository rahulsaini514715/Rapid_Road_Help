
import Booking from "../Model/Booking.js";
import Garage from "../Model/Garage.js"
import History from "../Model/History.js";
import sendResponse from "../helper/responseHelper.js";

export const createBooking = async (req, res) => {
  try {
    const { serviceName, price, address, paymentMethod } = req.body;

    // Check required fields
    if (!serviceName || !price || !address || !paymentMethod) {
      return sendResponse(res, 400, false, "Missing required fields");
    }

    // ✅ Attach logged-in userId (assuming you set req.user in auth middleware)
    const booking = new Booking({
      serviceName,
      price,
      address,
      paymentMethod,
      user: req.user._id   // link booking with the current user
    });

    await booking.save();

    return sendResponse(res, 201, true, "Booking successful", booking);
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, false, "Server error");
  }
};


// Get all bookings (admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      // .populate("user", "username email"); // populate user info

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};





// for user

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id });

    if (!bookings || bookings.length === 0) {
      return sendResponse(res, 404, false, "No bookings found for this user");
    }

    return sendResponse(res, 200, true, "Bookings fetched", bookings);
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, false, "Server error");
  }
};




export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    // If booking does not exist or booking.user is missing or does not match current user
    if (!booking || !booking.user || booking.user.toString() !== req.user._id.toString()) {
      return sendResponse(res, 404, false, "Booking not found");
    }

    // ✅ Booking exists and belongs to current user
    return sendResponse(res, 200, true, "Booking fetched", booking);
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, false, "Server error");
  }
};





// Admin page 
// Update status of existing booking
// Update status and optionally move to history
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, removeFromTracking } = req.body; // removeFromTracking = true if user wants to hide

    const booking = await Booking.findById(id).populate("user");
    if (!booking) return sendResponse(res, 404, false, "Booking not found");

    // Update booking status
    booking.status = status;
    await booking.save();

    // If status is complete, move to History
    if (status === "complete") {
      const historyEntry = new History({
        serviceName: booking.serviceName,
        price: booking.price,
        address: booking.address,
        user: booking.user._id,
        completedAt: new Date(),
      });
      await historyEntry.save();

      // Optional: remove from tracking (hide from Status_Update view)
      if (removeFromTracking) {
        booking.status = "archived"; // or some custom flag
        await booking.save();
      }
    }

    return sendResponse(res, 200, true, "Booking updated", booking);
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, false, "Server error");
  }
};

// Delete existing booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Fetch history (completed bookings)
export const getHistory = async (req, res) => {
  try {
    const history = await History.find();
    return sendResponse(res, 200, true, "Booking history fetched", history);
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, false, "Server error");
  }
};



// PUT /api/bookings/assignGarage/:bookingId
export const assignGarageAndMechanic = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { garageId } = req.body; // Admin sends garageId

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) return sendResponse(res, 404, false, "Booking not found");

    // Find garage
    const garage = await Garage.findById(garageId);
    if (!garage) return sendResponse(res, 404, false, "Garage not found");

    // Assign garage and mechanic info
    booking.garage = garage._id;
    booking.assignedMechanic = {
      name: garage.ownerName, // use garage ownerName
      phone: garage.phone     // use garage phone
    };
    booking.status = "active"; // mark booking as active

    await booking.save();

    return sendResponse(res, 200, true, "Garage and mechanic assigned successfully", booking);
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, false, "Server error");
  }
};
