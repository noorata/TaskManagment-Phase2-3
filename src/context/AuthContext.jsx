import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  /* عند تحميل التطبيق حاول قراءة المستخدم المخزَّن سابقًا */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("currentUser"));
    if (stored) setUser(stored);
  }, []);

  /* دوال المزوِّد */
  const login = (userObj, remember = false) => {
    setUser(userObj);
    (remember ? localStorage : sessionStorage).setItem(
      "currentUser",
      JSON.stringify(userObj)
    );
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* هوك مختصر */
export const useAuth = () => useContext(AuthContext);
