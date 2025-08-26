import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Atom } from "react-loading-indicators"; // Loader
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS
import "./SignupPage.css";

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle signup submit
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, username, password } = formData;

    if (!name || !email || !username || !password) {
      toast.error("⚠️ Please fill all fields");
      setLoading(false);
      return;
    }

    try {
  const res = await axios.post(
    "http://localhost:8080/api/bookings/signup",
    { name, email, username, password }
  );

  const msg = res.data.message?.toLowerCase() || "";

  if (res.data.success) {
    toast.success("🎉 Signup successful!");
    setTimeout(() => navigate("/login"), 2000);
  } else if (msg.includes("exists")) {
    toast.error("⚠️User already registered! Please login.");
    setTimeout(() => navigate("/login"), 2000);
  } else {
    toast.error(res.data.message || "❌ Signup failed!");
  }
} catch (err) {
  console.error(err);
  toast.error("⚠️User already registered!");
} finally {
  setLoading(false);
}

  };

  return (
    <div className="signup-container">
      {loading ? (
        // Loader
        <div className="loader-overlay">
          <Atom color="#b4537d" size="large" text="" textColor="" />
        </div>
      ) : (
        <form className="signup" onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            required
          />

          <button type="submit" className="btn-signup">
            SignUp
          </button>

          <div className="or">or</div>

          <button
            type="button"
            className="btn-signup"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </form>
      )}

      {/* Toastify popup container */}
      <ToastContainer position="top-center"  style={{ marginTop: "50px" }}  autoClose={2000} />
    </div>
  );
};

export default SignupPage;
