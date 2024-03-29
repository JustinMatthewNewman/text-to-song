"use client";
import React from "react";
import Link from "next/link";
import { NextLogo } from "./NextLogo";
import { VercelLogo } from "./VercelLogo";
import { Spacer } from "@nextui-org/spacer";

function Footer() {

  return (
    <div className="border-none bg-background/60 dark:bg-black-100/80 w-full">
      <div className="container flex flex-col md:flex-row items-center justify-center">
        <div className="mt-8 mb-8 flex justify-center flex-col items-center">
          <div className="flex gap-5 items-center justify-center w-20">
            <Link href="https://nextjs.org/">
              <NextLogo />
            </Link>
            <Spacer x={1}/>
            <Link href="https://vercel.com/">
              <VercelLogo/>
            </Link>
          </div>

          <p
            style={{
              fontWeight: "700",
              fontFamily:
                "ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
            }}
          >
            Careers | 804-832-9881
            
          </p>
          <Link
              href="https://metalinguist.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              MelodifyLabs LLC
            </Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;
