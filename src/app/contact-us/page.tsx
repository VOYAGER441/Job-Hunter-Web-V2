"use client";

import Silk from "@/components/Silk";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 -z-10">
        <Silk speed={5} scale={1} color="#3F3F46" noiseIntensity={1.2} rotation={0} />
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
        <h1 className="text-4xl font-bold text-text-primary mb-8">Contact Us</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">Get in Touch</h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Have a question, suggestion, or need support? We&apos;re here to help. 
              Reach out to us using the information below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <h3 className="font-semibold text-text-primary">Email</h3>
                </div>
                <a href="mailto:support@jobhunter.com" className="block text-[#6366F1] hover:underline text-lg">
                  support@jobhunter.com
                </a>
              </div>

              <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💼</span>
                  <h3 className="font-semibold text-text-primary">Support Team</h3>
                </div>
                <p className="text-text-secondary text-lg">Job Hunter Support Team</p>
              </div>

              <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⏰</span>
                  <h3 className="font-semibold text-text-primary">Response Time</h3>
                </div>
                <p className="text-text-secondary text-lg">24-48 hours</p>
              </div>

              <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <h3 className="font-semibold text-text-primary">FAQ</h3>
                </div>
                <a href="/faq" className="block text-[#6366F1] hover:underline text-lg">
                  Check our FAQ
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
