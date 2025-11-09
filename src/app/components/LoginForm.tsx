"use client";
import React, { SetStateAction, useState } from "react";
import Image from "next/image";
interface props {
  setFormState: React.Dispatch<SetStateAction<string>>;
  role?: string;
}

export const LoginForm = ({ setFormState, role }: props) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Clear previous errors
    setErrorMessage("");

    // Client-side validation
    if (!email.trim() || !pass.trim()) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const formData = {
        email: email.trim(),
        password: pass,
      };

      const apiEndpoint = role === "driver" ? "/api/dlogin" : "/api/plogin";
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", // Important: Include cookies in the request
      });

      const data = await response.json();

      if (!response.ok || !data.success || data.error) {
        // Handle different error types
        const errorMsg =
          data.error || data.message || "Login failed. Please try again.";
        setErrorMessage(errorMsg);
        return;
      }

      // Success - cookies are already set by the server in the response headers
      // No need to set them client-side
      setErrorMessage("");

      // Small delay to ensure cookies are set before redirect
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Redirect to home page
      window.location.href = "/";
    } catch (err) {
      console.error("Login error:", err);
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
    <form
      onSubmit={handleSubmit}
      className="p-6 space-y-4 md:space-y-6 sm:p-8 shadow-xl border rounded-md"
    >
      <div className="w-full">
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}
        <Image
          width={96}
          height={60}
          className="w-[96px] h-[60px] mx-auto"
          src="/img/logo.png"
          alt="logo"
        />
      </div>
      <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        Sign in to your account
      </h1>
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Your email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrorMessage(""); // Clear error when user types
          }}
          name="email"
          id="email"
          required
          className={`bg-gray-50 border ${
            errorMessage ? "border-red-500" : "border-gray-300"
          } text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
          placeholder="name@company.com"
          disabled={loading}
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
            setErrorMessage(""); // Clear error when user types
          }}
          id="password"
          required
          placeholder="••••••••"
          className={`bg-gray-50 border ${
            errorMessage ? "border-red-500" : "border-gray-300"
          } text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Don&apos;t have an account yet?
        <span
          onClick={() => {
            setFormState("register");
          }}
          className="ml-2 font-medium text-mustard-700 hover:underline dark:text-primary-500 hover:cursor-pointer"
        >
          Sign up
        </span>
      </p>
    </form>
  );
};

export default LoginForm;
