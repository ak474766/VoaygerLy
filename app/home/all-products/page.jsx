"use client"
import React from "react";
import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";

export default function AllProductsAuth() {
  const { products } = useAppContext();
  return (
    <div className="flex flex-col items-start">
      <div className="flex flex-col items-end pt-2">
        <p className="text-2xl font-medium">Available Service Providers</p>
        <div className="w-16 h-0.5 bg-orange-600 rounded-full" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8 pb-14 w-full">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
}
