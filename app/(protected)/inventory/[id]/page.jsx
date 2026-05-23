"use client";

import styled from "@emotion/styled";
import MainVehicleView from "@/components/inventory/MainVehicleView";
import AICopilotPanel from "@/components/inventory/AICopilotPanel";
import QualifiedLeads from "@/components/inventory/QualifiedLeads";
import NegotiationHelper from "@/components/inventory/NegotiationHelper";
import LiveViewersWidget from "@/components/inventory/LiveViewersWidget";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const PageContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
  opacity: 0; /* starts hidden for GSAP */

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function InventoryDetail() {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.to(containerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      startAt: { y: 20 },
    });
  }, []);

  return (
    <PageContainer ref={containerRef}>
      <LeftColumn className="left-content">
        <MainVehicleView />
      </LeftColumn>
      <RightColumn className="right-content">
        <LiveViewersWidget />
        <AICopilotPanel />
        <QualifiedLeads />
        <NegotiationHelper />
      </RightColumn>
    </PageContainer>
  );
}
