"use client";

import { useEffect, useOptimistic, useRef, useState } from "react";
import ProjectList from "@/components/features/projects/ProjectList";
import { useLogStream } from "@/hooks/useLogStream";
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
import { LogEntry, Project } from "@/lib/types";
import { getLogsAction } from "@/actions/logs";
import KeyRevel from "@/components/features/projects/KeyReveal";
import { useLiveMetrics } from "@/hooks/useLiveMetrics";

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

const matchLog = (log: LogEntry, query: string) => {
  if (!query) return true;

  const lowerQuery = query.toLowerCase();
  const searchTokens = lowerQuery
    .split(" ")
    .map((token) => token.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim())
    .filter(Boolean);

  if (searchTokens.length === 0) return true;

  return searchTokens.every(
    (token) =>
      log.message.includes(token) ||
      log.service.includes(token) ||
      log.service.includes(token)
  );
};

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
    isSettingsOpen,
    setSettingsOpen,
    isCreateOpen,
    setCreateOpen,
    addProject,
    token,
  } = useDashboard();

  useEffect(() => {
    if (serverError) toast.error(serverError);
  }, [serverError, toast]);

  const [optimisticProjects, addOptimistic] = useOptimistic<Project[], Project>(
    projects,
    (state, newProject) => {
      const existing = state.find((p) => p.id === newProject.id);

      if (existing) {
        return state.map((p) => (p.id === newProject.id ? newProject : p));
      }

      return [{ ...newProject, pending: true }, ...state];
    }
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Infinite scroll state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [hasMore, setHasMore] = useState(true);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  const [modalState, setModalState] = useState<{
    mode: "CREATE" | "KEYS";
    data?: {
      name: string;
      apiKey: string;
      apiSecret: string;
      projectId: number;
    };
  } | null>(null);

  // --- Logic 1: Reset state
  useEffect(() => {
    // Ruthless
    if (page !== 1) {
      setTimeout(() => {
        setPage(1);
      }, 0);
    } else {
      setTimeout(() => {
        setLogs([]);
        setHasMore(true);
      }, 0);
    }
  }, [selectedProjectId, searchQuery, limit]);

  // --- Logic 2: Fetching history
  useEffect(() => {
    if (!selectedProjectId) return;
    if (!hasMore && page > 1) return;

    let ignore = false;

    const fetchHistory = async () => {
      setIsSearching(true);
      const res = await getLogsAction(
        selectedProjectId,
        searchQuery,
        page,
        limit
      );
      if (!ignore && res.success) {
        setLogs((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
      }
      setIsSearching(false);
    };

    const timer = setTimeout(fetchHistory, 1000);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [selectedProjectId, searchQuery, page, limit, hasMore]);

  // -- Infinite scroll
  useEffect(() => {
    const element = logsContainerRef.current;
    if (!element || !hasMore || isSearching) return;

    const handleScroll = () => {
      // Checks is user is 90% of the way to the bottom (the last log)
      const isNearBottom =
        element.scrollTop + element.clientHeight >= element.scrollHeight * 0.9;

      if (isNearBottom) {
        setPage((prev) => prev + 1);
      }
    };
    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, [hasMore, isSearching]);

  // Get raw logs from your hook
  const { logs: liveLogs, status } = useLogStream(
    selectedProjectId || 0,
    token
  );
  const {
    stats,
    summary,
    loading: metricsLoading,
  } = useLiveMetrics(selectedProjectId, liveLogs);
  const lastProcessedRef = useRef<string | null>(null);

  useEffect(() => {
    if (liveLogs.length === 0) return;

    const latestLog = liveLogs[0];

    // Guard against readding old logs when the the seachQuery changes
    if (latestLog.timestamp === lastProcessedRef.current) return;

    // Mark log as processed
    lastProcessedRef.current = latestLog.timestamp;

    if (matchLog(latestLog, searchQuery)) {
      setTimeout(() => {
        setLogs((prev) => [latestLog, ...prev]);
      }, 0);
    }
  }, [liveLogs, searchQuery]);

  useEffect(() => {
    if (isCreateOpen)
      setTimeout(() => {
        setModalState({ mode: "CREATE" });
      }, 0);
    else if (modalState?.mode === "CREATE")
      setTimeout(() => {
        setModalState(null);
      }, 0);
  }, [isCreateOpen, modalState?.mode]);

  const handleCloseModal = () => {
    setModalState(null);
    setCreateOpen(false);
  };

  // 3. Derived UI State
  const currentProjectName =
    projects.find((p) => p.id === selectedProjectId)?.name || "Select Project";

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
          isOpen={!!modalState}
          onClose={handleCloseModal}
          title={
            modalState?.mode === "KEYS"
              ? "Project Initialized"
              : "Initialize Project"
          }
        >
          {modalState?.mode === "CREATE" && (
            <CreateProjectForm
              onProjectCreated={(data) => {
                addProject({ id: data.projectId, name: data.name });
                setCreateOpen(false);

                // switch modal to key revel mode
                setModalState({ mode: "KEYS", data });
              }}
              addOptimistic={(newProject) =>
                addOptimistic({ ...newProject, id: -1 })
              }
            />
          )}
          {modalState?.mode === "KEYS" && modalState.data && (
            <KeyRevel data={modalState.data} onClose={handleCloseModal} />
          )}
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
              Sijil
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
            initialProjects={optimisticProjects}
            selectedId={selectedProjectId}
            onSelect={(id) => setSelectedProjectId(id)}
            onAddClick={() => setModalState({ mode: "CREATE" })}
          />
        }
        metrics={<SummaryCards data={summary} loading={metricsLoading} />}
        logs={
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <LogToolbar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onRefresh={() => setPage(1)}
              limit={limit}
              setLimit={setLimit}
            />
            <div
              ref={logsContainerRef}
              style={{ flex: 1, position: "relative", overflowY: "auto" }}
            >
              {isSearching &&
                page === 1 && ( // Show searching overlay only on the initial load
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backdropFilter: "blur(2px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                      backgroundColor: "rgba(13, 17, 23, 0.5)",
                    }}
                  >
                    <p style={{ color: "#58a6ff", fontSize: "13px" }}>
                      Searching...
                    </p>
                  </div>
                )}
              <LogList logs={logs} />
              {/* Show loading spinner for subsequent pages */}
              {isSearching && page > 1 && (
                <div
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    color: "#8b949e",
                    fontSize: "12px",
                  }}
                >
                  Loading more...
                </div>
              )}
              {!hasMore && logs.length > 0 && (
                <div
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    color: "#8b949e",
                    fontSize: "12px",
                  }}
                >
                  End of Logs
                </div>
              )}
            </div>
          </div>
        }
        charts={<VolumeChart data={stats} loading={metricsLoading} />}
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
