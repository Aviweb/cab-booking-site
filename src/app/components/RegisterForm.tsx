// "use client";
// import React, { SetStateAction, useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// interface Props {
//   setFormState: React.Dispatch<SetStateAction<string>>;
// }

// export const RegisterForm = ({ setFormState }: Props) => {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [pass, setPass] = useState("");
//   const [name, setName] = useState("");
//   const [cpass, setCpass] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleSubmit = async () => {
//     if (email === "" || pass === "") {
//       setErrorMessage("*Fill all the fields");
//       return;
//     }
//     try {
//       const formData = {
//         email: email,
//         password: pass,
//         // role: "student",
//       };
//       const response = await fetch("/api/dlogin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       console.log("res", data);

//       if (data.error) {
//         // alert(data.error);
//         setErrorMessage(data?.error);
//         console.log("da", data);
//       } else {
//         setErrorMessage("");
//         document.cookie = `token=${data.token}; path=/; Secure`;
//         document.cookie = `uuid=${data.userId}; path=/; Secure`;
//         router.push("/");
//       }
//     } catch (err) {
//       console.log("error", err);
//     }
//   };
//   return (
//     <div className="p-6 space-y-4 md:space-y-6 sm:p-8 shadow-xl border rounded-md">
//       <div className="w-full">
//         <p className="text-red-500">{errorMessage}</p>
//         <Image
//           width={96}
//           height={60}
//           className="w-[96px] h-[60px] mx-auto"
//           src="/img/logo.png"
//           alt="logo"
//         />
//       </div>
//       <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
//         Create an account
//       </h1>
//       <form className="space-y-4 md:space-y-6" action="#">
//         {/* Name Field */}
//         <div>
//           <label
//             htmlFor="name"
//             className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//           >
//             Full Name
//           </label>
//           <input
//             type="text"
//             name="name"
//             id="name"
//             placeholder="John Doe"
//             className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//           />
//         </div>

//         {/* Email Field */}
//         <div>
//           <label
//             htmlFor="email"
//             className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//           >
//             Your email
//           </label>
//           <input
//             type="text"
//             // type="email"
//             name="email"
//             id="email"
//             placeholder="name@company.com"
//             className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//           />
//         </div>

//         {/* Password Field */}
//         <div>
//           <label
//             htmlFor="password"
//             className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//           >
//             Password
//           </label>
//           <input
//             type="password"
//             name="password"
//             id="password"
//             placeholder="••••••••"
//             className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//           />
//         </div>

//         {/* Confirm Password Field */}
//         <div>
//           <label
//             htmlFor="confirm-password"
//             className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//           >
//             Confirm Password
//           </label>
//           <input
//             type="password"
//             name="confirm-password"
//             id="confirm-password"
//             placeholder="••••••••"
//             className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full bg-black text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
//         >
//           Sign Up
//         </button>

//         {/* Switch to Login */}
//         <p className="text-sm font-light text-gray-500 dark:text-gray-400">
//           Already have an account?
//           <span
//             onClick={() => {
//               setFormState("login");
//             }}
//             className="ml-2 font-medium text-mustard-700 hover:underline dark:text-primary-500 hover:cursor-pointer"
//           >
//             Sign in
//           </span>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default RegisterForm;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (role === "driver") {
      if (!name || !email || !password || !confirmPassword) {
        setErrorMessage("*All fields are required");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("*Passwords do not match");
        return;
      }

      try {
        const formData = { name, email, password };

        const response = await fetch("/api/dregister", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.error) {
          setErrorMessage(data.error);
        } else {
          setErrorMessage("");
          window.location.reload();
        }
      } catch (err) {
        console.error("Registration error:", err);
        setErrorMessage("Something went wrong. Please try again.");
      }
    } else {
      if (!name || !email || !password || !confirmPassword) {
        setErrorMessage("*All fields are required");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("*Passwords do not match");
        return;
      }

      try {
        const formData = { name, email, password };

        const response = await fetch("/api/pregister", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.error) {
          setErrorMessage(data.error);
        } else {
          setErrorMessage("");
          window.location.reload();
        }
      } catch (err) {
        console.error("Registration error:", err);
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="p-6 space-y-4 md:space-y-6 sm:p-8 shadow-xl border rounded-md">
      <div className="w-full text-center">
        <p className="text-red-500">{errorMessage}</p>
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
            className="block text-sm font-medium text-gray-900 dark:text-white"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            type="text"
            id="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-900 dark:text-white"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-5 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none"
        >
          Sign Up
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
