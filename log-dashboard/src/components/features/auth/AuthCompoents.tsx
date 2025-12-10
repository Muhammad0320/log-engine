"use client";

import styled, { keyframes } from "styled-components";
import Link from "next/link";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export const AuthContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #050505;
  /* subtle noise texture could be added here later */
  background-image: 
    radial-gradient(circle at 15% 50%, rgba(88, 166, 255, 0.08), transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(35, 134, 54, 0.08), transparent 25%);
`;

export const AuthCard = styled.div`
  width: 100%;
  max-width: 420px; /* Slightly wider for better spacing */
  padding: 48px;
  background: rgba(22, 27, 34, 0.6);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.6);
  
  /* UX FIX: The floating animation runs by default... */
  animation: ${float} 6s ease-in-out infinite;

  /* ...but PAUSES when the user interacts with it. */
  &:hover, &:focus-within {
    animation-play-state: paused;
    border-color: rgba(88, 166, 255, 0.3); /* Subtle highlight on interaction */
    transition: border-color 0.3s ease;
  }
`;

export const AuthTitle = styled.h1`
  font-family: var(--font-geist-sans), sans-serif; /* Enforce the font */
  font-size: 32px; /* Bigger */
  font-weight: 800; /* Bolder */
  text-align: center;
  margin-bottom: 8px;
  letter-spacing: -1px;
  
  /* THE GRADIENT SPLASH */
  background: linear-gradient(135deg, #fff 0%, #c9d1d9 40%, #58a6ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const AuthSubtitle = styled.p`
  text-align: center;
  color: #8b949e;
  font-size: 14px;
  margin-bottom: 32px;
`;

export const StyledAuthLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 24px;
  font-size: 13px;
  color: #8b949e;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    color: #58a6ff;
    text-shadow: 0 0 10px rgba(88, 166, 255, 0.4); /* Glow effect */
  }
`;