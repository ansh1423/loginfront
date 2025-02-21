"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../context/Authcontext";
import axios from "axios";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const email = searchParams.get("email") || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
        email,
        otp,
      });
      login(response.data.user, response.data.token);
      router.push("/dashboard");
    } catch (error) {
      setError("Invalid or expired OTP");
    }
  };

  const handleResendOTP = async () => {
    setMessage("");
    setError("");
    setResendDisabled(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-otp`, { email });
      setMessage("✅ OTP has been resent successfully!");
    } catch (error) {
      setError("❌ Failed to resend OTP. Try again later.");
    }

    setTimeout(() => {
      setResendDisabled(false);
    }, 30000); // 30 sec cooldown
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800">🔐 OTP Verification</h2>
        <p className="text-center text-gray-600 mt-2">
          Enter the 6-digit OTP sent to <span className="font-semibold">{email}</span>
        </p>

        {error && <div className="bg-red-100 text-red-700 p-3 mt-4 rounded-md text-center">{error}</div>}
        {message && <div className="bg-green-100 text-green-700 p-3 mt-4 rounded-md text-center">{message}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="flex justify-center">
            <input
              type="text"
              maxLength="6"
              required
              className="w-2/3 text-center text-2xl tracking-widest p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              value={otp}
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            ✅ Verify OTP
          </button>

          <p className="text-center text-gray-500 text-sm">
            Didn’t receive the OTP?{" "}
            <button
              onClick={handleResendOTP}
              disabled={resendDisabled}
              className={`text-blue-600 font-semibold ${
                resendDisabled ? "opacity-50 cursor-not-allowed" : "hover:underline cursor-pointer"
              }`}
            >
              Resend OTP
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
