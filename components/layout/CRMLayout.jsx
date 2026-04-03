"use client";

import styled from "@emotion/styled";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: #f1f5f9; /* default subtle background */
  color: #0f172a;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ContentArea = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 32px;
`;

export default function CRMLayout({ children }) {
  return (
    <LayoutWrapper>
      <TopNav />
      <MainContent>
        <Sidebar />
        <ContentArea id="main-content-scroll">
          {children}
        </ContentArea>
      </MainContent>
    </LayoutWrapper>
  );
}
