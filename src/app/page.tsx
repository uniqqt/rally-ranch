import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PricingSection from "@/components/PricingSection";
import BookingSection from "@/components/BookingSection";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#f1f5f9",
            border: "1px solid #334155",
            borderRadius: "12px",
          },
          success: {
            iconTheme: { primary: "#22c55e", secondary: "#1e293b" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#1e293b" },
          },
        }}
      />
      <Header />
      <main>
        <HeroSection />
        <PricingSection />
        <BookingSection />
        <LocationSection />
      </main>
      <Footer />
    </>
  );
}
