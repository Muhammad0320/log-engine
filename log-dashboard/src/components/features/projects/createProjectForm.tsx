"use client";

import { useEffect, useRef, useTransition } from "react";
import { useActionState } from "react";
import styled from "styled-components";
import { createProjectAction, CreateProjectState } from "@/actions/projects";
import { useToast } from "@/providers/ToastProvider";
import { FieldError } from "@/components/ui/formErrors";
import { BorderBeamButton } from "@/components/ui/borderBeamButton";
import { useFormState } from "react-dom";

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

export default function CreateProjectForm({
  onProjectCreated,
  addOptimistic,
}: {
  onProjectCreated: (data: {
    apiKey: string;
    apiSecret: string;
    projectId: number;
    name: string;
  }) => void;
  addOptimistic?: (project: {
    id: number;
    name: string;
    pending: boolean;
  }) => void;
}) {
  const [formState, action, isPending] = useActionState(createProjectAction, {
    success: false,
    errors: {},
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formState.success && formState.data) {
      onProjectCreated(formState.data);
      formRef.current?.reset();
    }
  }, [formState, onProjectCreated]);

  const handleSubmit = (form: FormData) => {
    const name = form.get("name") as string;

    if (addOptimistic) {
      addOptimistic({
        id: -1,
        name,
        pending: true,
      });
    }

    action(form);
  };

  return (
    <form ref={formRef} action={handleSubmit}>
      <Input
        name="name"
        placeholder="Project Name (e.g. Production-API)"
        autoFocus
      />
      <FieldError errors={formState.errors?.name} />

      <div style={{ marginTop: "20px" }}>
        <button type="submit" disabled={isPending}>
          create project
        </button>
        <BorderBeamButton
          type="submit"
          isLoading={isPending}
          disabled={isPending}
        >
          Create Project
        </BorderBeamButton>
      </div>
    </form>
  );
}
