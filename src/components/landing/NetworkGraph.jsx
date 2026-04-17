import React, { useEffect, useRef } from "react";

const COLORS = ["#E50914", "#ff6b9d", "#feca57", "#48dbfb", "#1dd1a1", "#a29bfe", "#fd79a8"];

// Deterministic pseudo-random so the graph is stable per-mount but still varied
const seededRandom = (seed) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const NetworkGraph = () => {
  const svgRef = useRef(null);
  const pulsesRef = useRef(null);
  const nodesRef = useRef([]);

  useEffect(() => {
    const rand = seededRandom(42);
    const nodes = [];
    for (let i = 0; i < 44; i++) {
      nodes.push({
        x: 40 + rand() * 720,
        y: 30 + rand() * 320,
        c: COLORS[i % COLORS.length],
        r: rand() > 0.75 ? 5 : 3
      });
    }
    nodesRef.current = nodes;

    const svg = svgRef.current;
    if (!svg) return;

    const ns = "http://www.w3.org/2000/svg";
    const edgesG = svg.querySelector("#edges");
    const nodesG = svg.querySelector("#nodes");

    edgesG.innerHTML = "";
    nodesG.innerHTML = "";

    nodes.forEach((n) => {
      const c = document.createElementNS(ns, "circle");
      c.setAttribute("cx", n.x);
      c.setAttribute("cy", n.y);
      c.setAttribute("r", n.r);
      c.setAttribute("fill", n.c);
      c.setAttribute("opacity", "0.8");
      nodesG.appendChild(c);
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130 && rand() > 0.6) {
          const l = document.createElementNS(ns, "line");
          l.setAttribute("x1", nodes[i].x);
          l.setAttribute("y1", nodes[i].y);
          l.setAttribute("x2", nodes[j].x);
          l.setAttribute("y2", nodes[j].y);
          edgesG.appendChild(l);
        }
      }
    }

    const pulseInterval = setInterval(() => {
      const pulsesG = pulsesRef.current;
      if (!pulsesG) return;
      const n = nodes[Math.floor(Math.random() * nodes.length)];
      const p = document.createElementNS(ns, "circle");
      p.setAttribute("cx", n.x);
      p.setAttribute("cy", n.y);
      p.setAttribute("r", "4");
      p.setAttribute("fill", "none");
      p.setAttribute("stroke", n.c);
      p.setAttribute("stroke-width", "1.5");
      p.style.animation = "network-pulse 1.8s ease-out forwards";
      pulsesG.appendChild(p);
      setTimeout(() => p.remove(), 1800);
    }, 420);

    return () => clearInterval(pulseInterval);
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 380"
      className="w-full h-auto block"
    >
      <g id="edges" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" fill="none" />
      <g id="nodes" />
      <g ref={pulsesRef} id="pulses" />
    </svg>
  );
};

export default NetworkGraph;
