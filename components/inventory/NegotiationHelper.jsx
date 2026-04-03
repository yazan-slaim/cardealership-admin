"use client";

import styled from "@emotion/styled";

const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  margin-bottom: 24px;
`;

const Header = styled.h3`
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 20px;
  font-size: 1.05rem;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 0.9rem;
`;

const Label = styled.span`
  color: #64748b;
`;

const Value = styled.span`
  color: #0f172a;
  font-weight: 500;
`;

const SimulateOffer = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
`;

const OfferInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
`;

const OfferInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  outline: none;
  background-color: #f8fafc;

  &:focus {
    border-color: #3b82f6;
  }
`;

const ProfitBadge = styled.div`
  background-color: #bbf7d0;
  color: #166534;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 700;
`;

export default function NegotiationHelper() {
  return (
    <Container>
      <Header>Negotiation Helper</Header>
      
      <Row>
        <Label>Landed Cost</Label>
        <Value>JOD 74,100</Value>
      </Row>
      <Row>
        <Label>Current ROI Estimate</Label>
        <Value>11.3%</Value>
      </Row>

      <SimulateOffer>
        <Label style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 600 }}>Simulate Offer</Label>
        <OfferInputContainer>
          <OfferInput type="text" defaultValue="JOD 79,000" />
          <ProfitBadge>Profit: JOD 4.9k</ProfitBadge>
        </OfferInputContainer>
      </SimulateOffer>
    </Container>
  );
}
