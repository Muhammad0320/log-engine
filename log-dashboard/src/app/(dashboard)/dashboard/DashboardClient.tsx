"use client";

import { useEffect, useState } from "react";
import ProjectList from "@/components/features/projects/ProjectList";
import { useLogStream } from "@/hooks/useLogStream";
import { Project } from "@/lib/types"; // Using our shared type
import LogList from "@/components/features/logs/Loglist";
import { useToast } from "@/providers/ToastProvider";
import { LogToolbar } from "@/components/features/logs/LogToolbar";
import CreateProjectForm from "@/components/features/projects/createProjectForm";
import { Modal } from "@/components/ui/Modal";
import EmptyState from "@/components/features/dashboard/EmptyState";
import SummaryCards from "@/components/features/metrics/SummaryCards";
import VolumeChart from "@/components/features/metrics/VolumeChart";
import styled from "styled-components";
import { Settings } from "lucide-react";
import SettingsModal from "@/components/features/settings/SettingsModal";
import { DashboardGrid } from "@/components/layout/DashboardGrid";
import { useDashboard } from "@/providers/DashboardProviders";

// Helper for the header button
const HeaderBtn = styled.button`
  background: transparent;
  border: 1px solid #30363d;
  color: #8b949e;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    color: #fff;
    border-color: #58a6ff;
  }
`;

export default function DashboardClient({
  serverError,
}: {
  serverError: string | null;
}) {
  const toast = useToast();

  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    isCreateOpen,
    isSettingsOpen,
    setSettingsOpen,
    setCreateOpen,
    addProject,
    token,
  } = useDashboard();

  useEffect(() => {
    if (serverError) toast.error(serverError);
  }, [serverError, toast]);

  const [searchQuery, setSearchQuery] = useState("");

  // 3. Derived UI State
  const currentProjectName =
    projects.find((p) => p.id === selectedProjectId)?.name || "Select Project";

  // Get raw logs from your hook
  const { logs, status } = useLogStream(selectedProjectId || 0, token);

  // LOGIC: Filter logs before rendering
  // This is efficient enough for < 10k logs in client memory
  const filteredLogs = logs.filter((log) => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      log.message.toLowerCase().includes(lowerQuery) ||
      log.service.toLowerCase().includes(lowerQuery) ||
      log.level.toLowerCase().includes(lowerQuery)
    );
  });

  console.log(projects, "----------------");

  if (projects.length === 0) {
    return (
      <>
        <div
          style={{
            height: "100vh",
            padding: "24px",
            background: "var(--bg-color)",
          }}
        >
          <EmptyState onCreate={() => setCreateOpen(true)} />
        </div>

        <Modal
          isOpen={isCreateOpen}
          onClose={() => setCreateOpen(false)}
          title="Initialize Project"
        >
          <CreateProjectForm
            onProjectCreated={(data) => {
              addProject({ id: data.projectId, name: "New Project" });
              setCreateOpen(false);
            }}
            addOptimistic={() => {}}
          />
        </Modal>
      </>
    );
  }

  return (
    <>
      <DashboardGrid
        // --- HEADER ---
        header={
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              color: "#fff",
              width: "100%",
            }}
          >
            <h2
              style={{
                fontWeight: 700,
                fontSize: "18px",
                letterSpacing: "-0.5px",
              }}
            >
              LogEngine
            </h2>
            <div
              style={{ height: "20px", width: "1px", background: "#30363d" }}
            />
            <span style={{ fontSize: "14px", fontWeight: 500 }}>
              {currentProjectName}
            </span>

            {/* Settings Button */}
            <HeaderBtn
              onClick={() => setSettingsOpen(true)}
              style={{ marginLeft: "12px" }}
            >
              <Settings size={14} />
            </HeaderBtn>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginLeft: "auto",
                fontSize: "12px",
                color: "#8b949e",
                background: "#21262d",
                padding: "4px 8px",
                borderRadius: "20px",
                border: "1px solid #30363d",
              }}
            >
              <span
                style={{
                  height: "6px",
                  width: "6px",
                  borderRadius: "50%",
                  backgroundColor: status === "OPEN" ? "#2ecc71" : "#e74c3c",
                  boxShadow:
                    status === "OPEN"
                      ? "0 0 8px rgba(46, 204, 113, 0.4)"
                      : "none",
                }}
              />
              {status}
            </div>
          </div>
        }
        // --- SIDEBAR (Project Switcher) ---
        sidebar={
          <ProjectList
            initialProjects={projects}
            selectedId={selectedProjectId}
            onSelect={(id) => setSelectedProjectId(id)}
          />
        }
        metrics={<SummaryCards projectId={selectedProjectId} token={token} />}
        logs={
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <LogToolbar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onRefresh={() => {}}
            />
            <div style={{ flex: 1 }}>
              <LogList logs={filteredLogs} />
            </div>
          </div>
        }
        charts={<VolumeChart projectId={selectedProjectId} token={token} />}
      />
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Project Settings"
      >
        {selectedProjectId && <SettingsModal projectId={selectedProjectId} />}
      </Modal>
    </>
  );
}
