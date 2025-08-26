import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext/AuthContext";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !password) {
      toast.error("⚠️ Please enter both username and password");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8080/api/bookings/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();

      if (data.token) {
        login(data.token, data.user, navigate);
        toast.success("✅ Login successful!");
      } else {
        throw new Error("Login failed: Token not received");
      }
    } catch (err) {
      toast.error(`🚨 ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="or">or</div>
        <button
          type="button"
          className="btn-signup"
          onClick={() => navigate("/signup")}
          disabled={loading}
        >
          SignUp
        </button>
      </form>

      {/* Toastify container */}
      <ToastContainer position="top-center"  style={{ marginTop: "50px" }}autoClose={2000} />
    </div>
  );
};

export default LoginPage;
