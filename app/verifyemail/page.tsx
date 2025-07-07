'use client'
import axios from "axios"
import Link from "next/link"
import React, {useState, useEffect} from "react"

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      await axios.post('/api/users/verifyemail', { token });
      setVerified(true);
    } catch (error: any) {
      console.log("❌ Verification Error:", error?.response?.data);
      setError(true);  // ✅ This was missing!
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    if (urlToken) setToken(urlToken);
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 space-y-4">
      <h1 className="text-4xl font-bold">Verify Email</h1>
      <h2 className="p-2 bg-orange-500 text-white rounded">
        Token: {token || "No token provided"}
      </h2>

      {verified && (
        <div className="text-center">
          <h2 className="text-2xl text-green-600 font-semibold">✅ Email Verified</h2>
          <Link href="/login" className="text-blue-600 underline mt-2 block">Login</Link>
        </div>
      )}

      {error && (
        <div className="text-center">
          <h2 className="text-2xl text-red-600 font-semibold">❌ Verification Failed</h2>
          <Link href="/signup" className="text-blue-600 underline mt-2 block">Go to Signup</Link>
        </div>
      )}
    </div>
  );
}
