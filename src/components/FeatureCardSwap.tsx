"use client";
import CardSwap, { Card } from "@/components/CardSwap";
import { ListChecks, Sparkles, BarChart3, ArrowUpRight } from "lucide-react";

const features = [
  {
    icon: ListChecks,
    title: "Applicant Tracking",
    label: "Roles tracked",
    stat: "Unlimited",
    description: "Every role, note, and contact in one organized dashboard. No more spreadsheets.",
  },
  {
    icon: Sparkles,
    title: "Smart Templates",
    label: "Outreach style",
    stat: "AI-tailored",
    description: "Templates that adapt to each role, tested and refined to get more replies.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    label: "Response lift",
    stat: "+38%",
    description: "Track response rates and see exactly which approach is actually working.",
  },
];

export default function FeatureCardSwap() {
  return (
    <div className="w-full py-20 flex flex-col md:flex-row items-center justify-between gap-16">
      <div className="max-w-sm shrink-0">
        <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary leading-tight">
          Your job hunt has never looked so organized
        </h2>
        <p className="text-text-primary/60 mt-3">Just watch it work.</p>
      </div>

      <div className="relative w-full max-w-[480px] h-[340px] shrink-0">
        <CardSwap width={440} height={280} cardDistance={50} verticalDistance={55} delay={4000}>
          {features.map(({ icon: Icon, title, label, stat, description }) => (
            <Card
              key={title}
              customClass="rounded-2xl border border-white/10 bg-surface/95 backdrop-blur-xl shadow-2xl overflow-hidden text-text-primary flex flex-col"
            >
              {/* Header bar */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.03] shrink-0">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">{title}</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-text-primary/30" />
              </div>

              {/* Body */}
              <div className="relative flex-1 bg-gradient-to-br from-accent/15 via-surface to-surface p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-text-primary/40 font-medium">
                    {label}
                  </span>
                  <div className="text-3xl font-extrabold text-text-primary mt-1">
                    {stat}
                  </div>
                </div>

                <p className="text-sm text-text-primary/60 leading-relaxed">
                  {description}
                </p>
              </div>
            </Card>
          ))}
        </CardSwap>
      </div>
    </div>
  );
}