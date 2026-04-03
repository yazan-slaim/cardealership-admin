"use client";

import styled from "@emotion/styled";
import Link from "next/link";
import { Notifications, Bolt, Person } from "@mui/icons-material";
import { usePathname } from "next/navigation";

const TopNavContainer = styled.header`
  height: 64px;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const Brand = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  color: #1e3a8a; /* deep blue */
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
`;

const SecondaryNav = styled.nav`
  display: flex;
  gap: 24px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled(Link)`
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  color: ${(props) => (props.$active ? "#0f172a" : "#64748b")};
  transition: color 0.2s ease;

  &:hover {
    color: #0f172a;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 8px;
  transition: background-color 0.2s ease, color 0.2s ease;
  position: relative;

  &:hover {
    background-color: #f1f5f9;
    color: #0f172a;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background-color: #ef4444; /* red */
  border-radius: 50%;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  border: 1px solid #cbd5e1;
`;

export default function TopNav() {
  const pathname = usePathname();

  const links = [
    { name: "Inventory", href: "/inventory" },
    { name: "Leads", href: "/leads" },
    { name: "Sales", href: "/sales" },
    { name: "Analytics", href: "/analytics" },
  ];

  return (
    <TopNavContainer>
      <LeftSection>
        <Brand>Precision Navigator CRM</Brand>
        <SecondaryNav>
          {links.map((link) => {
             const isActive = pathname.startsWith(link.href);
             return (
               <NavItem key={link.name} href={link.href} $active={isActive}>
                 {link.name}
               </NavItem>
             );
          })}
        </SecondaryNav>
      </LeftSection>
      <RightSection>
        <IconButton>
          <Notifications fontSize="small" />
          <Badge />
        </IconButton>
        <IconButton>
          <Bolt fontSize="small" />
        </IconButton>
        <Avatar>
          <Person fontSize="small" />
        </Avatar>
      </RightSection>
    </TopNavContainer>
  );
}
