"use client";

import React from "react";
import { signIn } from "next-auth/react";

type Props = {};

function Login({}: Props) {
  return (
<div className="bg-gradient-custom min-h-screen flex flex-col items-center justify-center text-center">
      <button
        onClick={() => signIn("google")}
        className="text-white font-bold text-3xl animate-pulse SignInButton"
      >
        MelodifyLabs
      </button>
    </div>
  );
}

export default Login;
