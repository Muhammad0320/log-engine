"use client";

import { useActionState, useEffect, useState } from "react";
import styled from "styled-components";
import { fetchClient } from "@/lib/client";
import { BorderBeamButton } from "@/components/ui/borderBeamButton";
import { useToast } from "@/providers/ToastProvider";
import { UserPlus, Shield } from "lucide-react";
import { inviteMemberAction } from "@/actions/members";
import { InviteState } from "@/lib/definitions";

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h4`
  color: #fff;
  font-size: 14px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  background: #0d1117;
  border: 1px solid #30363d;
  color: #fff;
  padding: 10px;
  border-radius: 6px;

  &:focus {
    border-color: #58a6ff;
    outline: none;
  }
`;

const Select = styled.select`
  background: #0d1117;
  border: 1px solid #30363d;
  color: #fff;
  padding: 10px;
  border-radius: 6px;
`;

const initialState: InviteState = {};

export default function SettingsModal({ projectId }: { projectId: number }) {
  const toast = useToast();

  const [state, action, isPending] = useActionState(
    inviteMemberAction,
    initialState
  );

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
    } else if (state.errors?._form) {
      toast.error(state.errors._form[0]);
    }
  }, [state, toast]);

  return (
    <div>
      <Section>
        <SectionTitle>
          <UserPlus size={16} /> Invite Team Member
        </SectionTitle>
        <form action={action}>
          <input type="hidden" name="projectId" value={projectId} />
          <InputGroup>
            <Input
              type="email"
              placeholder="colleague@company.com"
              name="email"
              required
            />
            <Select name="role" defaultValue={"viewer"}>
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </Select>
          </InputGroup>
          <div style={{ marginTop: "12px" }}>
            <BorderBeamButton
              type="submit"
              isLoading={isPending}
              variant="primary"
            >
              Send Invite
            </BorderBeamButton>
          </div>
        </form>
      </Section>

      <Section style={{ borderTop: "1px solid #30363d", paddingTop: "24px" }}>
        <SectionTitle>
          <Shield size={16} /> API Keys
        </SectionTitle>
        <p style={{ fontSize: "13px", color: "#8b949e", lineHeight: "1.5" }}>
          API Keys are hashed and cannot be revealed again. To rotate keys, you
          must regenerate them (this will break existing integrations).
        </p>
        <div style={{ marginTop: "12px" }}>
          <button
            style={{
              color: "#ff6b6b",
              background: "none",
              border: "1px solid #ff6b6b",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            Rotate Keys (Coming Soon)
          </button>
        </div>
      </Section>
    </div>
  );
}
