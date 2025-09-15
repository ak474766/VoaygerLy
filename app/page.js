'use client'
import React, { useEffect } from "react";
import { useUser, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { HeroParallax } from "@/components/ui/hero-parallax";

const Landing = () => {
  const router = useRouter();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) router.replace('/home');
  }, [isSignedIn, router]);

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
    <SignedOut>
      <HeroParallax products={products} />
      <div className="max-w-4xl mx-auto px-6 py-10 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold">Connect with verified local service experts</h2>
        <p className="mt-3 text-gray-600">Sign in to explore providers, manage bookings, and more.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a href="/sign-in" className="px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white">Sign in</a>
          <a href="/sign-up" className="px-5 py-2.5 rounded-full bg-gray-900 hover:bg-black text-white">Create account</a>
        </div>
      </div>
    </SignedOut>
  );
};

export default Landing;
