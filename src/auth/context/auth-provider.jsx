import React from "react";
import { AuthContext, useAuthLogic } from "./auth-store";

export const AuthProvider = ({ children }) => {
  const { username, role, login, logout } = useAuthLogic();

  return (
    <AuthContext.Provider value={{ username, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
