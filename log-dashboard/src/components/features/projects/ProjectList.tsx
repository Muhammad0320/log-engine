"use client";

import { useState, useOptimistic, useTransition, useEffect } from "react";
import styled from "styled-components";
import { Loader2, Plus } from "lucide-react";
import { useActionState } from "react"; // Updated Next.js hook
import { createProjectAction, CreateProjectState } from "@/actions/projects";
import { Modal } from "@/components/ui/Modal";

import { useToast } from "@/providers/ToastProvider";
import { BorderBeamButton } from "../../ui/borderBeamButton";
import { FieldError } from "@/components/ui/formErrors";
import { Project } from "@/lib/types";

// Styled Components for the list
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 8px;
`;

const Title = styled.h3`
  font-size: 12px;
  text-transform: uppercase;
  color: #8b949e;
  letter-spacing: 0.5px;
`;

const AddButton = styled.button`
  background: none;
  border: none;
  color: #8b949e;
  cursor: pointer;
  &:hover {
    color: #58a6ff;
  }
`;

const ProjectItem = styled.div<{ active?: boolean; pending?: boolean }>`
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  background: ${(p) => (p.active ? "#21262d" : "transparent")};
  color: ${(p) => (p.active ? "#fff" : "#c9d1d9")};
  border-left: 3px solid ${(p) => (p.active ? "#238636" : "transparent")};
  opacity: ${(p) => (p.pending ? 0.5 : 1)}; // Visual cue for optimistic state
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: #21262d;
  }
`;

const Input = styled.input`
  width: 100%;
  background: #0d1117;
  border: 1px solid #30363d;
  color: #fff;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 8px;
  &:focus {
    outline: none;
    border-color: #58a6ff;
  }
`;
const initialState: CreateProjectState = {};

interface ProjectListProps {
  initialProjects: Project[]; // <-- Strict Typing
  onSelect: (id: number) => void;
  selectedId: number | null;
}

export default function ProjectList({
  initialProjects,
  onSelect,
  selectedId,
}: ProjectListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();

  // 1. Optimistic State
  const [optimisticProjects, addOptimisticProject] = useOptimistic(
    initialProjects,
    (state: Project[], newProject: Project) => [newProject, ...state]
  );

  // 2. Server Action
  const [state, formAction, isPending] = useActionState(
    createProjectAction,
    initialState
  );
  const [transitionPending, startTransition] = useTransition();

  // 3. Feedback
  useEffect(() => {
    if (state.success) {
      setIsOpen(false);
      toast.success("Project created successfully");
    } else if (state.errors?._form) {
      toast.error(state.errors._form[0]);
    }
  }, [state, toast]);

  // 4. Submit Handler
  const handleSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    if (!name) return;

    startTransition(async () => {
      addOptimisticProject({
        id: Math.random(),
        name: name,
        pending: true,
      });
      await formAction(formData);
    });
  };

  return (
    <Container>
      <Header>
        <Title>Projects</Title>
        <AddButton onClick={() => setIsOpen(true)}>
          <Plus size={16} />
        </AddButton>
      </Header>

      {optimisticProjects.map((p) => (
        <ProjectItem
          key={p.id}
          $active={selectedId === p.id}
          $pending={p.pending}
          onClick={() => !p.pending && onSelect(p.id)}
        >
          <span>{p.name}</span>
          {p.pending && <Loader2 size={12} className="animate-spin" />}
        </ProjectItem>
      ))}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create New Project"
      >
        <form action={handleSubmit}>
          <Input
            name="name"
            placeholder="Project Name (e.g. Production-API)"
            autoFocus
          />
          <FieldError errors={state.errors?.name} />

          <div style={{ marginTop: "20px" }}>
            <BorderBeamButton
              type="submit"
              isLoading={isPending || transitionPending}
            >
              Create Project
            </BorderBeamButton>
          </div>
        </form>
      </Modal>
    </Container>
  );
}
