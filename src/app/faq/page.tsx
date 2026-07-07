"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Silk from "@/components/Silk";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is Job Hunter V2?",
    answer: "Job Hunter V2 is an AI-powered SaaS platform designed to streamline your job search process. It helps you build professional resumes, track job applications, and automate your outreach with data-driven templates."
  },
  {
    question: "How does the credit system work?",
    answer: "Credits are used to access premium features like resume generation and AI-powered tools. Different features consume different amounts of credits. You can purchase credit packs from our pricing page."
  },
  {
    question: "How do I build a resume?",
    answer: "Navigate to the Resume Builder section from the sidebar. You can input your details, choose from our professional templates, and generate a polished resume ready for download."
  },
  {
    question: "Can I track my job applications?",
    answer: "Yes! The All Jobs section allows you to add job listings, track their status, and manage your applications all in one place."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, UPI, and other payment methods through our secure payment partner Razorpay."
  },
  {
    question: "Are my credits refundable?",
    answer: "All credit sales are final. Credits do not expire and can be used at any time. If you encounter any issues with your purchase, please contact our support team."
  },
  {
    question: "How do I contact support?",
    answer: "You can reach us through our Contact Us page or email us directly at support@jobhunter.com. We typically respond within 24-48 hours."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data security seriously. All data is encrypted in transit and at rest. We use industry-standard security practices to protect your information."
  },
  {
    question: "Can I delete my account?",
    answer: "Yes, you can request account deletion by contacting our support team. We will process your request and delete all your data in accordance with our privacy policy."
  },
  {
    question: "What is the Auto Apply feature?",
    answer: "The Auto Apply feature is currently under development. It will allow you to automatically apply to jobs using AI, saving you time and effort in your job search."
  }
];

function FAQAccordion({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left bg-surface hover:bg-surface/80 transition-colors"
      >
        <span className="font-semibold text-text-primary pr-4">{item.question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-text-secondary shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-text-secondary shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-background">
          <p className="text-text-secondary leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 -z-10">
        <Silk speed={5} scale={1} color="#3F3F46" noiseIntensity={1.2} rotation={0} />
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-text-secondary">
            Find answers to common questions about Job Hunter V2
          </p>
        </div>
        
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <FAQAccordion key={index} item={item} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-text-secondary mb-4">
            Still have questions?
          </p>
          <a
            href="/contact-us"
            className="inline-block px-6 py-3 bg-[#6366F1] text-white font-semibold rounded-lg hover:bg-[#818CF8] transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
