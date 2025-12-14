"use client";

import styled from "styled-components";
import { RefreshCw, Search, X } from "lucide-react";

const Container = styled.div`
  height: 50px;
  border-bottom: 1px solid #30363d;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: #0d1117;
  gap: 12px;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #8b949e;
  display: flex;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #30363d;
  background: #0d1117;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  background: #21262d;
  border: 1px solid #30363d;
  padding: 10px 12px;
  border-radius: 6px;
  color: #c9d1d9;
  font-size: 14px;
  &:focus {
    border-color: #58a6ff;
    outline: none;
  }
`;

const LimitInput = styled.input`
  width: 100px;
  text-align: center;
  background: #21262d;
  border: 1px solid #30363d;
  padding: 10px 6px;
  border-radius: 6px;
  color: #c9d1d9;
  font-size: 13px;
  &:focus {
    border-color: #58a6ff;
    outline: none;
  }
`;

const RefreshButton = styled.button`
  background: #21262d;
  border: 1px solid #30363d;
  color: #8b949e;
  border-radius: 6px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #30363d;
    color: #fff;
  }
`;

interface LogToolbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onRefresh: () => void; 
  limit: number;
  setLimit: (limit: number) => void 
}


export function LogToolbar({
  searchQuery,
  setSearchQuery,
  onRefresh,
  limit, 
  setLimit
}: LogToolbarProps) {

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const value = parseInt(e.target.value, 10)
    // Validation
    let newLimit = isNaN(value) ? 100 : value
    newLimit = Math.max(1, Math.min(1000, newLimit))

    setLimit(newLimit)
  }

  return (
    <Toolbar>
      <SearchInput 
        placeholder="Search logs (e.g., auth failed)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <LimitInput 
      type="number" 
      value={limit}
      onChange={handleLimitChange}
      min={1}
      max={1000}
      title="Logs per fetch (Max 1000)"
      />

      <RefreshButton onClick={onRefresh} >
        <RefreshCw size={14} />
      </RefreshButton>

    </Toolbar>
  );
}
