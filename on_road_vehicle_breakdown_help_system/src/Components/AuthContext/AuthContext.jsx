import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  const getStoredUser = () => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  };

  const [user, setUser] = useState(getStoredUser);

  const login = (newToken, newUser,navigate) => {
    setToken(newToken);
    setUser(newUser);
    setRole(newUser.role);

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("role", newUser.role);

    // Redirect based on role — happens only once here
  if (newUser.role === "admin") {
    // navigate("/status-update", { replace: true });
    navigate("/", { replace: true });
  } else if (newUser.role === "user") {
    // navigate("/dashboard", { replace: true });
    navigate("/", { replace: true });
  }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    console.log("Logging out...");
  };

  return (
    <AuthContext.Provider value={{ token, user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
