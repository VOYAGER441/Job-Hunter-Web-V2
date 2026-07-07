"use client";

import Silk from "@/components/Silk";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 -z-10">
        <Silk speed={5} scale={1} color="#3F3F46" noiseIntensity={1.2} rotation={0} />
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
        <h1 className="text-4xl font-bold text-text-primary mb-8">About Us</h1>
        
        <div className="space-y-8 text-text-secondary">
          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">Our Mission</h2>
            <p className="text-lg leading-relaxed">
              Job Hunter V2 is an AI-powered SaaS platform designed to streamline your job search process. 
              We help job seekers organize their applications, generate professional resumes, and optimize 
              their outreach with data-driven templates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">What We Offer</h2>
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>AI-assisted resume building and optimization</li>
              <li>Smart job tracking and application management</li>
              <li>Automated job application features</li>
              <li>Professional resume templates</li>
              <li>Data-driven insights for better job search results</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">Our Team</h2>
            <p className="text-lg leading-relaxed">
              We are a passionate team of developers and designers dedicated to making job searching 
              easier and more efficient. Our goal is to leverage AI technology to give job seekers 
              a competitive edge in today&apos;s market.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">Contact</h2>
            <p className="text-lg leading-relaxed">
              Have questions or suggestions? We&apos;d love to hear from you. 
              Reach out to us at <a href="mailto:support@jobhunter.com" className="text-[#6366F1] hover:underline">support@jobhunter.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
