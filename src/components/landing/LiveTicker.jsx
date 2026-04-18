import React, { useState } from "react";

const TICKER_DATA = {
  all: [
    "videographer in austin matched",
    "travel RN contract filled san diego",
    "gig posted: bartender, brooklyn, $40/hr",
    "webflow developer joined from austin",
    "handyman booked: same-day fix",
    "intern landed summer gig at a16z",
    "photo editor matched to podcast studio",
    "gig posted: ICU nurse, 8 weeks, seattle",
    "tutor found: SAT prep, 2x/week",
    "plumber near lincoln park, $150/visit",
    "wedding shoot filled in 4 min",
    "illustrator → brand campaign"
  ],
  healthcare: [
    "travel RN contract filled san diego",
    "gig posted: ICU nurse, 8 weeks, seattle",
    "LPN match: nursing home, phoenix",
    "CNA weekend shifts, denver",
    "travel nurse: peds, $2900/wk, miami",
    "physical therapist, 3-month contract",
    "home health aide, full-time, austin",
    "dental hygienist, 2 days/wk, portland"
  ],
  service: [
    "gig posted: bartender, brooklyn, $40/hr",
    "handyman booked: same-day fix",
    "barista wanted, SF, $22/hr + tips",
    "server filled at steakhouse, chicago",
    "cleaning crew: airbnb turnover",
    "dog walker, upper east side",
    "event staff: 30-person party, LA",
    "line cook, weekend shifts, boston"
  ],
  creative: [
    "videographer in austin matched",
    "photo editor matched to podcast studio",
    "illustrator → brand campaign",
    "gig posted: DP, $2k, 2 days",
    "sound engineer for live podcast",
    "animator for startup explainer",
    "copywriter for ad campaign",
    "wedding shoot filled in 4 min"
  ],
  trades: [
    "plumber near lincoln park, $150/visit",
    "electrician, 2hr job, $200",
    "handyman booked: same-day fix",
    "carpenter for built-ins, austin",
    "hvac tech, emergency, $180/hr",
    "painter: 2-room job, $900",
    "locksmith: sunday rate, $120",
    "roofer quote: small repair"
  ],
  tech: [
    "webflow developer joined from austin",
    "gig posted: react dev, $5k, 2 weeks",
    "ios engineer freelance, $150/hr",
    "data analyst, SQL, remote $3k",
    "cto-for-hire, 10hrs/wk",
    "designer: figma, $2k/wk, 2 sprints",
    "qa tester matched to SaaS startup",
    "devops: 1-week contract, $4k"
  ]
};

const FILTERS = [
  { id: "all", label: "all" },
  { id: "healthcare", label: "healthcare" },
  { id: "service", label: "service" },
  { id: "creative", label: "folks" },
  { id: "trades", label: "trades" },
  { id: "tech", label: "tech" }
];

const LiveTicker = () => {
  const [filter, setFilter] = useState("all");
  const items = TICKER_DATA[filter];
  const doubled = [...items, ...items];

  return (
    <section className="border-y border-gray-100 bg-gray-50 py-6">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="flex justify-between items-center flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-[#E50914] rounded-full animate-pulse-dot" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-gray-500 lowercase">live on gully</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`font-mono text-[10px] tracking-wider px-3 py-1.5 rounded-full border transition-colors lowercase ${
                  filter === f.id
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-900 border-gray-200 hover:border-gray-400"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div
          className="overflow-hidden relative"
          style={{
            maskImage: "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)"
          }}
        >
          <div
            key={filter}
            className="flex gap-8 whitespace-nowrap animate-ticker"
          >
            {doubled.map((item, i) => (
              <span
                key={`${filter}-${i}`}
                className="font-mono text-xs text-gray-700 inline-flex items-center gap-2.5 flex-shrink-0"
              >
                <span className="w-1.5 h-1.5 bg-[#E50914] rounded-full inline-block" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveTicker;
