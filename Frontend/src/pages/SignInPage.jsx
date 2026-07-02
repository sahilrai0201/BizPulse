import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignInPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const demoCredentials = {
    email: "demo@bizz.com",
    password: "demo1234",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/login`,
        formData
      );

      const data = response.data;
      localStorage.setItem("token", data.token);
      navigate("/overview");
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed";
      setError(message);
    }
  };

  const handleDemoLogin = () => {
    localStorage.setItem("token", "demo-token");
    navigate("/overview");
  };

  return (
    <div
      className="flex items-center justify-center h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/bg-sm.png')`, 
        backgroundSize: "cover", 
        backgroundAttachment: "fixed", 
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 bg-opacity-90 p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">
          Sign In
        </h2>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full mt-3 bg-gray-700 text-white py-2 rounded-md hover:bg-gray-800 transition"
        >
          Demo Login
        </button>
        {error && (
          <p className="text-center text-red-400 mt-4">{error}</p>
        )}
        <p className="text-center text-gray-100 mt-4">
          Use demo credentials: <strong>demo@bizz.com</strong> / <strong>demo1234</strong>
        </p>
        <p className="text-center text-gray-100 mt-4">
          Don't have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}

export default SignInPage;
