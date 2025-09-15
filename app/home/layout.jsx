import React from "react";
import Header from "./_components/Header";
import SidebarToggle from "./_components/SidebarToggle";

export default function HomeLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <div className="flex">
        <SidebarToggle />
        <main className="flex-1 md:pl-64">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
