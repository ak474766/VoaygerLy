"use client";
import React from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Search } from "lucide-react";
import ColourfulText from "@/components/ui/colourful-text";
import { SignedOut } from "@clerk/nextjs";



export const HeroParallax = ({
  products
}) => {
  // Build exactly two rows, 4 items each (if available)
  const rowOne = products.slice(0, 4);
  const rowTwo = products.slice(5, 9);
  const rows = [rowOne, rowTwo].filter((r) => r.length > 0);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  // Keep subtle header motion on scroll, but rows will auto-animate
  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 200]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -200]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [10, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-180, 120]), springConfig);
  return (
    <div
      ref={ref}
      className="relative overflow-hidden antialiased bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-700 min-h-[60vh] md:min-h-[72vh] py-12 md:py-16"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%)]" />
      <div className="max-w-6xl mx-auto px-4 md:px-6 [perspective:1000px] [transform-style:preserve-3d]">
        <Header />
        <motion.div
          style={{ rotateX, rotateZ, translateY, opacity }}
          className="relative z-0"
        >
          {rows.map((row, idx) => (
            <motion.div
              key={`row-${idx}`}
              className={`flex ${idx % 2 === 0 ? 'flex-row-reverse space-x-reverse' : 'flex-row'} gap-6 md:gap-8 ${idx === rows.length - 1 ? 'pb-8 md:pb-12' : 'mb-8 md:mb-12'}`}
              animate={{ x: idx % 2 === 0 ? [0, -120, 0] : [0, 120, 0] }}
              transition={{ duration: 12, ease: 'linear', repeat: Infinity }}
            >
              {row.map((product) => (
                <ProductCard
                  product={product}
                  translate={0}
                  key={product.title}
                />
              ))}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export const Header = () => {
  const suggestions = React.useMemo(
    () => [
      "Plumber near me",
      "Electrician",
      "AC repair",
      "House cleaning",
      "Painter",
    ],
    []
  );
  const [hintIndex, setHintIndex] = React.useState(0);
  const [typed, setTyped] = React.useState("");
  const [direction, setDirection] = React.useState("type"); // "type" | "delete"
  const [userInput, setUserInput] = React.useState("");

  React.useEffect(() => {
    const current = suggestions[hintIndex] || "";
    const delay = direction === "type" ? 70 : 40;
    const timeout = setTimeout(() => {
      if (direction === "type") {
        if (typed.length < current.length) {
          setTyped(current.slice(0, typed.length + 1));
        } else {
          setDirection("delete");
        }
      } else {
        if (typed.length > 0) {
          setTyped(current.slice(0, typed.length - 1));
        } else {
          setDirection("type");
          setHintIndex((i) => (i + 1) % suggestions.length);
        }
      }
    }, typed.length === current.length && direction === "type" ? 1200 : delay);
    return () => clearTimeout(timeout);
  }, [typed, direction, hintIndex, suggestions]);

  return (
    <div className="max-w-3xl relative z-10 mx-auto py-10 md:py-16 px-6 text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
      Connect 
        <ColourfulText text={" with Local"} />
      <br/>
      Service Experts
      </h1>
      <p className="max-w-2xl mx-auto text-base md:text-xl mt-4 md:mt-6 text-emerald-50/90">
        Find trusted professionals for all your home service needs. From plumbing to electrical work, we've got you covered.
      </p>

      <div className="mt-6 md:mt-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="mx-auto flex items-center w-full max-w-xl rounded-full bg-white shadow-lg overflow-hidden ring-1 ring-black/5"
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={typed.length ? typed : "What service do you need?"}
            className="flex-1 px-5 py-3 md:py-4 outline-none text-gray-700 placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="group flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 md:px-6 py-3 md:py-4 font-medium"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>
        </form>
        <SignedOut>
          <div className="mt-4 flex items-center justify-center gap-3">
            <a href="/sign-in" className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 transition">
              Sign in
            </a>
            <a href="/sign-up" className="px-4 py-2 rounded-full bg-emerald-900 hover:bg-emerald-800 text-white transition">
              Create account
            </a>
          </div>
        </SignedOut>
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-64 md:h-80 w-[18rem] md:w-[24rem] relative shrink-0 rounded-2xl overflow-hidden">
      <a href={product.link} className="block group-hover/product:shadow-2xl ">
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-center absolute h-full w-full inset-0"
          alt={product.title} />
      </a>
      <div
        className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2
        className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};
