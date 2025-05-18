import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./helpers/AppRoutes";
import "./index.css"; // ضروري لتشغيل Tailwind

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
