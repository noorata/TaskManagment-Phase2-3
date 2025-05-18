import React, { useState } from "react";
import { useAuth } from "../context/auth-store";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password."); return;
    }
    try {
      await login(email, password); navigate("/");
    } catch (err) {
      alert("Login failed. Please check your credentials.");
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 text-white">
      <div className="w-full max-w-md rounded-lg bg-surface2 p-8 shadow-lg">
        <h2 className="mb-6 text-3xl font-bold">Sign In</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm">Username</label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 focus:border-primary focus:ring-primary"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-1 block text-sm">Password</label>
            <input
              id="password"
              type="password"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 focus:border-primary focus:ring-primary"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Stay signed in (checkbox) */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-primary"
            />
            Stay Signed In
          </label>

          {/* Button */}
          <button
            type="submit"
            className="w-full rounded-md bg-primary py-3 font-medium transition-colors hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
