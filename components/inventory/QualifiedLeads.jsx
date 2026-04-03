"use client";

import styled from "@emotion/styled";
import { Bolt, MonetizationOn, Refresh, MoreVert } from "@mui/icons-material";

const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  margin-bottom: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-weight: 600;
  color: #0f172a;
`;

const Badge = styled.span`
  background-color: #dbeafe;
  color: #1e3a8a;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const LeadList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LeadItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const LeadInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LeadName = styled.div`
  font-weight: 600;
  color: #0f172a;
  font-size: 0.95rem;
`;

const LeadDetail = styled.div`
  font-size: 0.8rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    font-size: 1rem;
  }
`;

export default function QualifiedLeads() {
  const leads = [
    { name: "Zaid Al-Hariri", detail: "High Interest • Viewed 4x", icon: <Bolt fontSize="small" /> },
    { name: "Omar F.", detail: "EV Enthusiast • Finance Inquiry", icon: <MonetizationOn fontSize="small" /> },
    { name: "Laila Murad", detail: "Trade-in Candidate", icon: <Refresh fontSize="small" /> },
  ];

  return (
    <Container>
      <Header>
        Qualified Leads
        <Badge>4 Serious Matches</Badge>
      </Header>
      <LeadList>
        {leads.map((lead, idx) => (
          <LeadItem key={idx}>
            <LeadInfo>
              <LeadName>{lead.name}</LeadName>
              <LeadDetail>
                {lead.icon}
                {lead.detail}
              </LeadDetail>
            </LeadInfo>
            <MoreVert style={{ color: "#94a3b8", cursor: "pointer" }} />
          </LeadItem>
        ))}
      </LeadList>
    </Container>
  );
}
