import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      const parsed = JSON.parse(stored);
      parsed.staySignedIn ? setUser(parsed) : localStorage.removeItem("currentUser");
    }
    setLoading(false);
  }, []);

  const login = (obj, remember = false) => {
    const u = { ...obj, staySignedIn: remember };
    setUser(u);
    remember
      ? localStorage.setItem("currentUser", JSON.stringify(u))
      : localStorage.removeItem("currentUser");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  if (loading) return null;
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
