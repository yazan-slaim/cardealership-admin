"use client";

import styled from "@emotion/styled";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Dashboard, 
  DirectionsCar, 
  PeopleAlt, 
  Description, 
  TrendingUp, 
  Settings, 
  HelpOutline 
} from "@mui/icons-material";

const SidebarContainer = styled.aside`
  width: 260px;
  background-color: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px); /* Assuming TopNav is 64px */
  padding: 24px 0;
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px;
  flex: 1;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  color: ${(props) => (props.$active ? "#0f172a" : "#64748b")};
  background-color: ${(props) => (props.$active ? "#e2e8f0" : "transparent")};
  transition: all 0.2s ease;

  &:hover {
    background-color: #e2e8f0;
    color: #0f172a;
  }
  
  svg {
    font-size: 1.25rem;
    color: ${(props) => (props.$active ? "#2563eb" : "#94a3b8")};
  }
`;

const BottomLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px;
  margin-top: auto;
`;

export default function Sidebar() {
  const pathname = usePathname();

  const primaryLinks = [
    { name: "Dashboard", href: "/dashboard", icon: <Dashboard /> },
    { name: "Active Inventory", href: "/inventory", icon: <DirectionsCar /> },
    { name: "Lead Pipeline", href: "/leads", icon: <PeopleAlt /> },
    { name: "Documentation", href: "/docs", icon: <Description /> },
    { name: "Market Data", href: "/market", icon: <TrendingUp /> },
  ];

  const secondaryLinks = [
    { name: "Settings", href: "/settings", icon: <Settings /> },
    { name: "Support", href: "/support", icon: <HelpOutline /> },
  ];

  return (
    <SidebarContainer>
      <NavList>
        {primaryLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <NavItem key={link.name} href={link.href} $active={isActive}>
              {link.icon}
              {link.name}
            </NavItem>
          );
        })}
      </NavList>
      <BottomLinks>
        {secondaryLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <NavItem key={link.name} href={link.href} $active={isActive}>
              {link.icon}
              {link.name}
            </NavItem>
          );
        })}
      </BottomLinks>
    </SidebarContainer>
  );
}
