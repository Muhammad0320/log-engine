"use client";

import React from "react";
import styled, { keyframes } from "styled-components";

// Total Items: 4 (3 real + 1 clone)
// We want to pause on each item for 25% of the time, then slide.
const infiniteScroll = keyframes`
  0%, 20% { transform: translateY(0); }        /* Item 1 */
  25%, 45% { transform: translateY(-100%); }   /* Item 2 */
  50%, 70% { transform: translateY(-200%); }   /* Item 3 */
  75%, 95% { transform: translateY(-300%); }   /* Item 4 (Clone of 1) */
  100% { transform: translateY(-300%); }       /* End state (visually same as start) */
`;

const Wrapper = styled.span`
  display: inline-flex;
  flex-direction: column;
  height: 1.1em; /* Locked height */
  overflow: hidden;
  vertical-align: bottom;
  text-align: left;
  margin-left: 12px;
`;

const RollList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  /* 8s duration:
     2s per item (1.5s pause + 0.5s slide)
  */
  animation: ${infiniteScroll} 8s cubic-bezier(0.5, 0, 0.2, 1) infinite;

  /* IMPORTANT: When animation ends at 100% (Item 4), 
     it loops back to 0% (Item 1) instantly. 
     Since Item 4 == Item 1, the jump is invisible. 
  */
`;

const RollItem = styled.li`
  height: 1.1em;
  line-height: 1.1em;
  display: block;
  color: #58a6ff;
  font-weight: 800;
  white-space: nowrap;
  text-shadow: 0 0 20px rgba(88, 166, 255, 0.4);
`;

export default function HeroRollingText() {
  return (
    <Wrapper>
      <RollList>
        <RollItem>Hyperscale Ingestion.</RollItem>
        <RollItem>HFT Systems.</RollItem>
        <RollItem>Realtime Debugging.</RollItem>
        {/* CLONE THE FIRST ITEM HERE */}
        <RollItem>Hyperscale Ingestion.</RollItem>
      </RollList>
    </Wrapper>
  );
}

// ... HandDrawnHighlight remains the same (removed unused 'squiggly') ...
export function HandDrawnHighlight({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        padding: "0 4px",
        fontWeight: 800,
        color: "#fff",
        cursor: "pointer",
      }}
    >
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      <div
        style={{
          content: '""',
          position: "absolute",
          bottom: "2px",
          left: 0,
          width: "100%",
          height: "30%",
          background: "#1f6feb",
          zIndex: 0,
          transform: "skew(-12deg) rotate(-2deg)",
          opacity: 0.8,
          borderRadius: "4px",
          transition: "all 0.2s ease",
        }}
        className="highlight-bg"
      />
      <style jsx>{`
        span:hover .highlight-bg {
          height: 90%;
          bottom: 5%;
          background: #58a6ff;
          opacity: 1;
          box-shadow: 0 0 15px #58a6ff;
        }
      `}</style>
    </span>
  );
}
