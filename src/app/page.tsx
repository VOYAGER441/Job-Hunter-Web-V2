"use client";
import Silk from "@/components/Silk";
import CardNav, { CardNavItem } from "@/components/CardNav";
import ScrambledText from "@/components/ScrambledText";
import RotatingText from "@/components/RotatingText";
import ClickSpark from "@/components/ClickSpark";

export default function Home() {
  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
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

          <ScrambledText className="max-w-2xl mx-auto text-lg md:text-xl text-text-primary/80">
            Introducing Job Hunter V2 — an AI-assisted SaaS to streamline job searches, organize applications, and optimize outreach with data-driven templates.
          </ScrambledText>

          <div className="mt-8 flex justify-center w-full">
            <button
              type="button"
              className="relative z-10 rounded-full px-8 py-3 bg-card text-text-disabled font-semibold shadow-lg hover:bg-gray-200 transition focus:outline-none focus:ring-4 focus:ring-white/30 text-black"
              onClick={() => console.log('CTA clicked')}
            >
              Get Started — It's Free
            </button>
          </div>

          <div className="mt-14 w-full">
            {/* Three feature cards as simple placeholders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-text-primary shadow-xl">
                <h3 className="font-semibold mb-2">Applicant Tracking</h3>
                <p className="text-sm text-text-primary/70">Keep all roles, notes, and contacts in one place.</p>
              </div>
              <div className="p-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-text-primary shadow-xl">
                <h3 className="font-semibold mb-2">Smart Templates</h3>
                <p className="text-sm text-text-primary/70">AI-tailored outreach templates with A/B testing.</p>
              </div>
              <div className="p-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-text-primary shadow-xl">
                <h3 className="font-semibold mb-2">Analytics</h3>
                <p className="text-sm text-text-primary/70">Measure response rates and optimize workflows.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ClickSpark>
  );
}
