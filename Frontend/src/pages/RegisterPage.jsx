import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import TurnstileCaptcha from "../components/common/TurnstileCaptcha";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gstNumber: "",
    mobileNumber: "",
    email: "",
    password: "",
    businessName: "",
  });
  const [captchaToken, setCaptchaToken] = useState("");
  const [error, setError] = useState("");

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
      const payload = {
        ...formData,
        mobileNumber: Number(formData.mobileNumber),
        gstNumber: String(formData.gstNumber).trim(),
        captchaToken,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/`,
        payload
      );

      if (response.status === 201) {
        navigate("/login");
      }

      setFormData({
        gstNumber: "",
        mobileNumber: "",
        email: "",
        password: "",
        businessName: "",
      });
      setCaptchaToken("");
    } catch (err) {
      const message = err?.response?.data?.message || "Registration failed";
      setError(message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Register
        </h2>
        <div className="mb-4">
          <label
            htmlFor="businessName"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Business Name
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="gst"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            GST Number
          </label>
          <input
            type="text"
            id="gst"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="mobile"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            pattern="[0-9]{10}"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600 mb-1"
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
            className="block text-sm font-medium text-gray-600 mb-1"
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
          Register
        </button>
        {error && (
          <p className="text-center text-red-500 mt-4">{error}</p>
        )}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
