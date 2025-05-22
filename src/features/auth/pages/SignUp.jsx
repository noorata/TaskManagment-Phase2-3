import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import AuthField from "../components/AuthField";
import { register as registerApi } from "../services/authService";
import { toast } from "react-toastify";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isStudent, setIsStudent] = useState(false);
  const [universityId, setUniversityId] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const user = await registerApi({
        UserName: username,
        password,
        universityId: isStudent ? universityId : undefined,
      });
      toast.success("Sign-up successful");
      login(user);              // ← تلقائيًا يُسجِّل المستخدم
      navigate("/home");
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <AuthLayout title="Sign Up">
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
            checked={isStudent}
            onChange={(e) => setIsStudent(e.target.checked)}
          />
          I am a student
        </label>

        {isStudent && (
          <AuthField
            id="univ"
            label="University ID"
            value={universityId}
            onChange={(e) => setUniversityId(e.target.value)}
          />
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-primary py-3 font-medium transition hover:bg-primaryHover"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link to="/signin" className="text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
