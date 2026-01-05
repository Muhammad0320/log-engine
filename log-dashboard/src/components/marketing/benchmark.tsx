"use client";

import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

const grow = keyframes`
  from { width: 0%; }
  to { width: 100%; }
`;

const Section = styled.section`
  padding: 100px 24px;
  max-width: 1000px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 36px;
  font-weight: 800;
  color: #fff;
  text-align: center;
  margin-bottom: 64px;
  span { color: #58a6ff; }
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: var(--font-geist-mono);
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const Label = styled.div`
  width: 120px;
  text-align: right;
  color: #8b949e;
  font-size: 14px;
  font-weight: 600;
`;

const BarTrack = styled.div`
  flex: 1;
  background: #161b22;
  height: 40px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
`;

const BarFill = styled.div<{ $width: number; $color: string; $delay: number; $visible: boolean }>`
  height: 100%;
  background: ${p => p.$color};
  width: ${p => p.$visible ? p.$width : 0}%;
  transition: width 1.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  transition-delay: ${p => p.$delay}ms;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
  color: #000;
  font-weight: 700;
  font-size: 13px;
  white-space: nowrap;
`;

export default function BenchmarkSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const data = [
    { name: "ELK Stack", value: 15, color: "#4b5563", label: "15k logs/s" },
    { name: "Loki (Go)", value: 45, color: "#6b7280", label: "45k logs/s" },
    { name: "Sijil v1", value: 104, color: "#58a6ff", label: "104k logs/s" },
  ];

  return (
    <Section ref={ref}>
      <Title>Built for <span>Speed</span>, Not Comfort.</Title>
      <ChartContainer>
        {data.map((item, i) => (
          <BarRow key={item.name}>
            <Label>{item.name}</Label>
            <BarTrack>
              <BarFill 
                $width={item.value} 
                $color={item.color} 
                $delay={i * 200}
                $visible={visible}
              >
                {item.label}
              </BarFill>
            </BarTrack>
          </BarRow>
        ))}
      </ChartContainer>
      <p style={{ textAlign: "center", marginTop: 32, fontSize: 13, color: "#484f58" }}>
        *Benchmarks run on 4vCPU / 8GB RAM Standard Instance.
      </p>
    </Section>
  );
}