'use client';

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup success", response.data);
      toast.success("Signup successful!");
      router.push("/login");
    } catch (error: any) {
      console.error("Signup Failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isFormValid = user.email && user.password && user.username;
    setButtonDisabled(!isFormValid);
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing..." : "Signup"}</h1>

      <label htmlFor="username">Username</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4"
        id="username"
        type="text"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        placeholder="Username"
      />

      <label htmlFor="email">Email</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4"
        id="email"
        type="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="Email"
      />

      <label htmlFor="password">Password</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4"
        id="password"
        type="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="Password"
      />

      <button
        onClick={onSignup}
        disabled={buttonDisabled}
        className="p-2 bg-blue-500 text-white rounded-lg mb-4 disabled:opacity-50"
      >
        {buttonDisabled ? "Fill All Fields" : "Signup"}
      </button>

      <Link href="/login" className="text-blue-600">Already have an account? Login</Link>
    </div>
  );
}
