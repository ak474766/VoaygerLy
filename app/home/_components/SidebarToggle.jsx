"use client"
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  { href: "/home", label: "Home" },
  { href: "/home/all-products", label: "All Products" },
  { href: "/home/register-provider", label: "Become a Provider" },
];

const SidebarToggle = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        aria-label="Toggle sidebar"
        onClick={() => setOpen((v) => !v)}
        className="md:hidden fixed bottom-6 right-6 z-50 px-4 py-3 rounded-full shadow-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 transform hover:scale-105"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="h-16 border-b border-gray-200 flex items-center px-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">V</span>
            </div>
            <span className="font-bold text-gray-900">Navigation</span>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          {routes.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className={`block px-4 py-3 rounded-lg transition-all duration-200 ${pathname === r.href ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`}
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center gap-3">
                {r.href === "/home" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                ) : r.href === "/home/register-provider" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                )}
                {r.label}
              </div>
            </Link>
          ))}
        </nav>
      </aside>
      {open && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={() => setOpen(false)} />}
    </>
  );
};

export default SidebarToggle;
