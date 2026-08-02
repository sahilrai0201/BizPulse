import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import TurnstileCaptcha from "../components/common/TurnstileCaptcha";

function SignInPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!captchaToken) {
      setError("Please complete the captcha verification.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/login`,
        { ...formData, captchaToken }
      );

      const data = response.data;
      localStorage.setItem("token", data.token);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
      // Clean up legacy saved passwords for security
      localStorage.removeItem("rememberedPassword");

      navigate("/overview");
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed";
      setError(message);
    }
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
        <div className="mb-4">
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

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 block text-sm text-gray-100 cursor-pointer select-none"
          >
            Remember me
          </label>
        </div>

        <TurnstileCaptcha 
          onVerify={setCaptchaToken} 
          onExpire={() => setCaptchaToken("")} 
          onError={() => setCaptchaToken("")} 
        />

        <button
          type="submit"
          disabled={!captchaToken}
          className={`w-full py-2 rounded-md transition text-white font-medium ${
            captchaToken 
              ? "bg-blue-500 hover:bg-blue-600 cursor-pointer" 
              : "bg-blue-500 opacity-50 cursor-not-allowed"
          }`}
        >
          Sign In
        </button>
        {error && (
          <p className="text-center text-red-400 mt-4">{error}</p>
        )}
        <p className="text-center text-gray-100 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignInPage;
