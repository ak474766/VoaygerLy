import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import RoleBasedNavigation from "@/components/RoleBasedNavigation";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  title: "Voyagerly - Service Provider Marketplace",
  description: "Connect with trusted local service providers for all your home service needs",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700`} >
          <Toaster />
          <AppContextProvider>
            <RoleBasedNavigation />
            {children}
          </AppContextProvider>
        </body>
      </html>
      </ClerkProvider>
  );
}
