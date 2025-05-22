import { Routes, Route, Navigate } from "react-router-dom";

import SignIn from "@/features/auth/pages/SignIn";
import SignUp from "@/features/auth/pages/SignUp";

import HomePage     from "@/features/dashboard/pages/HomePage";
import ProjectsPage from "@/features/projects/pages/ProjectsPage";
import TasksPage    from "@/features/tasks/pages/TasksPage";
import ChatPage     from "@/features/chat/pages/ChatPage";

import MainLayout      from "@/layouts/MainLayout";
import ProtectedRoute  from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="home" />} />
        <Route path="home"     element={<HomePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="tasks"    element={<TasksPage />} />
        <Route path="chat"     element={<ChatPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}
