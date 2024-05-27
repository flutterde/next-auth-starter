"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'redaxios';

const VerifyEmail = () => {
  const router = useRouter();
  const sParams = useSearchParams();
  const email = sParams.get('email');
  console.log('email >>> ', email);
  const [otpCode, setOtpCode] = useState('');
  const [honeyPot, setHoneyPot] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === 'otp_code') {
      setOtpCode(e.target.value);
    } else if (e.target.name === 'honeyPot') {
      setHoneyPot(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (honeyPot) {
      setError('Invalid form submission');
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post('/api/auth/verify-email', {
        otp_code: otpCode,
      }, {
        params: { email }
      });

      if (res.status === 200) {
        console.log("Success --------------------->> ")
        setLoading(false);
        router.push('/');
      } else {
        setError('Verification failed. Please try again.');
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 400) {
        setError('Invalid OTP code.');
      } else {
        setError('Verification failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-4 border border-gray-700 rounded-lg bg-gray-800">
        <h2 className="text-3xl font-bold text-center">Verify Email</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-center">Please enter the OTP sent to your email: <span className="font-bold">{email}</span></p>
          <div className="flex flex-col">
            <label htmlFor="otp_code" className="mb-1">OTP Code</label>
            <input
              type="text"
              id="otp_code"
              name="otp_code"
              value={otpCode}
              onChange={handleChange}
              placeholder='Enter OTP Code'
              className="px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <input
            type="text"
            id="honeyPot"
            name="honeyPot"
            value={honeyPot}
            onChange={handleChange}
            className="hidden"
          />
          {loading ? <p> Loading.. </p> :
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
            >
              Verify
            </button>}
        </form>
      </div>
    </div>
  );
};

function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  );
}

export default VerifyPage;
