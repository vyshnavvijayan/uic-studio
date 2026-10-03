"use client";

import React, { useState } from "react";
import { X, Copy, Check, Send, Sparkles } from "lucide-react";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetEmail: string;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  targetEmail,
}) => {
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [projectType, setProjectType] = useState("Bespoke Portfolio & Titanium NFC Card");
  const [timeline, setTimeline] = useState("4–6 Weeks (Standard)");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const formattedSubject = encodeURIComponent(`Commission Inquiry: ${name || "New Client"} (${projectType})`);
  const formattedBody = encodeURIComponent(
`Dear UIC Studio Principals,

I would like to initiate a commission discussion:

• Client / Representative: ${name || "[Your Name]"}
• Organization / Practice: ${organization || "[Individual / Entity]"}
• Commission Scope: ${projectType}
• Target Timeline: ${timeline}

Project Outline & Objectives:
${notes || "[Provide high-level context regarding your digital presence or physical accessory goals]"}

Thank you,
${name || ""}`
  );

  const mailtoUrl = `mailto:${targetEmail}?subject=${formattedSubject}&body=${formattedBody}`;

  const handleCopy = () => {
    const rawText = 
`Dear UIC Studio Principals,

I would like to initiate a commission discussion:

• Client / Representative: ${name || "[Your Name]"}
• Organization / Practice: ${organization || "[Individual / Entity]"}
• Commission Scope: ${projectType}
• Target Timeline: ${timeline}

Project Outline & Objectives:
${notes || "[Provide high-level context regarding your digital presence or physical accessory goals]"}

Thank you,
${name || ""}`;

    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#0d0d10] border border-zinc-200 dark:border-white/10 p-6 sm:p-8 max-h-[90vh] overflow-y-auto flex flex-col gap-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-[#90909c] hover:text-zinc-950 dark:hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-[#c6f36b]" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-[#c6f36b] font-semibold">
              Commission Blueprint Formatter
            </span>
          </div>
          <h3 className="text-2xl font-medium text-zinc-950 dark:text-white tracking-tight">
            Structure your project brief.
          </h3>
          <p className="mt-1 text-xs text-zinc-600 dark:text-[#90909c]">
            We value direct communication. This tool formats your requirements into a clean email sent directly to studio leadership.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-600 dark:text-[#90909c] block mb-1.5 font-medium">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alexander Vance"
              className="w-full bg-zinc-50 dark:bg-[#161619] border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-white/20 focus:outline-none focus:border-emerald-600 dark:focus:border-[#c6f36b] transition-colors"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-600 dark:text-[#90909c] block mb-1.5 font-medium">
              Organization / Practice
            </label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="e.g. Vance Capital / Private Practice"
              className="w-full bg-zinc-50 dark:bg-[#161619] border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-white/20 focus:outline-none focus:border-emerald-600 dark:focus:border-[#c6f36b] transition-colors"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-600 dark:text-[#90909c] block mb-1.5 font-medium">
              Commission Scope
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-[#161619] border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-[#c6f36b] transition-colors"
            >
              <option value="Bespoke Portfolio & Titanium NFC Card">Bespoke Portfolio & Titanium NFC Card</option>
              <option value="Corporate / Agency Web Flagship">Corporate / Agency Web Flagship</option>
              <option value="Executive NFC Hardware Suite Only">Executive NFC Hardware Suite Only</option>
              <option value="Complete Identity Redesign + Next.js App">Complete Identity Redesign + Next.js App</option>
              <option value="Other Bespoke Commission">Other Bespoke Commission</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-600 dark:text-[#90909c] block mb-1.5 font-medium">
              Target Timeline
            </label>
            <select
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-[#161619] border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-[#c6f36b] transition-colors"
            >
              <option value="4–6 Weeks (Standard)">4–6 Weeks (Standard)</option>
              <option value="2–3 Weeks (Accelerated)">2–3 Weeks (Accelerated)</option>
              <option value="Flexible / Q4 Horizon">Flexible / Q4 Horizon</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-600 dark:text-[#90909c] block mb-1.5 font-medium">
              Brief Description / Objectives
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Outline your target aesthetic, references, or specific requirements..."
              className="w-full bg-zinc-50 dark:bg-[#161619] border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-white/20 focus:outline-none focus:border-emerald-600 dark:focus:border-[#c6f36b] resize-none transition-colors"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-zinc-100 dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={mailtoUrl}
              className="flex-1 sm:flex-none rounded-full bg-[#c6f36b] text-zinc-950 hover:bg-[#b5e656] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Launch Mail Client</span>
            </a>

            <button
              onClick={handleCopy}
              className="rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.1] hover:border-zinc-400 dark:hover:border-white/20 text-zinc-600 dark:text-[#90909c] hover:text-zinc-950 dark:hover:text-white px-5 py-2.5 text-xs font-mono transition-colors flex items-center gap-2"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#c6f36b]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Brief"}</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-zinc-500 dark:text-[#585863]">
            Transmitting to: {targetEmail}
          </span>
        </div>
      </div>
    </div>
  );
};
