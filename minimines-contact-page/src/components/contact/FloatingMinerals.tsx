"use client";

import Image from "next/image";

const specimens = [
  {
    src: "/minerals/cobalt.png",
    alt: "Cobalt specimen",
    imgWidth: 300,
    imgHeight: 300,
    cardW: 220,
    cardH: 170,
    wrapClass: "top-0 right-0",
    imgClass: "-top-16 -right-6",
    duration: "8s",
    delay: "0s",
    glow: "#E8571A",
  },
  {
    src: "/minerals/pyrrhotite.png",
    alt: "Pyrrhotite specimen, an iron-nickel sulphide mineral",
    imgWidth: 260,
    imgHeight: 260,
    cardW: 200,
    cardH: 150,
    wrapClass: "top-[300px] right-[70px]",
    imgClass: "-top-14 -left-8",
    duration: "10s",
    delay: "-4s",
    glow: "#2D96B2",
  },
];

export function FloatingMinerals() {
  return (
    <div className="relative w-[440px] h-[560px] hidden lg:block" aria-hidden="true">
      {specimens.map((s) => (
        <div
          key={s.src}
          className={`absolute ${s.wrapClass}`}
          style={{
            width: s.cardW,
            height: s.cardH,
            animation: `mineral-float ${s.duration} ease-in-out infinite`,
            animationDelay: s.delay,
          }}
        >
          {/* Glass card the specimen appears to break out of */}
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(10,22,36,0.55) 0%, rgba(10,22,36,0.35) 100%)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 45px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.08)",
            }}
          />

          {/* Ambient color glow behind the specimen */}
          <div
            className="absolute w-full h-full rounded-full blur-[60px] opacity-30"
            style={{ background: s.glow }}
          />

          {/* The specimen itself — larger than the card, breaking out above/beside it */}
          <div className={`absolute ${s.imgClass}`} style={{ width: s.imgWidth, height: s.imgHeight }}>
            <Image
              src={s.src}
              alt={s.alt}
              width={s.imgWidth}
              height={s.imgHeight}
              className="relative w-full h-full"
              style={{ filter: "drop-shadow(0 25px 35px rgba(0,0,0,0.6))" }}
            />
          </div>
        </div>
      ))}

      {/* CC BY attribution, as required by the license on these specimen scans */}
      <span className="absolute bottom-0 right-0 w-[320px] text-right text-[10px] leading-snug text-[#5C7A94] opacity-70">
        Specimen scans (CC BY): The Watt Institution · EDUROCK Aalto, via Sketchfab
      </span>

      <style>{`
        @keyframes mineral-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-28px) rotate(2.5deg); }
        }
      `}</style>
    </div>
  );
}
