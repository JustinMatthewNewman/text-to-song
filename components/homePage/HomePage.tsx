"use client";
import React, { useEffect, useState } from "react";
import AppsHero from "./AppsHero";
import StarsInfo from "./StarsInfo";
import Image from "next/image";
import bgLines from "../../public/images/background/looper-pattern.svg";
import MacDisplay from "./MacDisplay";
import AppsHero2 from "./AppsHero2";
import BackgroundImage from "@/components/background/BackgroundImage";
import { Session } from "next-auth";
import Footer from "../footer/Footer";

type Props = {
    session: Session | null;
  };

export default function HomePage({ session }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <div className="w-full">
      <BackgroundImage />
      <AppsHero session={session} />

      <div
        style={{ backdropFilter: "blur(5px" }}
        className="border-none bg-blur bg-background/60 dark:bg-black-100/50 w-full mb-12"
      >
        <div className="container flex flex-col md:flex-row items-center justify-center mt-12 gap-4 max-w-[1200px]">
          <MacDisplay />
          <StarsInfo />
        </div>
      </div>

      <AppsHero2 />

      <Image
        className="hidden md:flex"
        fill={true}
        src={bgLines}
        alt="Background"
        quality={100}
        priority
        style={{
          zIndex: -1,
          marginTop: 70,
        }}
      />
      <Footer/>
    </div>
  );
}
