"use client"
import React, { useState } from "react";
import { assets, BagIcon, CartIcon} from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { Home, Search, Info, Phone, User, Menu, X, CarIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

const Navbar = () => {

  
  const { isSeller, router, user } = useAppContext();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className="relative sticky top-0 z-50 flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-200 text-gray-700 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 shadow-sm">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className={`group relative flex items-center gap-2 transition hover:text-gray-900 ${pathname === '/' ? 'text-gray-900' : ''}`}>
          <Home className="w-4 h-4" />
          Home
          <span className="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-0 bg-gray-900 transition-all duration-200 group-hover:w-full" />
        </Link>
        <Link href="/all-products" className={`group relative flex items-center gap-2 transition hover:text-gray-900 ${pathname === '/all-products' ? 'text-gray-900' : ''}`}>
          <Search className="w-4 h-4" />
          Find Services
          <span className="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-0 bg-gray-900 transition-all duration-200 group-hover:w-full" />
        </Link>
        <Link href="/" className={`group relative flex items-center gap-2 transition hover:text-gray-900 ${pathname === '/about' ? 'text-gray-900' : ''}`}>
          <Info className="w-4 h-4" />
          About Us
          <span className="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-0 bg-gray-900 transition-all duration-200 group-hover:w-full" />
        </Link>
        <Link href="/" className={`group relative flex items-center gap-2 transition hover:text-gray-900 ${pathname === '/contact' ? 'text-gray-900' : ''}`}>
          <Phone className="w-4 h-4" />
          Contact
          <span className="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-0 bg-gray-900 transition-all duration-200 group-hover:w-full" />
        </Link>

        {isSeller && (
          <SignedIn>
            <button
              onClick={() => router.push('/seller')}
              className="text-xs border px-4 py-1.5 rounded-full hover:bg-gray-50 active:bg-gray-100 transition"
            >
              Seller Dashboard
            </button>
          </SignedIn>
        )}

      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        <SignedIn>
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="Dashboard" labelIcon={<BagIcon />} onClick={() => router.push('/my-orders')} />
              <UserButton.Action label="Thinking List" labelIcon={<CartIcon />} onClick={() => router.push('/cart')} />
            </UserButton.MenuItems>
          </UserButton>
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in" className="flex items-center gap-2 hover:text-gray-900 transition">
            <User className="w-4 h-4" aria-label="user icon" />
            Sign in
          </Link>
          <Link href="/sign-up" className="flex items-center gap-2 hover:text-gray-900 transition">
            Sign up
          </Link>
        </SignedOut>
      </ul>

      <div className="flex items-center md:hidden gap-2">
        <button
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="p-2 rounded-md hover:bg-gray-100 active:bg-gray-200 transition"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-3 flex flex-col gap-2">
            <Link onClick={() => setMobileOpen(false)} href="/" className="flex items-center gap-2 py-2">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link onClick={() => setMobileOpen(false)} href="/all-products" className="flex items-center gap-2 py-2">
              <Search className="w-4 h-4" />
              Find Services
            </Link>
            <Link onClick={() => setMobileOpen(false)} href="/" className="flex items-center gap-2 py-2">
              <Info className="w-4 h-4" />
              About Us
            </Link>
            <Link onClick={() => setMobileOpen(false)} href="/" className="flex items-center gap-2 py-2">
              <Phone className="w-4 h-4" />
              Contact
            </Link>
            <div className="h-px bg-gray-200 my-1" />
            {isSeller && (
              <SignedIn>
                <button
                  onClick={() => { setMobileOpen(false); router.push('/seller'); }}
                  className="text-xs border px-4 py-1.5 rounded-full self-start hover:bg-gray-50 active:bg-gray-100 transition"
                >
                  Seller Dashboard
                </button>
              </SignedIn>
            )}
            <SignedIn>
              <button onClick={() => { setMobileOpen(false); router.push('/home/cart'); }} className="flex items-center gap-2 py-2">
                <User className="w-4 h-4" aria-label="user icon" />
                Account
              </button>
              <button onClick={() => { setMobileOpen(false); router.push('/home/my-orders'); }} className="flex items-center gap-2 py-2">
                <User className="w-4 h-4" aria-label="user icon" />
                My Orders
              </button>
            </SignedIn>
            <SignedOut>
              <Link onClick={() => setMobileOpen(false)} href="/sign-in" className="flex items-center gap-2 py-2">
                <User className="w-4 h-4" aria-label="user icon" />
                Sign in
              </Link>
              <Link onClick={() => setMobileOpen(false)} href="/sign-up" className="flex items-center gap-2 py-2">
                Sign up
              </Link>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;