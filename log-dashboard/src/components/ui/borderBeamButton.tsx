"use client";

import styled, { keyframes, css } from "styled-components";
import { ButtonHTMLAttributes } from "react";

// 1. The Rotation Animation
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// 2. The Wrapper (Acts as the "Border")
const ButtonContainer = styled.button<{ isLoading?: boolean }>`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border: none;
  background: transparent;
  padding: 0;
  cursor: ${(props) => (props.isLoading ? "wait" : "pointer")};
  outline: none;
  border-radius: 8px;
  overflow: hidden; // Clips the spinning giant gradient

  // Prevent clicking when loading
  pointer-events: ${(props) => (props.isLoading ? "none" : "auto")};

  &:focus-visible {
    box-shadow: 0 0 0 2px #58a6ff;
  }
`;

// 3. The "Beam" (Hidden layer that spins)
const MovingGradient = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%; // Must be huge to cover the corners during rotation
  height: 200%;
  transform: translate(-50%, -50%);

  // The Magic: A conic gradient with a hard "stop" creates the beam tail
  background: conic-gradient(
    from 90deg at 50% 50%,
    transparent 0%,
    transparent 40%,
    #238636 50%,
    /* The Tail Color (Green) */ #ffffff 55%,
    /* The Head Color (White highlight) */ transparent 60%,
    transparent 100%
  );

  // Animate only when loading
  animation: ${spin} 2s linear infinite;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${(props) =>
    props["aria-busy"] &&
    css`
      opacity: 1;
    `}
`;

// 4. The Inner Content (The actual button face)
const InnerContent = styled.div`
  position: relative;
  z-index: 1;
  width: calc(100% - 2px); // Leave 1px gap for border
  height: calc(100% - 2px); // Leave 1px gap for border
  margin: 1px; // Center it

  background: #238636; // Standard Green
  color: white;
  font-weight: 600;
  font-size: 16px;
  border-radius: 7px; // Slightly less than parent to fit
  padding: 12px 24px;

  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  // Hover effect (only when NOT loading)
  ${ButtonContainer}:hover & {
    background: #2ea043;
  }
`;

interface BorderBeamButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export function BorderBeamButton({
  isLoading,
  children,
  ...props
}: BorderBeamButtonProps) {
  return (
    <ButtonContainer type="button" isLoading={isLoading} {...props}>
      {/* The Spinning Background */}
      <MovingGradient aria-busy={isLoading} />

      {/* The Static Foreground */}
      <InnerContent>{isLoading ? "Processing..." : children}</InnerContent>
    </ButtonContainer>
  );
}
