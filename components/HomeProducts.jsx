import React from "react";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { Wrench, Zap, Sparkles, Hammer, Palette, Leaf, AirVent, Cog, Home, Bug, Truck, Move } from "lucide-react";

const HomeProducts = () => {
  // Map services to HoverEffect items
  const items = [
    {
      title: "Plumbing",
      description: "Pipe repairs, installations, leak fixes",
      link: "/all-products?category=plumbing",
      icon: <Wrench className="w-8 h-8 text-emerald-600" />,
    },
    {
      title: "Electrical",
      description: "Wiring, installations, repairs",
      link: "/all-products?category=electrical",
      icon: <Zap className="w-8 h-8 text-emerald-600" />,
    },
    {
      title: "Cleaning",
      description: "Home and office cleaning services",
      link: "/all-products?category=cleaning",
      icon: <Sparkles className="w-8 h-8 text-emerald-600" />,
    },
    {
      title: "Carpentry",
      description: "Furniture repair, installations",
      link: "/all-products?category=carpentry",
      icon: <Hammer className="w-8 h-8 text-emerald-600" />,
    },
    {
      title: "Painting",
      description: "Interior and exterior painting",
      link: "/all-products?category=painting",
      icon: <Palette className="w-8 h-8 text-emerald-600" />,
    },
    {
      title: "Gardening",
      description: "Lawn care, plant maintenance",
      link: "/all-products?category=gardening",
      icon: <Leaf className="w-8 h-8 text-emerald-600" />,
    },
    // Additional six services
    {
      title: "AC Services",
      description: "Installations, gas refilling, servicing",
      link: "/all-products?category=ac-services",
      icon: <AirVent className="w-8 h-8 text-emerald-600" />,
    },
    {
      title: "Appliance Repair",
      description: "Fridge, washer, microwave & more",
      link: "/all-products?category=appliance-repair",
      icon: <Cog className="w-8 h-8 text-emerald-600" />,
    }

  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-6 md:mb-12 slide-up">Popular Services</h2>
        <HoverEffect
          items={items}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 md:gap-1 lg:gap-2 !py-0"
        />
      </div>
    </section>
  );
};

export default HomeProducts;
