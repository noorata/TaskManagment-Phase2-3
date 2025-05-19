import { Routes, Route, Navigate } from "react-router-dom";
import SignIn   from "../pages/SignIn";
import SignUp   from "../pages/SignUp";
import HomePage from "../pages/HomePage";
import TasksPage from "../pages/TasksPage";
import ProjectsPage from "../pages/ProjectsPage";
import ChatPage from "../pages/ChatPage";
import Layout  from "../pages/Layout";
import ProtectedRoute from "../helpers/ProtectedRoute";

const AppRoutes = () => (
  <Routes>
    {/* صفحات المصادقة */}
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />

    {/* التطبيق المحمي */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="home" />} />
      <Route path="home"     element={<HomePage />} />
      <Route path="projects" element={<ProjectsPage />} />
      <Route path="tasks"    element={<TasksPage />} />
      <Route path="chat"     element={<ChatPage />} />
    </Route>

    {/* أي مسار غير معروف */}
    <Route path="*" element={<Navigate to="/signin" replace />} />
  </Routes>
);

export default AppRoutes;
