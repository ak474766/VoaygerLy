"use client"
import React from "react";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/90 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Voyagerly</span>
          </div>
          <span className="hidden sm:inline text-gray-400">/</span>
          <span className="hidden sm:inline text-gray-600 font-medium">Home</span>
        </div>
        <nav className="flex items-center gap-4">
          <SignedOut>
            <Link href="/sign-in" className="px-6 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">Sign in</Link>
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
