"use client";

import styled, { keyframes } from "styled-components";
import {
  ArrowRight,
  Database,
  Zap,
  Shield,
  Cpu,
  Activity,
  Server,
} from "lucide-react";
import Link from "next/link";

// --- ANIMATIONS ---
const drift = keyframes`
  0% { transform: translateY(0px); opacity: 0.5; }
  50% { transform: translateY(-20px); opacity: 1; }
  100% { transform: translateY(0px); opacity: 0.5; }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

// --- STYLES ---
const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-top: 80px;
  overflow: hidden;

  /* The Grid Background */
  background-size: 50px 50px;
  background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.03) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
`;

const HeroGlow = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba(88, 166, 255, 0.15) 0%,
    transparent 70%
  );
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
  filter: blur(80px);
`;

const Pill = styled.div`
  background: rgba(48, 54, 61, 0.5);
  border: 1px solid #30363d;
  padding: 6px 16px;
  border-radius: 99px;
  font-size: 12px;
  color: #58a6ff;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  backdrop-filter: blur(4px);
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 84px;
  font-weight: 800;
  letter-spacing: -3px;
  line-height: 1.05;
  text-align: center;
  margin-bottom: 24px;
  z-index: 1;
  background: linear-gradient(180deg, #fff 0%, #8b949e 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

  span {
    color: #58a6ff;
    -webkit-text-fill-color: #58a6ff;
  }
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: #8b949e;
  text-align: center;
  max-width: 600px;
  margin-bottom: 48px;
  line-height: 1.6;
  z-index: 1;
`;

// --- BENTO GRID ---
const BentoSection = styled.section`
  padding: 100px 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  margin-bottom: 64px;
  text-align: center;

  h2 {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 16px;
    letter-spacing: -1px;
  }

  p {
    color: #8b949e;
    font-size: 18px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 320px);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
`;

const Card = styled.div<{ $colSpan?: number; $highlight?: string }>`
  background: rgba(22, 27, 34, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  grid-column: span ${(p) => p.$colSpan || 1};
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s ease;

  /* The Spotlight Effect */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(255, 255, 255, 0.06),
      transparent 40%
    );
    z-index: 0;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    border-color: ${(p) => p.$highlight || "#58a6ff"};
    transform: translateY(-4px);
  }
`;

const CardContent = styled.div`
  position: relative;
  z-index: 1;
`;

const CardIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${(p) => `${p.$color}15`}; /* 15% opacity hex */
  color: ${(p) => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  border: 1px solid ${(p) => `${p.$color}30`};
`;

const CardTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #fff;
`;

const CardText = styled.p`
  color: #8b949e;
  font-size: 15px;
  line-height: 1.6;
`;

// --- VISUAL ELEMENTS INSIDE CARDS ---
const Scanline = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(88, 166, 255, 0.1),
    transparent
  );
  animation: ${scanline} 3s linear infinite;
  pointer-events: none;
`;

// --- COMPONENT ---
export default function MarketingPage() {
  // Simple Mouse Tracking for Spotlight Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cards = document.getElementsByClassName("bento-card");
    for (const card of cards as any) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    }
  };

  return (
    <Container onMouseMove={handleMouseMove}>
      <HeroSection>
        <HeroGlow />
        <Pill>
          <Zap size={12} fill="currentColor" /> v1.0.0 Stable Release
        </Pill>

        <Title>
          Ingest at <br />
          <span>Hyperspeed.</span>
        </Title>

        <Subtitle>
          The observability platform for the AI era. Built with Go, TimescaleDB,
          and a Write-Ahead Log that never loses a byte.
        </Subtitle>

        {/* Place for your "Exploded View" Image here later */}
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            height: "400px",
            background:
              "linear-gradient(180deg, rgba(22,27,34,0.5), transparent)",
            border: "1px solid #30363d",
            borderBottom: "none",
            borderRadius: "24px 24px 0 0",
            marginTop: "40px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "0",
              right: "0",
              textAlign: "center",
              color: "#30363d",
              fontSize: "12px",
            }}
          >
            [ PLACEHOLDER: Insert Generated &rsquo;Exploded Architecture&lsquo;
            Image Here ]
          </div>
          <Scanline />
        </div>
      </HeroSection>

      <BentoSection id="features">
        <SectionHeader>
          <h2>Engineered for Scale</h2>
          <p>We didn&apos;t just build a dashboard. We built a data engine.</p>
        </SectionHeader>

        <Grid>
          {/* Card 1: Hypertable */}
          <Card $colSpan={2} $highlight="#58a6ff" className="bento-card">
            <CardContent>
              <CardIcon $color="#58a6ff">
                <Database size={24} />
              </CardIcon>
              <CardTitle>TimescaleDB Hypertable</CardTitle>
              <CardText>
                Your logs aren&apos;t just rows. They are time-series data. Our
                engine automatically partitions data by time and project,
                enabling queries across billions of rows in milliseconds.
              </CardText>
            </CardContent>
            {/* Visual: Abstract Cube or Grid here */}
          </Card>

          {/* Card 2: Security */}
          <Card $highlight="#2ecc71" className="bento-card">
            <CardContent>
              <CardIcon $color="#2ecc71">
                <Shield size={24} />
              </CardIcon>
              <CardTitle>Vault-Grade Auth</CardTitle>
              <CardText>
                API Keys are hashed using SHA-256 and salt. Granular RBAC
                ensures users only see what they own.
              </CardText>
            </CardContent>
          </Card>

          {/* Card 3: Realtime */}
          <Card $highlight="#f1c40f" className="bento-card">
            <CardContent>
              <CardIcon $color="#f1c40f">
                <Activity size={24} />
              </CardIcon>
              <CardTitle>Zero-Latency Stream</CardTitle>
              <CardText>
                Forget polling. Our WebSocket engine pushes logs directly from
                the ingestion pipeline to your dashboard instantly.
              </CardText>
            </CardContent>
          </Card>

          {/* Card 4: The Engine (Go) */}
          <Card $colSpan={2} $highlight="#a371f7" className="bento-card">
            <CardContent>
              <CardIcon $color="#a371f7">
                <Cpu size={24} />
              </CardIcon>
              <CardTitle>Powered by Go & WAL</CardTitle>
              <CardText>
                We use a Write-Ahead Log (WAL) on disk to ensure durability.
                Even if the database crashes, your logs are safe in the buffer,
                replayed automatically upon recovery.
              </CardText>
            </CardContent>
          </Card>
        </Grid>
      </BentoSection>
    </Container>
  );
}
