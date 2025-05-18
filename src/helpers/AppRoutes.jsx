import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MasterLayout from "../layout/MasterLayout";
import SignIn  from "../pages/SignIn";
import SignUp  from "../pages/SignUp";

const AppRoutes = () => (
  <Routes>
    {/* صفحات المصادقة */}
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />

    {/* أي مسار آخر يعيد التوجيه لتسجيل الدخول */}
    <Route path="*" element={<Navigate to="/signin" />} />
  </Routes>
);

export default AppRoutes;
