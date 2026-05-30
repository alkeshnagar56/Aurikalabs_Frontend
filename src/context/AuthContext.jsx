import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();
import { logoutUser } from "../services/authService";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await logoutUser();

      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  //   const fetchUserProfile = async () => {
  //     try {
  //       const res = await axios.get("/api/user/profile", { withCredentials: true });
  //       setUser(res.data);
  //     } catch (err) {
  //       console.error("Auth check failed:", err.response?.data);
  //       setUser(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchUserProfile();
  //   }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
