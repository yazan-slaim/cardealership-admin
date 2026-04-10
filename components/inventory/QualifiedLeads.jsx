"use client";

import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { WhatsApp, Whatshot, Visibility, Loop } from "@mui/icons-material";

const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05);

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  h3 {
    margin: 0;
    font-size: 1rem;
    color: #0f172a;
  }
  
  .badge {
    background: #dbeafe;
    color: #1e3a8a;
    font-size: 0.7rem;
    padding: 4px 8px;
    border-radius: 12px;
    font-weight: 700;
  }
`;

const LeadItem = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:last-child {
    border: none;
    padding-bottom: 0;
  }
  
  .info {
    .name {
      font-weight: 700;
      font-size: 0.95rem;
      color: #0f172a;
      margin-bottom: 2px;
    }
    
    .desc {
      font-size: 0.8rem;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
`;

const WAButton = styled.a`
  background-color: #25d366;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

export default function QualifiedLeads({ carId, carSummaryText }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!carId) return;

    async function fetchLeads() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/cars/${carId}/leads`);
        const data = await res.json();
        if (data.success) {
          setLeads(data.leads);
        }
      } catch (err) {
        console.error("Failed to load leads", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, [carId]);

  if (loading) return <Container>Loading leads...</Container>;

  return (
    <Container>
      <div className="head">
        <h3>Qualified Leads</h3>
        {leads.length > 0 && <div className="badge">{leads.length} Active</div>}
      </div>

      {leads.length === 0 ? (
        <div style={{ color: "#64748b", fontSize: "0.85rem", fontStyle: "italic" }}>
          No active leads engaged with this vehicle yet.
        </div>
      ) : (
        leads.map((lead) => {
          const client = lead.clientId || {};
          const name = client.fullName || "Unknown Client";
          const phoneNum = client.phoneNumber ? client.phoneNumber.replace(/[^0-9]/g, "") : "";
          
          // Generate customized WhatsApp Template Message
          const waMessage = encodeURIComponent(
            `Hello ${client.fullName ? client.fullName.split(" ")[0] : ""}, I noticed you were looking at the ${carSummaryText}. Are you available for a quick call?`
          );
          
          const waLink = phoneNum ? `https://wa.me/${phoneNum}?text=${waMessage}` : null;

          return (
            <LeadItem key={lead._id}>
              <div className="info">
                <div className="name">{name} <span style={{color: '#94a3b8', fontWeight: 400, fontSize: '0.8rem'}}>({lead.score}/100)</span></div>
                <div className="desc">
                  {lead.score > 80 ? (
                    <><Whatshot fontSize="small" style={{ color: "#ef4444" }} /> Hot interest</>
                  ) : lead.financingInterest ? (
                    <><Visibility fontSize="small" style={{ color: "#3b82f6" }} /> Finance Inquiry</>
                  ) : (
                    <><Loop fontSize="small" style={{ color: "#16a34a" }} /> Trade-in Candidate</>
                  )}
                  <span style={{ margin: "0 4px" }}>•</span> Viewed {lead.visits}x
                </div>
              </div>

              {waLink ? (
                <WAButton href={waLink} target="_blank" title="Message on WhatsApp">
                  <WhatsApp fontSize="small" />
                </WAButton>
              ) : (
                <span style={{ fontSize: "0.7rem", color: "#ef4444" }}>No Phone</span>
              )}
            </LeadItem>
          );
        })
      )}
    </Container>
  );
}
