

"use client";
import React from "react";
import HomePage from "../homePage/HomePage";
type Props = {};

export default function Login({}: Props) {
  return (
    <div className="w-full">
      <HomePage session={null}/>
    </div>
  );
}
