import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // 👈 لازم نستدعي App وليس AppRoutes
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
