"use client";

import styled from "@emotion/styled";
import { InfoOutlined, AutoAwesome } from "@mui/icons-material";

const Container = styled.div`
  background: linear-gradient(135deg, #1e3a8a, #312e81);
  border-radius: 12px;
  padding: 24px;
  color: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  margin-bottom: 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 16px;

  svg {
    color: #93c5fd;
  }
`;

const Content = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  color: #bfdbfe;
  margin-bottom: 24px;

  strong {
    color: white;
    text-decoration: underline;
  }
`;

const ActionBox = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-left: 3px solid #60a5fa;
  padding: 12px 16px;
  font-size: 0.85rem;
  font-style: italic;
  color: #dbeafe;
  border-radius: 0 8px 8px 0;
  margin-bottom: 20px;
`;

const Button = styled.button`
  width: 100%;
  background-color: white;
  color: #1e3a8a;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8fafc;
  }
`;

export default function AICopilotPanel() {
  return (
    <Container>
      <Header>
        <AutoAwesome /> AI Copilot Strategy
      </Header>
      <Content>
        Zaid Al-Hariri has <strong>viewed this listing 4x in 48 hours</strong> and checked the finance calculator. This car is currently 3% above market, but his session behavior suggests high emotional intent.
      </Content>
      <ActionBox>
        RECOMMENDED ACTION: <br />
        "Send Zaid the 3-year extended warranty PDF. Mention it covers the mild-hybrid system specifically."
      </ActionBox>
      <Button>
        <AutoAwesome fontSize="small" /> Generate AI Reply
      </Button>
    </Container>
  );
}
