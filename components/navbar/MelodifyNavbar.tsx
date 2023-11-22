"use client";
import React, { useState, useEffect } from "react";

import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Button,
  Avatar,
} from "@nextui-org/react";

import ThemeSwitcher from "./ThemeSwitcher";

import Link from "next/link";
import SongMenu from "./SongMenu";
import { useSession } from "next-auth/react";
type Props = {};

export default function MelodifyNavbar({}: Props) {
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Navbar
      isBordered
      isBlurred={false}
      isMenuOpen={isOpen}
      className={`fixed w-full h-20 z-[100]`}
    >
      <NavbarContent className="hidden gap-4 md:flex">
        <NavbarBrand>
          <Link color="foreground" href="/">
            {/* <Logo /> */}
            <p
              style={{
                marginRight: "12px",
                fontSize: "2.5rem",
                fontWeight: "800",
                fontFamily:
                  "ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
              }}
            >
              MelodifyLabs
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">

        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        {session && (
          <NavbarItem>
            <Button
              style={{ zIndex: 2, display: "flex" }}
              onClick={() => setIsOpen(!isOpen)}
            >
              <NavbarMenuToggle style={{ pointerEvents: "none" }} />
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
      <NavbarMenu
        className="overflow-y-hidden items-center flex"
        onClick={() => setIsOpen(!isOpen)}
      >
        <SongMenu />
      </NavbarMenu>
    </Navbar>
  );
}
