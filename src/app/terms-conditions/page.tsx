"use client";

import Silk from "@/components/Silk";

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 -z-10">
        <Silk speed={5} scale={1} color="#3F3F46" noiseIntensity={1.2} rotation={0} />
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
        <h1 className="text-4xl font-bold text-text-primary mb-8">Terms & Conditions</h1>
        
        <div className="space-y-8 text-text-secondary">
          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">1. Acceptance of Terms</h2>
            <p className="text-lg leading-relaxed">
              By accessing and using Job Hunter V2, you agree to be bound by these Terms and Conditions. 
              If you do not agree with any part of these terms, you may not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">2. Description of Service</h2>
            <p className="text-lg leading-relaxed">
              Job Hunter V2 is an AI-powered job search platform that provides resume building, 
              job tracking, and automated application features. We reserve the right to modify 
              or discontinue the service at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">3. User Accounts</h2>
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
              <li>One person or entity may not maintain more than one account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">4. Credits and Payments</h2>
            <p className="text-lg leading-relaxed">
              Credits are purchased through our secure payment partner Razorpay. All sales are final. 
              Credits do not expire and are non-refundable. We reserve the right to change pricing 
              at any time with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">5. Intellectual Property</h2>
            <p className="text-lg leading-relaxed">
              All content, features, and functionality of Job Hunter V2 are owned by us and are 
              protected by copyright, trademark, and other intellectual property laws. You may not 
              reproduce, distribute, or create derivative works without our express permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">6. Limitation of Liability</h2>
            <p className="text-lg leading-relaxed">
              Job Hunter V2 shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages resulting from your use of or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">7. Changes to Terms</h2>
            <p className="text-lg leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective 
              immediately upon posting. Your continued use of the service constitutes acceptance 
              of the modified terms.
            </p>
          </section>

          <section>
            <p className="text-sm text-text-secondary mt-8">
              Last updated: July 7, 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
