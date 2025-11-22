"use client";

import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

export const Skeleton = styled.div<{ width?: string; height?: string }>`
  background-color: #21262d;
  background-image: linear-gradient(
    90deg,
    #21262d 0px,
    #30363d 40px,
    #21262d 80px
  );
  background-size: 200px 100%;
  background-repeat: no-repeat;
  display: inline-block;
  border-radius: 4px;
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "20px"};
  animation: ${shimmer} 1.5s infinite linear;
`;
