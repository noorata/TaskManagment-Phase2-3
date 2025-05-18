import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    /* هنا تستدعي API تسجيل الدخول */
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 text-white">
      <div className="w-full max-w-md rounded-lg bg-surface2 p-8 shadow-lg">
        <h1 className="mb-8 text-3xl font-bold">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
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
            />
          </div>

          {/* Password */}
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
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-primary" />
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
          No account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
