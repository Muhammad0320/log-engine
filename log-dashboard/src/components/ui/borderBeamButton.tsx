"use client";

import styled, { keyframes } from "styled-components";

// const borderRotate = keyframes`
//   100% { background-position: 0% 50%; }
// `;

// A specialized beam that hugs the border
const BeamContainer = styled.div<{ $duration?: number; $color?: string }>`
  position: absolute;
  inset: 0;
  border-radius: inherit; // Follows parent's rounded corners
  pointer-events: none;
  z-index: 10;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: -2px; // Slightly larger than container

    // The "Travelling Light" - A conic gradient that spins
    background: conic-gradient(
      from 0deg at 50% 50%,
      transparent 0%,
      transparent 90%,
      ${(p) => p.$color || "#58a6ff"} 100%
    );

    // Animation
    animation: spin ${(p) => p.$duration || 4}s linear infinite;
  }

  // Masking the center to create the "border" effect
  &::after {
    content: "";
    position: absolute;
    inset: 1px; // The thickness of the beam (inset by 1px)
    background: var(--bg-color); // Match card background
    border-radius: inherit;
    z-index: 1;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export function BorderBeam({
  duration = 4,
  color = "#58a6ff",
}: {
  duration?: number;
  color?: string;
}) {
  return <BeamContainer $duration={duration} $color={color} />;
}
