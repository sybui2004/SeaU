import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { adminLogin } from "@/api/AuthRequest";
import webLogo from "@assets/images/web-logo.png";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await adminLogin(credentials);
      console.log("Login response:", data);

      if (!data.user.isAdmin) {
        setError("Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }

      console.log("Admin login success with token:", data.token);

      localStorage.setItem("profile", JSON.stringify(data));
      dispatch({ type: "AUTH_SUCCESS", data });

      navigate("/admin");
    } catch (err: any) {
      console.error("Login error:", err);
      setLoading(false);
      setError(
        err.response?.data ||
          "Authentication failed. Please check your credentials and try again."
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#1CA7EC] to-[#4ADEDE] items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center mb-8">
          <img src={webLogo} alt="SeaU Logo" className="h-24 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-sm text-gray-600">
            Enter your credentials to access the admin panel
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <Button
            variant="gradientCustom"
            type="submit"
            className="w-full py-3 text-white font-medium"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <a href="/" className="text-blue-500 hover:underline">
            Return to regular login
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
