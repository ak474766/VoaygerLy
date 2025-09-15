"use client"
import React from "react";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 border-b">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-900">Voyagerly</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Home</span>
        </div>
        <nav className="flex items-center gap-3">
          <SignedOut>
            <Link href="/sign-in" className="px-4 py-1.5 rounded-full bg-emerald-700 text-white text-sm hover:bg-emerald-800">Sign in</Link>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
};

export default Header;
