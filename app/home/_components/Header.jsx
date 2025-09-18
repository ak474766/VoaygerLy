"use client";
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
          <span className="hidden sm:inline text-gray-600 font-medium">
            Home
          </span>
        </div>
        <nav className="flex items-center gap-2 md:gap-4">
          <SignedIn>
            {/* Cart Icon */}
            <Link
              href="/home/cart"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group"
            >
              <svg
                className="w-6 h-6 text-gray-600 group-hover:text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                0
              </span>
            </Link>

            {/* My Orders Icon */}
            <Link
              href="/home/my-orders"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors group"
            >
              <svg
                className="w-6 h-6 text-gray-600 group-hover:text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </Link>

            {/* Seller Dashboard Icon */}
            <Link
              href="/service-provider/setup"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors group"
            >
              <svg
                className="w-6 h-6 text-gray-600 group-hover:text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </Link>
          </SignedIn>

          <SignedOut>
            <Link
              href="/sign-in"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Sign in
            </Link>
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
