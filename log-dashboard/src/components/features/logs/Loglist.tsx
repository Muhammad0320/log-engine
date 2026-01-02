// src/components/features/logs/Loglist.tsx
"use client";

import React, { useRef, useState } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import styled from "styled-components";
import { LogEntry } from "@/lib/types";
import { ChevronRight, ChevronDown } from "lucide-react";

// --- STYLES ---
const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #21262d;
`;

const LogRow = styled.div<{ $level: string; $isOpen: boolean }>`
  font-family: var(--font-fira-code), monospace;
  font-size: 13px;
  padding: 4px 8px; /* Reduced padding for tighter feel */
  border-left: 3px solid;
  border-left-color: ${(p) =>
    p.$level === "ERROR"
      ? "#ff6b6b"
      : p.$level === "WARN"
      ? "#f1c40f"
      : "#2ecc71"};

  background: ${(p) =>
    p.$isOpen 
      ? "rgba(88, 166, 255, 0.1)" 
      : p.$level === "ERROR" 
        ? "rgba(255, 107, 107, 0.05)" 
        : "transparent"};

  color: #c9d1d9;
  display: flex;
  gap: 12px;
  align-items: flex-start; /* Align to top for multiline messages */
  line-height: 1.5;
  cursor: pointer;
  transition: background 0.1s;

  &:hover {
    background: #21262d;
  }
`;

const Timestamp = styled.span`
  color: #8b949e;
  min-width: 85px;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
`;

const Level = styled.span<{ $level: string }>`
  font-weight: 700;
  width: 45px;
  flex-shrink: 0;
  color: ${(p) =>
    p.$level === "ERROR"
      ? "#ff6b6b"
      : p.$level === "WARN"
      ? "#f1c40f"
      : "#2ecc71"};
`;

const Service = styled.span`
  color: #58a6ff;
  flex-shrink: 0;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Message = styled.span`
  white-space: pre-wrap;
  word-break: break-all;
  flex: 1;
`;

const DataView = styled.pre`
  background: #0d1117;
  padding: 12px 12px 12px 48px; /* Indent to align with message */
  margin: 0;
  font-family: var(--font-fira-code), monospace;
  font-size: 12px;
  color: #7ee787;
  overflow-x: auto;
  border-top: 1px solid #30363d;
`;

// --- COMPONENT ---

interface LogItemProps {
  log: LogEntry;
}

// Extract row to separate component to manage open/close state independently
const LogItem = ({ log }: LogItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasData = log.data && Object.keys(log.data).length > 0;

  return (
    <RowContainer>
      <LogRow 
        $level={log.level} 
        $isOpen={isOpen} 
        onClick={() => hasData && setIsOpen(!isOpen)}
        style={{ cursor: hasData ? 'pointer' : 'default' }}
      >
        {/* Toggle Icon */}
        <div style={{ width: 16, display: 'flex', alignItems: 'center', opacity: 0.6 }}>
          {hasData && (
            isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          )}
        </div>

        <Timestamp>
          {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </Timestamp>

        <Level $level={log.level}>{log.level.slice(0, 4).toUpperCase()}</Level>

        <Service>[{log.service}]</Service>

        <Message>{log.message}</Message>
      </LogRow>

      {isOpen && hasData && (
        <DataView>
          {JSON.stringify(log.data, null, 2)}
        </DataView>
      )}
    </RowContainer>
  );
};

interface LogListProps {
  logs: LogEntry[];
}

export default function LogList({ logs }: LogListProps) {
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Virtuoso
        ref={virtuosoRef}
        data={logs}
        followOutput="auto"
        initialTopMostItemIndex={logs.length - 1}
        itemContent={(index, log) => <LogItem key={log.timestamp + index} log={log} />}
      />
    </div>
  );
}