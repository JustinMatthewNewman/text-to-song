"use client";

import React from "react";
import { signIn } from "next-auth/react";

type Props = {};

function Login({}: Props) {
  return (
    <div className="bg-[#333333] h-screen flex flex-col items-center justify-center text-center">
      <img
        src="https://drive.google.com/uc?export=download&id=1fj7OO7X2uFYOI0zM5ZfjYB27vdI43qEr"
        alt="logo"
        className="w-20"
      />
      <button
        onClick={() => signIn("google")}
        className="text-white font-bold text-3xl animate-pulse"
      >
        Sign In to use Rythmic.
      </button>
    </div>
  );
}

export default Login;
