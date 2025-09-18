"use client";
import React from "react";
import { useAppContext } from "@/context/AppContext";

export default function TopRatedProviders() {
  const { products } = useAppContext();
  const top = (products || [])
    .slice()
    .sort((a, b) => (b?.rating?.average || 0) - (a?.rating?.average || 0))
    .slice(0, 6);

  if (!top.length) return null;

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Top Rated Providers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {top.map((p) => (
            <a key={p._id} href={`/product/${p._id}`} className="block rounded-xl border p-5 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold truncate">{p.businessName}</h3>
                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded">⭐ {Number(p?.rating?.average || 0).toFixed(1)}</span>
              </div>
              <p className="text-gray-600 mt-2 line-clamp-2">{p.description}</p>
              <div className="mt-3 text-sm text-gray-500">₹{p?.pricing?.hourlyRate ?? 0}/hr</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
