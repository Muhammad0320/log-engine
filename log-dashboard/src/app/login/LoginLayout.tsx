"use client";

import styled from "styled-components";

export const LoginContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color);
`;

export const LoginCard = styled.div`
  width: 400px;
  padding: 40px;
  background: #161b22;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`;

export const LoginTitle = styled.h1`
  color: var(--text-color);
  font-size: 24px;
  text-align: center;
  margin-bottom: 24px;
`;
