"use client";
import React from "react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { MapPin, Star } from "lucide-react";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

const professionals = [
  {
    id: 1,
    name: "Test Plumbing Services",
    city: "Test City",
    description: "Professional plumbing services with 10+ years experience",
    rating: 5.0,
    reviews: 1,
    price: 75,
    unit: "/hour",
    tags: ["pipe repair", "leak detection", "installation"],
    image:
      "https://images.unsplash.com/photo-1746095792963-74106bae8658?crop=entropy&cs=srgb&fm=jpg&q=85",
  },
  {
    id: 2,
    name: "Home Services Co.",
    city: "Your City",
    description: "Trusted home maintenance and handyman services.",
    rating: 4.9,
    reviews: 38,
    price: 60,
    unit: "/hour",
    tags: ["handyman work", "Pro fixtures", "repairs"],
    image:
      "https://images.unsplash.com/photo-1505798577917-a65157d3320a?crop=entropy&cs=srgb&fm=jpg&q=85",
  },
  {
    id: 3,
    name: "Electrical Experts",
    city: "Metro Area",
    description: "Certified electricians for safe and reliable work.",
    rating: 5.0,
    reviews: 22,
    price: 85,
    unit: "/hour",
    tags: ["connect wiring", "fix appliances", "lighting"],
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?crop=entropy&cs=srgb&fm=jpg&q=85",
  },
];

const FeaturedProduct = () => {
  return (
    <section className="mt-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold">Top Rated Professionals</h2>
        <p className="text-gray-600 mt-2">Discover trusted experts near you</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-6">
        {professionals.map((pro) => (
          <CardContainer key={pro.id} containerClassName="py-0" className="w-full">
            <CardBody className="w-full h-auto">
              <CardItem translateZ={60} className="w-full">
                <BackgroundGradient containerClassName="rounded-3xl" className="rounded-3xl">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-emerald-100">
                    <div className="h-44 md:h-52 w-full overflow-hidden">
                      <img
                        src={pro.image}
                        alt={pro.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5 md:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold">{pro.name}</h3>
                          <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{pro.city}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span>{pro.rating.toFixed(1)}</span>
                          </div>
                          <div className="text-xs text-gray-500">({pro.reviews} reviews)</div>
                        </div>
                      </div>

                      <p className="text-gray-600 mt-3">{pro.description}</p>

                      <div className="flex items-center justify-between mt-4">
                        <div className="text-emerald-700 font-bold text-xl">
                          ₹{pro.price}
                          <span className="text-sm font-medium text-gray-500">{pro.unit}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {pro.tags.map((t, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button className="mt-5 w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl font-medium">
                        View Profile
                      </button>
                    </div>
                  </div>
                </BackgroundGradient>
              </CardItem>
            </CardBody>
          </CardContainer>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProduct;
