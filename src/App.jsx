import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/app/context/AuthContext";
import AppRoutes from "@/app/routes/AppRoutes";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <>
          <AppRoutes />

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </>
      </BrowserRouter>
    </AuthProvider>
  );
}
