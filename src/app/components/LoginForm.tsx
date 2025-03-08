"use client";
import React, { SetStateAction, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
interface props {
  setFormState: React.Dispatch<SetStateAction<string>>;
  role?: string;
}

export const LoginForm = ({ setFormState, role }: props) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (email === "" || pass === "") {
      setErrorMessage("*Fill all the fields");
      return;
    }

    if (role === "driver") {
      try {
        const formData = {
          email: email,
          password: pass,
          // role: "student",
        };
        const response = await fetch("/api/dlogin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        console.log("res", data);

        if (data.error) {
          // alert(data.error);
          setErrorMessage(data?.error);
          console.log("da", data);
        } else {
          setErrorMessage("");
          document.cookie = `token=${data.token}; path=/; Secure`;
          document.cookie = `uuid=${data.userId}; path=/; Secure`;
          router.push("/");
        }
      } catch (err) {
        console.log("error", err);
      }
    } else {
      try {
        const formData = {
          email: email,
          password: pass,
          // role: "student",
        };
        const response = await fetch("/api/plogin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        console.log("res", data);

        if (data.error) {
          // alert(data.error);
          setErrorMessage(data?.error);
          console.log("da", data);
        } else {
          setErrorMessage("");
          document.cookie = `token=${data.token}; path=/; Secure`;
          document.cookie = `uuid=${data.userId}; path=/; Secure`;
          router.push("/");
        }
      } catch (err) {
        console.log("error", err);
      }
    }
  };
  return (
    <div className="p-6 space-y-4 md:space-y-6 sm:p-8 shadow-xl border rounded-md">
      <div className="w-full">
        <p className="text-red-500">{errorMessage}</p>
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
          // type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          name="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="name@company.com"
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
          }}
          id="password"
          placeholder="••••••••"
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-black text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        Sign in
      </button>
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Don’t have an account yet?
        <span
          onClick={() => {
            setFormState("register");
          }}
          className="ml-2 font-medium text-mustard-700 hover:underline dark:text-primary-500 hover:cursor-pointer"
        >
          Sign up
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
