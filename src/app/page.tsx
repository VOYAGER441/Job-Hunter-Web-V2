"use client";
import { useState, useEffect } from "react";
import Silk from "@/components/Silk";
import { useRouter } from "next/navigation";
import CardNav, { CardNavItem } from "@/components/CardNav";
import ScrambledText from "@/components/ScrambledText";
import RotatingText from "@/components/RotatingText";
import ClickSpark from "@/components/ClickSpark";
import PricingCard from "@/components/PricingCard";
import FeatureCardSwap from "@/components/FeatureCardSwap";
import userService from "@/service/user.service";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await userService.currentUser();
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const handleBuy = (sku: string) => {
    if (isLoggedIn) {
      router.push("/plan-billing");
    } else {
      router.push("/login");
    }
  };

  const navItems: CardNavItem[] = [
    {
      label: 'Products',
      bgColor: '#1C1C1F',
      textColor: '#FAFAFA',
      links: [
        { label: 'Overview', href: '#overview', ariaLabel: 'Overview' },
        { label: 'Pricing', href: '#pricing', ariaLabel: 'Pricing' }
      ]
    },
    {
      label: 'Integrations',
      bgColor: '#1C1C1F',
      textColor: '#FAFAFA',
      links: [
        { label: 'API', href: '#api', ariaLabel: 'API' },
        { label: 'Partners', href: '#partners', ariaLabel: 'Partners' }
      ]
    },
    {
      label: 'Company',
      bgColor: '#1C1C1F',
      textColor: '#FAFAFA',
      links: [
        { label: 'About', href: '#about', ariaLabel: 'About' },
        { label: 'Careers', href: '#careers', ariaLabel: 'Careers' }
      ]
    }
  ];

  return (
    <ClickSpark sparkColor="#FAFAFA" sparkCount={12} duration={500}>
      <div className="relative w-screen min-h-screen overflow-hidden text-text-primary">
        <div className="absolute inset-0 -z-10">
          <Silk speed={5} scale={1} color="#3F3F46" noiseIntensity={1.2} rotation={0} />
        </div>

        {/* Nav */}
        <CardNav logo="/only_logo.png" items={navItems} baseColor="rgba(255, 255, 255, 0.1)" menuColor="#FAFAFA" buttonBgColor="#FAFAFA" buttonTextColor="#0A0A0B" />

        {/* Hero */}
        <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-28 px-6 text-center top-5">

          <div className="relative top-10  w-full h-40 rounded-full " >

            <h1 className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-text-primary  text-center">
              <span>Build your future,</span>
              <RotatingText
                texts={["faster.", "smarter.", "today."]}
                mainClassName="px-3 md:px-4 bg-white text-black overflow-hidden py-1 md:py-2 rounded-lg"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
                splitBy="characters"
                auto
                loop
              />
            </h1>
          </div>

          <ScrambledText className="max-w-2xl mx-auto text-lg md:text-xl text-text-primary/80">
            Introducing Job Hunter V2 — an AI-assisted SaaS to streamline job searches, organize applications, and optimize outreach with data-driven templates.
          </ScrambledText>

          <div className="mt-8 flex justify-center w-full">
            <button
              type="button"
              className="relative z-10 rounded-full px-8 py-3 bg-card text-text-disabled font-semibold shadow-lg hover:bg-gray-200 transition focus:outline-none focus:ring-4 focus:ring-white/30 text-black"
              onClick={() => router.push('/dashboard')}
            >
              Get Started — It&apos;s Free
            </button>
          </div>

          <div className="mt-14 w-full">
            <div className="text-center mb-16 z-20">
              <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">Features</h2>
              <p className="text-text-primary/70 max-w-lg mx-auto">Discover the powerful features that make Job Hunter V2 the ultimate job search companion.</p>
            </div>
            <FeatureCardSwap />
          </div>

          {/* Pricing Section */}
          <div className="mt-32 w-full flex flex-col items-center justify-center relative min-h-[600px] mb-20" id="pricing">
            <div className="text-center mb-16 z-20">
              <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">Pricing Plans</h2>
              <p className="text-text-primary/70 max-w-lg mx-auto">Choose the perfect plan to accelerate your job hunt.</p>
            </div>

            <PricingCard onBuy={handleBuy} />
          </div>
        </main>
      </div>
    </ClickSpark>
  );
}
