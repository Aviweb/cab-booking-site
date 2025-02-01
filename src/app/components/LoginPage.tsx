"use client";
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export const LoginPage = () => {
  const [formState, setFormState] = useState("login");
  return (
    <div className="bg-cover  bg-center bg-[url('/lg2.png')] dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white  rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          {formState === "login" ? (
            <LoginForm setFormState={setFormState} />
          ) : (
            <RegisterForm setFormState={setFormState} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
