import { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { axiosInstance } from "../utils/axios.js";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasSession = document.cookie
      .split("; ")
      .some((row) => row.startsWith("isLoggedIn=true"));

    if (!hasSession) {
      // No session was ever established on this browser — skip the network call entirely
      setUser(null);
      setLoading(false);
      return;
    }

    axiosInstance
      .get("/users/profile")
      .then((response) => {
        setUser(response.data.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/users/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
