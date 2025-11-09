"use client";
import React, { useState } from "react";
import Image from "next/image";

interface Props {
  setFormState: React.Dispatch<React.SetStateAction<string>>;
  role?: string;
}

export const RegisterForm = ({ setFormState, role }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrorMessage("");

    // Client-side validation
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    // Password validation
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setErrorMessage("Password must contain at least one uppercase letter");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setErrorMessage("Password must contain at least one lowercase letter");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setErrorMessage("Password must contain at least one number");
      return;
    }

    // Password match validation
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const formData = {
        name: name.trim(),
        email: email.trim(),
        password: password,
      };

      const apiEndpoint =
        role === "driver" ? "/api/dregister" : "/api/pregister";
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success || data.error) {
        // Handle different error types
        const errorMsg =
          data.error ||
          data.message ||
          "Registration failed. Please try again.";
        setErrorMessage(errorMsg);
        return;
      }

      // Success - show success message and switch to login
      setErrorMessage("");
      setFormState("login");

      // Show success message briefly
      setTimeout(() => {
        alert("Registration successful! Please login with your credentials.");
      }, 100);
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Network error. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4 md:space-y-6 sm:p-8 shadow-xl border rounded-md">
      <div className="w-full text-center">
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}
        <Image
          width={96}
          height={60}
          className="mx-auto"
          src="/img/logo.png"
          alt="logo"
        />
      </div>

      <h1 className="text-xl text-center font-bold text-gray-900 md:text-2xl dark:text-white">
        Create an account
      </h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrorMessage(""); // Clear error when user types
            }}
            required
            className={`w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white ${
              errorMessage ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          />
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage(""); // Clear error when user types
            }}
            required
            className={`w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white ${
              errorMessage ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage(""); // Clear error when user types
            }}
            required
            className={`w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white ${
              errorMessage ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Must be at least 8 characters with uppercase, lowercase, and number
          </p>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrorMessage(""); // Clear error when user types
            }}
            required
            className={`w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white ${
              errorMessage ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-5 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {/* Switch to Login */}
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Already have an account?
          <span
            onClick={() => setFormState("login")}
            className="ml-2 font-medium text-mustard-700 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
