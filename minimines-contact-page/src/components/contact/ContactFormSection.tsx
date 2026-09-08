"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reasonOptions = ["Partnership", "Business", "Media", "Careers", "Other"] as const;
type Reason = (typeof reasonOptions)[number];
type Role = "seller" | "purchaser";

const inputClass =
  "w-full rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.12)] px-4 py-3 text-sm text-white placeholder:text-[#64748B] outline-none transition-colors duration-200 focus:border-[#E8571A] focus:bg-[rgba(255,255,255,0.06)]";

export function ContactFormSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reason, setReason] = useState<Reason | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  // Splits text into one span per character, indexed into a single flat,
  // stable array (index-assigned, not pushed — this component re-renders on
  // form state changes, and a push-based ref list would duplicate on every
  // one of those). Each char remembers its own line's resting color via a
  // data attribute, so the scrub tween below can animate every character
  // from an alternating teal/orange toward its correct final color.
  let charIndex = 0;
  const renderChars = (text: string, finalColor: string) =>
    [...text].map((ch) => {
      const idx = charIndex++;
      return (
        <span
          key={idx}
          ref={(el) => { charRefs.current[idx] = el; }}
          data-final-color={finalColor}
          className="inline-block"
        >
          {ch === " " ? " " : ch}
        </span>
      );
    });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-reveal]",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      // Letter-by-letter focus pull, scrubbed directly to scroll position —
      // it only advances while you're actively scrolling, and freezes in
      // place the instant you stop (scrub, not a play-once timed tween).
      const chars = charRefs.current.filter(Boolean);
      gsap.fromTo(
        chars,
        {
          opacity: 0,
          filter: "blur(12px)",
          color: (i: number) => (i % 2 === 0 ? "#2D96B2" : "#E8571A"),
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          color: (_i: number, target: Element) => (target as HTMLElement).dataset.finalColor ?? "#FFFFFF",
          stagger: 0.02,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "top 35%",
            scrub: 0.3,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const selectReason = (next: Reason) => {
    setReason(next);
    if (next !== "Business") setRole(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nextErrors: Record<string, string> = {};

    if (!String(form.get("name") || "").trim()) nextErrors.name = "Please enter your name.";
    const email = String(form.get("email") || "").trim();
    if (!email) nextErrors.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "That doesn't look like a valid email.";
    if (!String(form.get("company") || "").trim()) nextErrors.company = "Please enter your company name.";
    if (!String(form.get("message") || "").trim()) nextErrors.message = "Please add a short message.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
    }
  };

  const materialLabel =
    role === "seller" ? "Material you want to sell" : "Material you want to purchase";
  const quantityLabel =
    role === "seller"
      ? "Quantity per month you can sell"
      : "Quantity per month you want to buy";

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative z-10 w-full px-6 sm:px-12 lg:px-20 py-28"
      style={{
        // Same dark tint as before, but translucent — the interactive dot-grid
        // canvas behind the whole page (z-0) shows through faintly instead of
        // being fully covered.
        background:
          "linear-gradient(180deg, rgba(5,9,15,0.55) 0%, rgba(10,20,32,0.55) 45%, rgba(13,28,44,0.6) 100%)",
      }}
    >
      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* ── Left: Heading only — each letter pulls into focus as you scroll ── */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div>
            <p
              aria-label="Get In Touch"
              className="text-xs uppercase tracking-[0.2em] font-semibold mb-3"
            >
              <span aria-hidden="true">{renderChars("Get In Touch", "#2D96B2")}</span>
            </p>
            <h2 className="text-4xl sm:text-5xl font-black uppercase leading-[0.95] tracking-tight">
              <span aria-label="Let's talk" className="block">
                <span aria-hidden="true">{renderChars("Let's talk", "#FFFFFF")}</span>
              </span>
              <span aria-label="recovery." className="block">
                <span aria-hidden="true">{renderChars("recovery.", "#E8571A")}</span>
              </span>
            </h2>
            <p
              aria-label="Whether it's a partnership, a project, or a question about our process — our team responds within 24 hours."
              className="mt-5 text-base leading-relaxed max-w-sm"
            >
              <span aria-hidden="true">
                {renderChars(
                  "Whether it's a partnership, a project, or a question about our process — our team responds within 24 hours.",
                  "#CBD5E1"
                )}
              </span>
            </p>
          </div>
        </div>

        {/* ── Right: Form Card ── */}
        <div
          data-reveal
          className="lg:col-span-7 rounded-2xl p-6 sm:p-8"
          style={{
            background: "rgba(10, 22, 36, 0.5)",
            backdropFilter: "blur(40px) saturate(200%)",
            WebkitBackdropFilter: "blur(40px) saturate(200%)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            boxShadow: "0 16px 36px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.12)",
          }}
        >
          {submitted ? (
            <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center gap-3">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[rgba(232,87,26,0.15)] border border-[rgba(232,87,26,0.4)]">
                <svg className="w-7 h-7 text-[#E8571A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Message received</h3>
              <p className="text-sm text-[#94A3B8] max-w-xs">
                Our team will get back to you within 24 hours of submission
                of the form.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              {/* ── Reason of Contact — pill selector, first thing in the form ── */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#94A3B8] font-semibold mb-2">
                  Reason of Contact
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {reasonOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      data-cursor-hover
                      onClick={() => selectReason(option)}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                        reason === option
                          ? "bg-[#E8571A] border-[#E8571A] text-white"
                          : "bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.12)] text-[#CBD5E1] hover:border-[rgba(45,150,178,0.4)] hover:text-white"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {/* ── Business follow-up: seller / purchaser ── */}
                <div
                  className={`grid transition-all duration-300 ${
                    reason === "Business" ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                  }`}
                  style={{ display: "grid" }}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-wrap gap-2.5">
                      {(["seller", "purchaser"] as Role[]).map((option) => (
                        <button
                          key={option}
                          type="button"
                          data-cursor-hover
                          onClick={() => setRole(option)}
                          className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wide border transition-all duration-200 ${
                            role === option
                              ? "bg-[rgba(45,150,178,0.2)] border-[#2D96B2] text-white"
                              : "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-[#94A3B8] hover:text-white"
                          }`}
                        >
                          {option === "seller" ? "I'm a seller" : "I am a purchaser"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs uppercase tracking-wider text-[#94A3B8] font-semibold mb-2">
                    Name
                  </label>
                  <input id="name" name="name" type="text" placeholder="Jane Doe" className={inputClass} />
                  {errors.name && <p className="mt-1.5 text-xs text-[#E8571A]">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-wider text-[#94A3B8] font-semibold mb-2">
                    Email
                  </label>
                  <input id="email" name="email" type="email" placeholder="jane@company.com" className={inputClass} />
                  {errors.email && <p className="mt-1.5 text-xs text-[#E8571A]">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="company" className="block text-xs uppercase tracking-wider text-[#94A3B8] font-semibold mb-2">
                    Company
                  </label>
                  <input id="company" name="company" type="text" placeholder="Acme Inc." className={inputClass} />
                  {errors.company && <p className="mt-1.5 text-xs text-[#E8571A]">{errors.company}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs uppercase tracking-wider text-[#94A3B8] font-semibold mb-2">
                    Contact Number <span className="normal-case text-[#64748B]">(optional)</span>
                  </label>
                  <input id="phone" name="phone" type="tel" placeholder="+1 (555) 010-2024" className={inputClass} />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs uppercase tracking-wider text-[#94A3B8] font-semibold mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us a bit about what you're looking for…"
                  className={`${inputClass} resize-none`}
                />
                {errors.message && <p className="mt-1.5 text-xs text-[#E8571A]">{errors.message}</p>}
              </div>

              {/* ── Conditional material / quantity fields — only once a role is chosen ── */}
              <div
                className={`grid transition-all duration-300 ${
                  role ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
                style={{ display: "grid" }}
              >
                <div className="overflow-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                    <div>
                      <label htmlFor="material" className="block text-xs uppercase tracking-wider text-[#94A3B8] font-semibold mb-2">
                        {materialLabel}
                      </label>
                      <input id="material" name="material" type="text" placeholder="e.g. Lithium-ion battery scrap" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="quantity" className="block text-xs uppercase tracking-wider text-[#94A3B8] font-semibold mb-2">
                        {quantityLabel}
                      </label>
                      <input id="quantity" name="quantity" type="text" placeholder="e.g. 12 metric tons" className={inputClass} />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                data-cursor-hover
                className="mt-2 inline-flex items-center justify-center px-6 py-3 text-xs font-bold uppercase tracking-wider text-white rounded-full bg-[#E8571A] hover:bg-[#FF6A28] transition-all duration-200 shadow-[0_0_20px_rgba(232,87,26,0.45)] hover:shadow-[0_0_28px_rgba(232,87,26,0.7)] hover:scale-[1.02] self-start"
              >
                Send Query
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
