"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, Code, Webhook, Key, Zap } from "lucide-react";

// --- STYLES ---
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: #000; /* Deepest black */
  color: #fff;
  font-family: var(--font-geist-sans);
`;

const Sidebar = styled.aside`
  width: 280px;
  position: fixed;
  top: 80px; /* Below Navbar */
  left: 0;
  bottom: 0;
  overflow-y: auto;
  border-right: 1px solid #1c1c1c;
  padding: 32px 24px;
  background: #000;

  /* Scrollbar hide */
  &::-webkit-scrollbar {
    width: 0;
  }

  @media (max-width: 768px) {
    display: none; /* Hide on mobile for v1 */
  }
`;

const Main = styled.main`
  flex: 1;
  margin-left: 280px; /* Offset for sidebar */
  padding: 48px 64px;
  max-width: 1000px;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 24px;
  }
`;

const SectionTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
  margin-top: 32px;

  &:first-child {
    margin-top: 0;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  margin: 4px 0;
  font-size: 14px;
  color: ${(p) => (p.$active ? "#fff" : "#888")};
  background: ${(p) => (p.$active ? "#111" : "transparent")};
  border-radius: 6px;
  transition: all 0.2s;
  text-decoration: none;

  &:hover {
    color: #fff;
    background: #111;
  }
`;

// --- COMPONENT ---
export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <Container>
      <Sidebar>
        <SectionTitle>Getting Started</SectionTitle>
        <NavLink href="/docs" $active={isActive("/docs")}>
          <Book size={14} /> Introduction
        </NavLink>
        <NavLink href="/docs/quickstart" $active={isActive("/docs/quickstart")}>
          <Zap size={14} /> Quickstart
        </NavLink>

        <SectionTitle>API Reference</SectionTitle>
        <NavLink href="/docs/api-keys" $active={isActive("/docs/api-keys")}>
          <Key size={14} /> Authentication
        </NavLink>
        <NavLink href="/docs/ingestion" $active={isActive("/docs/ingestion")}>
          <Code size={14} /> Ingestion
        </NavLink>
        <NavLink href="/docs/webhooks" $active={isActive("/docs/webhooks")}>
          <Webhook size={14} /> Webhooks
        </NavLink>

        <SectionTitle>SDKs</SectionTitle>
        <NavLink href="/docs/sdks/node" $active={isActive("/docs/sdks/node")}>
          Node.js
        </NavLink>
        <NavLink
          href="/docs/sdks/python"
          $active={isActive("/docs/sdks/python")}
        >
          Python
        </NavLink>
        <NavLink href="/docs/sdks/go" $active={isActive("/docs/sdks/go")}>
          Go
        </NavLink>
      </Sidebar>

      <Main>{children}</Main>
    </Container>
  );
}
