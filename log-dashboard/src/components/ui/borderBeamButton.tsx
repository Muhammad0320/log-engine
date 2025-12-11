"use client";

import styled, { keyframes, css } from "styled-components";
import { ButtonHTMLAttributes } from "react";

// --- 1. CONFIGURATION ---
const VARIANTS = {
  primary: {
    buttonBg: "#1f6feb", // GitHub Blue
    buttonHover: "#388bfd",
    beamColor: "#58a6ff", // Light Blue
    glowColor: "rgba(56, 139, 253, 0.6)",
  },
  success: {
    buttonBg: "#238636", // GitHub Green
    buttonHover: "#2ea043",
    beamColor: "#3fb950", // Neon Green
    glowColor: "rgba(46, 160, 67, 0.6)",
  },
  danger: {
    buttonBg: "#da3633", // Red
    buttonHover: "#f85149",
    beamColor: "#ff7b72", // Salmon/Neon Red
    glowColor: "rgba(248, 81, 73, 0.6)",
  },
};

const spin = keyframes`
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
`;

// --- 2. COMPONENTS ---

const ButtonContainer = styled.button<{
  $isLoading?: boolean;
  $variant: keyof typeof VARIANTS;
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: ${(p) => (p.$isLoading ? "wait" : "pointer")};
  outline: none;
  border-radius: 8px;
  // We clip the hard beam, but we might want the glow to spill out?
  // For a "contained" beam look, overflow hidden is cleaner.
  overflow: hidden;
  font-weight: 600;
  font-size: 14px;
  color: white;
  transition: all 0.2s;

  opacity: ${(p) => (p.$isLoading ? 0.8 : 1)};
  pointer-events: ${(p) => (p.$isLoading ? "none" : "auto")};

  &:focus-visible {
    box-shadow: 0 0 0 2px ${(p) => VARIANTS[p.$variant].beamColor};
  }
`;

const BeamLayer = styled.div<{
  $active?: boolean;
  $variant: keyof typeof VARIANTS;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 500%;
  transform: translate(-50%, -50%);
  z-index: 0;

  /* The Magic: A conic gradient that matches the theme */
  background: conic-gradient(
    from 0deg,
    transparent 0%,
    transparent 70%,
    ${(p) => VARIANTS[p.$variant].glowColor} 80%,
    ${(p) => VARIANTS[p.$variant].beamColor} 90%,
    #ffffff 100%
  );

  opacity: ${(p) => (p.$active ? 1 : 0)};
  animation: ${(p) =>
    p.$active
      ? css`
          ${spin} 2s linear infinite
        `
      : "none"};
  transition: opacity 0.3s ease;

  /* Add a blur to soften the beam into "Plasma" */
  filter: blur(4px);
`;

// A second sharper beam on top for definition
const SharpBeamLayer = styled(BeamLayer)`
  filter: blur(0px);
  width: 200%;
  height: 500%;
  background: conic-gradient(
    from 0deg,
    transparent 0%,
    transparent 85%,
    ${(p) => VARIANTS[p.$variant].beamColor} 95%,
    #ffffff 100%
  );
`;

const InnerMask = styled.div<{ $variant: keyof typeof VARIANTS }>`
  position: absolute;
  inset: 2px; // Thickness of the beam
  background: ${(p) => VARIANTS[p.$variant].buttonBg};
  border-radius: 6px; // Match curvature
  z-index: 1;
  transition: background 0.2s;

  ${ButtonContainer}:hover & {
    background: ${(p) => VARIANTS[p.$variant].buttonHover};
  }
`;

const ContentLayer = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface BorderBeamButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "success" | "danger";
}

export function BorderBeamButton({
  isLoading,
  children,
  variant = "success", // Defaulting to success since your main use case is "Create"
  ...props
}: BorderBeamButtonProps) {
  return (
    <ButtonContainer
      type="button"
      $isLoading={isLoading}
      $variant={variant}
      {...props}
    >
      {/* The Glow Beam */}
      <BeamLayer $active={isLoading} $variant={variant} />

      {/* The Sharp Beam (Core) */}
      <SharpBeamLayer $active={isLoading} $variant={variant} />

      {/* The Background Mask */}
      <InnerMask $variant={variant} />

      {/* Content */}
      <ContentLayer>{children}</ContentLayer>
    </ButtonContainer>
  );
}
