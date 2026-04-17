import React, { useState, useEffect } from "react";

// TODO: Replace hardcoded thoughts with a live backend endpoint
// e.g. GET /api/taj/recent-thoughts returning anonymized recent match activity
// For now, these are illustrative examples. Taj is she/her.
const TAJ_THOUGHTS = [
  { who: "maya · videographer · brooklyn", what: "looking at 3 wedding briefs that match her reel" },
  { who: "sarah · RN · san diego", what: "checking her CA license expiry before pitching a contract" },
  { who: "jordan · bartender · austin", what: "2 short-shift openings near him tonight" },
  { who: "priya · webflow dev · remote", what: "pulling briefs under $2k with 2-week timelines" },
  { who: "marcus · SAT tutor · NYC", what: "4 parents in queens asking about summer prep" },
  { who: "lin · intern · boston", what: "scanning summer openings in biotech" },
  { who: "dev · plumber · chicago", what: "prioritizing same-day requests within 3 miles" },
  { who: "kai · DP · LA", what: "reading a brief for a 2-day indie shoot" },
  { who: "ana · LPN · phoenix", what: "matching her to 2 nursing home openings" },
  { who: "ty · barista · SF", what: "a cafe 4 blocks from him just posted a shift" },
  { who: "jess · illustrator · portland", what: "pitching her to 3 brands who loved her style" },
  { who: "omar · electrician · miami", what: "scanning today's trade briefs near coral gables" }
];

const TIME_LABELS = ["now", "2s ago", "8s ago", "16s ago", "28s ago"];

const TajConsole = () => {
  const [thoughts, setThoughts] = useState([]);

  useEffect(() => {
    let idx = 0;
    const addThought = () => {
      const th = TAJ_THOUGHTS[idx % TAJ_THOUGHTS.length];
      idx++;
      setThoughts((prev) => {
        const next = [th, ...prev];
        return next.slice(0, 5);
      });
    };
    for (let k = 0; k < 3; k++) addThought();
    const interval = setInterval(addThought, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-[640px] mx-auto bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
            style={{ background: "linear-gradient(135deg, #E50914 0%, #ff4757 100%)" }}
          >
            T
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 lowercase">taj's console</div>
            <div className="font-mono text-[10px] text-gray-500 tracking-wider lowercase">what i'm thinking about right now</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-green-500 tracking-wider lowercase">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse-dot inline-block" />
          live
        </div>
      </div>
      <div className="py-2 min-h-[280px]">
        {thoughts.map((th, i) => (
          <div
            key={`${th.who}-${i}`}
            className="px-6 py-3 border-b border-gray-50 flex gap-3 items-start animate-slide-in"
          >
            <div className="font-mono text-[10px] text-gray-400 tracking-wider min-w-[48px] mt-0.5 lowercase">
              {TIME_LABELS[i] || ""}
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-900 mb-0.5 lowercase">
                <span className="font-semibold">taj</span> is {th.what}
              </div>
              <div className="font-mono text-[10px] text-gray-500 tracking-wide lowercase">
                for {th.who}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-3 border-t border-gray-100 font-mono text-[9px] text-gray-400 tracking-wider lowercase text-center">
        names and details illustrative · real activity anonymized
      </div>
    </div>
  );
};

export default TajConsole;
