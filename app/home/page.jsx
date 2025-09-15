"use client"
import React from "react";
import HomeProducts from "@/components/HomeProducts";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import { HeroParallax } from "@/components/ui/hero-parallax";

export default function HomePage() {
  const products = [
    { title: "Skilled Workers", link: "#", thumbnail: "https://i.ibb.co/BH0JRM6Z/Whats-App-Image-2025-09-14-at-23-05-24-6aa52734.jpg" },
    { title: "Local Pros At Work", link: "#", thumbnail: "https://images.unsplash.com/photo-1746095792963-74106bae8658?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlJTIwd29ya2Vyc3xlbnwwfHx8fDE3NTc2MDk2MDV8MA&ixlib=rb-4.1.0&q=85" },
    { title: "Home Services", link: "#", thumbnail: "https://images.unsplash.com/photo-1505798577917-a65157d3320a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxob21lJTIwc2VydmljZXN8ZW58MHx8fHwxNzU3NTQyMzg1fDA&ixlib=rb-4.1.0&q=85" },
    { title: "Electrical Experts", link: "#", thumbnail: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwzfHxlbGVjdHJpY2lhbnxlbnwwfHx8fDE3NTc2MDk2Mjd8MA&ixlib=rb-4.1.0&q=85" },
    { title: "Skilled Workers", link: "#", thumbnail: "https://i.postimg.cc/QxCmCVpS/david-lembas-57ldq9age5-U-unsplash.jpg" },
    { title: "Gardning Expert ", link: "#", thumbnail: "https://i.postimg.cc/Vk6hyms0/sandie-clarke-q13-Zq1-Jufks-unsplash.jpg'" },
    { title: "Certified Electricians", link: "#", thumbnail: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwzfHxlbGVjdHJpY2lhbnxlbnwwfHx8fDE3NTc2MDk2Mjd8MA&ixlib=rb-4.1.0&q=85" },
    { title: "Home Services 2", link: "#", thumbnail: "https://i.postimg.cc/RZ4HqZJq/battlecreek-coffee-roasters-Nf-G4r-Xmce-FM-unsplash.jpg" },
    { title: "Skilled Workers", link: "#", thumbnail: "https://i.ibb.co/BH0JRM6Z/Whats-App-Image-2025-09-14-at-23-05-24-6aa52734.jpg" },
    { title: "Local Pros 2", link: "#", thumbnail: "https://images.unsplash.com/photo-1746095792963-74106bae8658?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlJTIwd29ya2Vyc3xlbnwwfHx8fDE3NTc2MDk2MDV8MA&ixlib=rb-4.1.0&q=85" },
  ];

  return (
    <div >
      <HeroParallax products={products} />
      <div className="px-0 md:px-0 lg:px-0">
        <HomeProducts />
        <FeaturedProduct />
      </div>
      <NewsLetter />
      </div>
  );
}
