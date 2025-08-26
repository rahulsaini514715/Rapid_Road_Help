import React, { useState, useContext } from "react";
import "./GarageRegister.css";
import { AuthContext } from "../../AuthContext/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GarageRegister = () => {
  const { user, token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    ownerName: user ? user.name : "",
    garageName: "",
    email: user ? user.email : "",
    phone: "",
    address: "",
    services: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("⚠️ You must be logged in to register a garage!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/garages/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("🎉 Garage registered successfully!");
        setFormData({
          ownerName: user.name,
          garageName: "",
          email: user.email,
          phone: "",
          address: "",
          services: "",
        });

        setTimeout(() => {
          window.location.reload(); // refresh page
        }, 2000);

      } else {
        if (data.message && data.message.toLowerCase().includes("exists")) {
          toast.error("⚠️ Garage already registered!");
        } else {
          toast.error(data.message || "Something went wrong!");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("🚨 Server not responding. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="garage-container">
      <form className="garage-form" onSubmit={handleSubmit}>
        <h2>Garage Registration</h2>

        {!user && <p className="login-warning">Please login to register a garage.</p>}

        <label htmlFor="ownerName">Owner Name</label>
        <input
          type="text"
          id="ownerName"
          name="ownerName"
          placeholder="Enter owner name"
          value={formData.ownerName}
          onChange={handleChange}
          required
          disabled={!user}
        />

        <label htmlFor="garageName">Garage Name</label>
        <input
          type="text"
          id="garageName"
          name="garageName"
          placeholder="Enter garage name"
          value={formData.garageName}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={!user}
        />

        <label htmlFor="phone">Phone Number</label>
       <input
  type="tel"
  id="phone"
  name="phone"
  placeholder="Enter phone number"
  value={formData.phone}
  onChange={(e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      // ✅ Only digits → update form state
      handleChange(e);
    } else {
      // ❌ Not a number → show notification
      toast.error("Only numbers are allowed!");
    }
  }}
  required
  maxLength="11"
  minLength="10"
  inputMode="numeric"
/>



        <label htmlFor="address">Address</label>
        <textarea
          id="address"
          name="address"
          rows="3"
          placeholder="Enter garage address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <label htmlFor="services">Services Offered</label>
        <select
          id="services"
          name="services"
          value={formData.services}
          onChange={handleChange}
          required
        >
          <option value="">Select service</option>
          <option value="Fuel Delivery">Fuel Delivery</option>
          <option value="Flat Tyre / Puncture Repair">Flat Tyre / Puncture Repair</option>
          <option value="Battery Jumpstart – Dead battery?">Battery Jumpstart</option>
          <option value="Towing Service">Towing Service</option>
          <option value="Minor On-Site Repairs">Minor On-Site Repairs</option>
          <option value="Other">Other</option>
        </select>

        <button type="submit" disabled={loading || !user}>
          {loading ? "Registering..." : "Register Garage"}
        </button>
      </form>

      {/* ✅ Toast container */}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default GarageRegister;
