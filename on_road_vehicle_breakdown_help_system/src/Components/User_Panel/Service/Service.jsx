import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import "./Service.css";

const servicesData = [
  { name: "Emergency Breakdown Assistance", price: 500, icon: "🚨", desc: "Request immediate help." },
  { name: "Fuel Delivery", price: 300, icon: "🛢", desc: "Out of fuel? Get fuel at your location." },
  { name: "Flat Tyre / Puncture Repair", price: 400, icon: "🔧", desc: "On-spot tyre change/repair." },
  { name: "Battery Jumpstart", price: 350, icon: "🔋", desc: "Dead battery? Get jumpstart service." },
  { name: "Towing Service", price: 800, icon: "🚚", desc: "Vehicle towing to nearest garage." },
  { name: "Minor On-Site Repairs", price: 450, icon: "🛠", desc: "Quick fixes without towing." },
];

function Service() {
  const [selectedService, setSelectedService] = useState(null);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Loading state

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleServiceSelect = (service) => setSelectedService(service);

  const handleBooking = async () => {
    if (!isLoggedIn) {
      toast.warn("⚠️ You must login first to book a service!");
      return;
    }

    if (!selectedService) {
      toast.info("ℹ️ Please select a service to book!");
      return;
    }

    const bookingData = {
      serviceName: selectedService.name,
      price: selectedService.price,
      address,
      paymentMethod,
    };

    try {
      setLoading(true); // Start loading
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();
      setLoading(false); // Stop loading

      if (data.success) {
        toast.success("🎉 Booking Confirmed Successfully!");
        setSelectedService(null);
        setAddress("");
      } else {
        toast.error("❌ Booking failed: " + data.message);
      }
    } catch (err) {
      setLoading(false); // Stop loading on error
      toast.error("🚨 Error booking service: " + err.message);
    }
  };

  return (
    <>
      <div className="container">
        <h2>Book a Service</h2>

        <div className="services-container">
          <div className="services-row">
            {servicesData.map((service) => (
              <div
                key={service.name}
                className={`service-card ${selectedService?.name === service.name ? "selected" : ""}`}
                onClick={() => handleServiceSelect(service)}
              >
                <div className="service-icon">{service.icon}</div>
                <h5>{service.name}</h5>
                <p>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label><strong>Enter Your Address (Optional):</strong></label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main Street, City"
          />
        </div>

        <div className="payment-info">
          <p>Selected Service: <span>{selectedService ? selectedService.name : "None"}</span></p>
          <p>Charges: ₹<span>{selectedService ? selectedService.price : 0}</span></p>
          <p>Total Amount: ₹<span>{selectedService ? selectedService.price : 0}</span></p>

          <label>Payment Method:</label>
          <select
            className="form-select"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Cash">Cash on Service</option>
            <option value="UPI">UPI / QR</option>
            <option value="Card">Credit/Debit Card</option>
          </select>

          <button
            className="btn btn-primary mt-2"
            onClick={handleBooking}
            disabled={loading} // disable button while loading
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Booking...
              </>
            ) : (
              "Book Service"
            )}
          </button>
        </div>
      </div>

      {/* ✅ Toast container */}
      <ToastContainer position="top-center" style={{ marginTop: "50px" }} autoClose={3000} hideProgressBar={false} />
    </>
  );
}

export default Service;
