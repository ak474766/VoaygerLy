import React from "react";
import Header from "./_components/Header";
import SidebarToggle from "./_components/SidebarToggle";

export default function HomeLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <div className="flex">
        <SidebarToggle />
        <main className="flex-1 md:ml-64 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
