import React from "react";
import { useAuth } from "../context/auth-store";

const Authorize = ({ allowedRoles, children }) => {
  const { role } = useAuth();
  return allowedRoles.includes(role) ? <>{children}</> : null;
};

export default Authorize;
