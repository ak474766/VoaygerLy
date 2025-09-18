"use client";
import React from "react";
import { useAppContext } from "@/context/AppContext";

export default function FeaturedProviders() {
  const { products } = useAppContext();
  const featured = (products || []).slice(0, 6);

  if (!featured.length) return null;

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Featured Providers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p) => (
            <a key={p._id} href={`/product/${p._id}`} className="block rounded-xl border p-5 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold truncate">{p.businessName}</h3>
                <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded">₹{p?.pricing?.hourlyRate ?? 0}/hr</span>
              </div>
              <p className="text-gray-600 mt-2 line-clamp-2">{p.description}</p>
              <div className="mt-3 text-sm text-gray-500">⭐ {Number(p?.rating?.average || 0).toFixed(1)} ({p?.rating?.count || 0})</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
