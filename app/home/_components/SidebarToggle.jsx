"use client"
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  { href: "/home", label: "Home" },
  { href: "/home/all-products", label: "All Products" },
];

const SidebarToggle = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        aria-label="Toggle sidebar"
        onClick={() => setOpen((v) => !v)}
        className="md:hidden fixed bottom-6 right-6 z-50 px-4 py-2 rounded-full shadow bg-emerald-700 text-white"
      >
        Menu
      </button>
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r transform transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="h-14 border-b flex items-center px-4 font-semibold">Navigation</div>
        <nav className="p-3 space-y-1">
          {routes.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className={`block px-3 py-2 rounded hover:bg-gray-100 ${pathname === r.href ? "bg-gray-100 font-medium" : "text-gray-700"}`}
              onClick={() => setOpen(false)}
            >
              {r.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="md:pl-64" />
    </>
  );
};

export default SidebarToggle;
