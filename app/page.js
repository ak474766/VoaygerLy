'use client'
import React, { useEffect } from "react";
import { useUser, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { HeroParallax } from "@/components/ui/hero-parallax";
import NewsLetter from "@/components/NewsLetter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import FeaturedProviders from "@/components/FeaturedProviders";
import TopRatedProviders from "@/components/TopRatedProviders";

const Landing = () => {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { products } = useAppContext();

  useEffect(() => {
    if (isSignedIn) router.replace('/home');
  }, [isSignedIn, router]);

  const heroItems = (products || []).slice(0, 12).map((p) => ({
    title: p.businessName || 'Service Provider',
    link: `/product/${p._id}`,
    thumbnail: (Array.isArray(p.photos) && p.photos[0]) ||
      'https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=1200&auto=format',
  }));

  return (
    <div >
      <Navbar/>
      <HeroParallax products={heroItems} />
      <FeaturedProviders />
      <TopRatedProviders />
      <NewsLetter />
      <Footer/>
      </div>
  );
}


export default Landing;
