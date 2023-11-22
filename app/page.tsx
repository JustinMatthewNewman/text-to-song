'use client'
import HomePage from "@/components/homePage/HomePage";
import React from "react";
import { useSession } from "next-auth/react";

type Props = {
};

export default function Home({ }: Props) {
  const { data: session } = useSession();

  return (
    <div className="w-full">
      <HomePage session={session}/>
    </div>
  );
}
