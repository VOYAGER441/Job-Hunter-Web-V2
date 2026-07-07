"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  CreditCard, FileText, Bot, User, Mail,
  ShieldCheck, Calendar, Plus, Briefcase, TrendingUp,
} from "lucide-react";
import { Chart, registerables } from "chart.js";
import { IUserResponse } from "@/interface/response/user.response";

Chart.register(...registerables);

function useCountUp(target: number, duration = 900) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current || target === 0) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      if (ref.current) ref.current.textContent = String(Math.round(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return ref;
}

interface StatCardProps {
  label: string;
  value: number;
  max?: number;
  icon: React.ReactNode;
  barColor: string;
  delta?: string;
  badge?: string;
}

function StatCard({ label, value, max, icon, barColor, delta, badge }: StatCardProps) {
  const valRef = useCountUp(value);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current || max === undefined) return;
    const pct = Math.min(Math.round((value / max) * 100), 100);
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1000, 1);
      if (barRef.current) barRef.current.style.width = `${Math.round(p * pct)}%`;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, max]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#141416] border border-neutral-800 rounded-2xl p-5 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-xl bg-neutral-800/60">{icon}</div>
        {badge && (
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs text-neutral-500 mb-1">{label}</p>
        <span ref={valRef} className="text-3xl font-semibold text-white">0</span>
        {max !== undefined && <span className="text-sm text-neutral-500 ml-1">/ {max}</span>}
      </div>
      {max !== undefined && (
        <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
          <div
            ref={barRef}
            style={{ width: "0%", background: barColor, transition: "none" }}
            className="h-full rounded-full"
          />
        </div>
      )}
      {delta && (
        <p className="text-xs text-emerald-400 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {delta}
        </p>
      )}
    </motion.div>
  );
}

function ActivityChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Resumes",
            data: [2, 3, 1, 4, 3, 2, 3],
            backgroundColor: "#10b981",
            borderRadius: 4,
            borderSkipped: false,
          },
          {
            label: "Applies",
            data: [5, 8, 4, 10, 7, 3, 10],
            backgroundColor: "#818cf8",
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: "index" },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#737373", font: { size: 11 } },
          },
          y: {
            grid: { color: "rgba(255,255,255,0.05)" },
            ticks: { color: "#737373", font: { size: 11 }, stepSize: 4 },
            beginAtZero: true,
          },
        },
      },
    });
    return () => { chartRef.current?.destroy(); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="bg-[#141416] border border-neutral-800 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Weekly activity</p>
        <div className="flex gap-3 text-[11px] text-neutral-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" />Resumes
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-indigo-400 inline-block" />Applies
          </span>
        </div>
      </div>
      <div style={{ height: 140, position: "relative" }}>
        <canvas ref={canvasRef} />
      </div>
    </motion.div>
  );
}

function CreditDonut({ credits, creditsUsed }: { credits: number; creditsUsed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const remaining = credits - creditsUsed;

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: ["Used", "Remaining"],
        datasets: [{
          data: [creditsUsed, remaining],
          backgroundColor: ["#818cf8", "#262626"],
          borderWidth: 0,
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: { legend: { display: false } },
      },
    });
    return () => { chartRef.current?.destroy(); };
  }, [credits, creditsUsed]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="bg-[#141416] border border-neutral-800 rounded-2xl p-5"
    >
      <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">Credit breakdown</p>
      <div className="flex items-center gap-6">
        <div style={{ height: 110, width: 110, position: "relative", flexShrink: 0 }}>
          <canvas ref={canvasRef} />
        </div>
        <div className="flex flex-col gap-2 text-[12px]">
          <span className="flex items-center gap-2 text-neutral-400">
            <span className="w-2 h-2 rounded-sm bg-indigo-400 inline-block" />
            Used <span className="text-white font-medium ml-auto">{creditsUsed}</span>
          </span>
          <span className="flex items-center gap-2 text-neutral-400">
            <span className="w-2 h-2 rounded-sm bg-neutral-700 inline-block" />
            Remaining <span className="text-white font-medium ml-auto">{remaining}</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function AccountCard({ user }: { user: IUserResponse }) {
  const rows = [
    { icon: <User className="w-3.5 h-3.5" />, label: "Username", value: user.userName },
    { icon: <Mail className="w-3.5 h-3.5" />, label: "Email", value: user.email },
    { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: "Role", value: user.role },
    {
      icon: <Calendar className="w-3.5 h-3.5" />,
      label: "Joined",
      value: new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.4 }}
      className="bg-[#141416] border border-neutral-800 rounded-2xl p-5"
    >
      <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">Account</p>
      <div className="flex flex-col divide-y divide-neutral-800">
        {rows.map(({ icon, label, value }) => (
          <div key={label} className="flex items-center justify-between py-2.5">
            <span className="flex items-center gap-2 text-xs text-neutral-500">
              {icon}{label}
            </span>
            <span className="text-xs font-medium text-neutral-200">{value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function QuickActions({ user }: { user: IUserResponse }) {
  const recentJobs = (user.appliedJobs ?? []).slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="bg-[#141416] border border-neutral-800 rounded-2xl p-5"
    >
      <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">Recently Applied Jobs</p>
      {recentJobs.length === 0 ? (
        <p className="text-xs text-neutral-500">No applications yet</p>
      ) : (
        <div className="flex flex-col divide-y divide-neutral-800">
          {recentJobs.map((job, i) => (
            <a
              key={i}
              href={job.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-2.5 hover:bg-neutral-800/40 rounded-lg px-2 -mx-2 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-xs text-neutral-300 truncate max-w-[140px]">{job.jobTitle}</span>
              </div>
              <span className="text-[10px] text-neutral-500">
                {new Date(job.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function SkeletonCard() {
  return <div className="aspect-video rounded-2xl bg-neutral-800/40 animate-pulse" />;
}

export default function DashboardMetrics({ user }: { user: IUserResponse | null }) {
  if (!user) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Total credits"
          value={user.totalCredits}
          icon={<CreditCard className="w-5 h-5 text-sky-400" />}
          barColor="#38bdf8"
          badge={(user.plan).toUpperCase()}
        />
        <StatCard
          label="Remaining credits"
          value={(user.totalCredits || 0) - (user.creditsUsed || 0)}
          icon={<CreditCard className="w-5 h-5 text-emerald-400" />}
          barColor="#10b981"
        />
        <StatCard
          label="Resumes generated"
          value={user.resumeCount}
          icon={<FileText className="w-5 h-5 text-violet-400" />}
          barColor="#8b5cf6"
        />
        <StatCard
          label="Auto-applies"
          value={user.autoApplyCount}
          icon={<Bot className="w-5 h-5 text-indigo-400" />}
          barColor="#818cf8"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ActivityChart />
        <CreditDonut credits={user.totalCredits} creditsUsed={user.creditsUsed} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AccountCard user={user} />
        <QuickActions user={user} />
      </div>
    </div>
  );
}