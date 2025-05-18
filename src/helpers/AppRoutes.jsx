import React from "react";
import {Routes, Route, Navigate } from "react-router-dom";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import TasksPage from "../pages/TasksPage";
import ProjectsPage from "../pages/ProjectsPage";
import HomePage from "../pages/HomePage";
import ChatPage from "../pages/ChatPage";
import Layout  from  "../pages/Layout";
const AppRoutes = () => (
  // <Routes>
  //   {/* Authentication Pages */}
  //   <Route path="/signin" element={<SignIn />} />
  //   <Route path="/signup" element={<SignUp />} />
  //   {/* Main Application */}
  //       <Route path="/home" element={<HomePage />} />
  //       <Route path="/Layout" element={<LayoutS />} />
  //       <Route path="/projects" element={<ProjectsPage />} />
  //       <Route path="/tasks" element={<TasksPage />} />
  //   {/* Redirect any other path to signin */}
  //   <Route path="*" element={<Navigate to="/signin" />} />
  // </Routes>

      <Routes>
        <Route path="/" element={<Layout adminName="Admin" />}>
          <Route index element={<Navigate to="/home" />} />
          <Route path="home" element={<HomePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="chat" element={<ChatPage />} />

        </Route>
      </Routes>
);
export default AppRoutes;











