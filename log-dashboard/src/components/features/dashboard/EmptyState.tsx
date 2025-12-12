"use client";

import styled, { keyframes } from "styled-components";
import { Plus, Terminal, Activity } from "lucide-react";
import { BorderBeamButton } from "@/components/ui/borderBeamButton";

// --- ANIMATIONS ---
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(88, 166, 255, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(88, 166, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(88, 166, 255, 0); }
`;

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(
    circle at center,
    rgba(22, 27, 34, 0.8) 0%,
    #0d1117 70%
  );
  border: 1px dashed #30363d;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
`;

const IconCircle = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(33, 38, 45, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  border: 1px solid #30363d;
  color: #58a6ff;
  animation: ${pulse} 2s infinite;

  svg {
    filter: drop-shadow(0 0 8px rgba(88, 166, 255, 0.5));
  }
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
`;

const Description = styled.p`
  color: #8b949e;
  font-size: 14px;
  max-width: 400px;
  margin-bottom: 32px;
  line-height: 1.5;
`;

const Steps = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 40px;
  opacity: 0.7;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #8b949e;
`;

export default function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <Container>
      <IconCircle>
        <Activity size={32} />
      </IconCircle>

      <Title>No Active Telemetry</Title>
      <Description>
        You haven&apos;t created a project yet. Initialize a new project to
        generate API keys and start streaming logs via HTTP or WebSocket.
      </Description>

      <Steps>
        <Step>
          <Plus size={16} />
          <span>Create Project</span>
        </Step>
        <Step>
          <div
            style={{
              width: 16,
              height: 1,
              background: "#30363d",
              marginTop: 8,
            }}
          />
        </Step>
        <Step>
          <Terminal size={16} />
          <span>Get API Keys</span>
        </Step>
      </Steps>

      <div style={{ width: "200px" }}>
        <BorderBeamButton onClick={onCreate} variant="primary">
          Initialize Project
        </BorderBeamButton>
      </div>
    </Container>
  );
}
