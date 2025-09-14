"use client";
import React from "react";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Button as StatefulButton } from "@/components/ui/stateful-button";

const NewsLetter = () => {
  return (
    <section className="relative mt-5 ">
      <WavyBackground
        containerClassName=""
        className=""
        colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]}
        waveWidth={50}
        backgroundFill="#E6E4E0"
        blur={10}
        speed="fast"
        waveOpacity={0.5}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 drop-shadow-sm">
            Subscribe now & get 20% off
          </h2>
          <p className="mt-3 text-emerald-900/80 text-base md:text-lg">
            Join our newsletter for exclusive offers and updates from top-rated professionals.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-8 mx-auto max-w-xl flex items-stretch bg-white/90 backdrop-blur rounded-2xl shadow-lg ring-1 ring-emerald-900/10 overflow-hidden"
          >
            <EmailInputAndButton />
          </form>
        </div>
      </WavyBackground>
    </section>
  );
};

export default NewsLetter;

// Sub-component: controlled input + stateful subscribe button
const EmailInputAndButton = () => {
  const [email, setEmail] = React.useState("");
  const handleSubscribe = async () => {
    // simulate API call latency
    await new Promise((r) => setTimeout(r, 800));
    // TODO: hook up to your backend/newsletter service
  };
  return (
    <>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        className="flex-1 px-4 md:px-5 py-3 md:py-4 text-gray-700 placeholder:text-gray-400 outline-none bg-transparent"
      />
      <StatefulButton
        type="submit"
        onClick={handleSubscribe}
        className="px-5 md:px-6 py-3 md:py-4 bg-emerald-700 hover:bg-emerald-800 rounded-none md:rounded-none"
      >
        Subscribe
      </StatefulButton>
    </>
  );
};
