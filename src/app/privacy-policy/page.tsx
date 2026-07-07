"use client";

import Silk from "@/components/Silk";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 -z-10">
        <Silk speed={5} scale={1} color="#3F3F46" noiseIntensity={1.2} rotation={0} />
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
        <h1 className="text-4xl font-bold text-text-primary mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-text-secondary">
          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">1. Information We Collect</h2>
            <p className="text-lg leading-relaxed">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg mt-4">
              <li>Account information (name, email address)</li>
              <li>Resume data and job application information</li>
              <li>Payment information (processed securely through Razorpay)</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">2. How We Use Your Information</h2>
            <p className="text-lg leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg mt-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns to improve user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">3. Data Security</h2>
            <p className="text-lg leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. 
              However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">4. Data Sharing</h2>
            <p className="text-lg leading-relaxed">
              We do not sell or rent your personal information to third parties. We may share 
              your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg mt-4">
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With service providers who assist in our operations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">5. Data Retention</h2>
            <p className="text-lg leading-relaxed">
              We retain your personal information for as long as your account is active or as 
              needed to provide you services. You may request deletion of your data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">6. Your Rights</h2>
            <p className="text-lg leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg mt-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">7. Cookies</h2>
            <p className="text-lg leading-relaxed">
              We use cookies and similar technologies to maintain your session and remember your 
              preferences. You can instruct your browser to refuse all cookies, though this may 
              affect your ability to use some features of our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">8. Changes to This Policy</h2>
            <p className="text-lg leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any 
              changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">9. Contact Us</h2>
            <p className="text-lg leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@jobhunter.com" className="text-[#6366F1] hover:underline">
                privacy@jobhunter.com
              </a>
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
