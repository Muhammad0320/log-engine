"use client";

import styled from "styled-components";
import { Activity, AlertCircle, Server, Layers } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LogSummary } from "@/actions/metrics";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const Card = styled.div`
  background: rgba(13, 17, 23, 0.6);
  border: 1px solid #30363d;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.2s;

  &:hover {
    border-color: #58a6ff;
  }
`;

const Label = styled.div`
  color: #8b949e;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Value = styled.div`
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  font-family: var(--font-geist-mono);
`;

export default function SummaryCards({
  data,
  loading,
}: {
  data: LogSummary | null;
  loading: boolean;
}) {
  if (loading || !data) {
    return (
      <Grid>
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <Skeleton className="h-4 w-24 mb-4 bg-[#30363d]" />
            <Skeleton className="h-8 w-16 bg-[#30363d]" />
          </Card>
        ))}
      </Grid>
    );
  }

  return (
    <Grid>
      <Card>
        <Label>
          <Layers size={14} /> Total Logs (24h)
        </Label>
        <Value>{data.total_logs.toLocaleString()}</Value>
      </Card>

      <Card>
        <Label>
          <AlertCircle
            size={14}
            color={data.error_rate > 5 ? "#e74c3c" : "#2ecc71"}
          />
          Error Rate
        </Label>
        <Value style={{ color: data.error_rate > 5 ? "#e74c3c" : "#fff" }}>
          {data.error_rate.toFixed(2)}%
        </Value>
      </Card>

      <Card>
        <Label>
          <Server size={14} /> Active Services
        </Label>
        <Value>{data.service_count}</Value>
      </Card>

      <Card>
        <Label>
          <Activity size={14} /> System Status
        </Label>
        <Value
          style={{ color: "#58a6ff", fontSize: "16px", marginTop: "auto" }}
        >
          Operational
        </Value>
      </Card>
    </Grid>
  );
}
