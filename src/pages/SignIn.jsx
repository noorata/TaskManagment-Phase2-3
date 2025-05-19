import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!existingUser) {
      alert("اسم المستخدم أو كلمة المرور غير صحيحة");
      return;
    }

    login(existingUser, rememberMe);
    navigate("/home");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 text-white">
      <div className="w-full max-w-md rounded-lg bg-surface2 p-8 shadow-lg">
        <h1 className="mb-8 text-3xl font-bold"> Sign In </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="user" className="mb-1 block font-semibold">
              Username
            </label>
            <input
              id="user"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 focus:border-primary focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="pass" className="mb-1 block font-semibold">
              Password
            </label>
            <input
              id="pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 focus:border-primary focus:ring-primary"
              required
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-primary"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Stay Signed In
          </label>

          <button
            type="submit"
            className="w-full rounded-md bg-primary py-3 font-medium transition hover:bg-primaryHover"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>  
    </div>
  );
};

export default SignIn;
