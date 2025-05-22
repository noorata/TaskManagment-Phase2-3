import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import AuthField from "../components/AuthField";
import { login as loginApi } from "../services/authService";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const user = await loginApi({
        UserName: username,
        password,
        staySignedIn: rememberMe,
      });
      login({ ...user, staySignedIn: rememberMe }, rememberMe);
      navigate("/home");
    } catch (err) {
      alert("فشل تسجيل الدخول: " + err.message);
    }
  }

  return (
    <AuthLayout title="Sign In">
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthField
          id="user"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <AuthField
          id="pass"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

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
    </AuthLayout>
  );
}
