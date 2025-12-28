'use client';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import SignOutButton from './SignOutButton';

const HeaderContainer = styled.header`
  background-color: black;
  padding: 20px;
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-grow: 1;
`;

const HeaderLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 16px;
  font-weight: bold;
  padding: 0 10px;
  &:hover { text-decoration: underline; }
`;

export default function Header() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const authed = status === 'authenticated';
  const role = session?.user?.role || 'agent';
  const myId = session?.user?.id;

  // Simple role helpers
  const canSeeAnalytics = ['admin', 'manager', 'marketing'].includes(role);
  const canPostProduct = ['admin', 'inventory'].includes(role);

  return (
    <HeaderContainer>
      {/* Always-visible public links (if any) go here */}

      {/* Show protected links only if logged in */}
      {authed && (
        <>
          <HeaderLink href="/">Home</HeaderLink>
          <HeaderLink href="/carmake">Car Make</HeaderLink>
          <HeaderLink href="/enquiries">Enquiries</HeaderLink>
          <HeaderLink href="/featuredstock">Featured Stock</HeaderLink>
          <HeaderLink href="/stock">Stock</HeaderLink>

          {canPostProduct && (
            <HeaderLink href="/stock/post-product">Post Product</HeaderLink>
          )}

          {canSeeAnalytics && (
            <HeaderLink href="/analytics">Sales Graph</HeaderLink>
          )}

          {/* Agent’s own page */}
          {myId && <HeaderLink href={`/agents/${myId}`}>My Agent Page</HeaderLink>}

          <SignOutButton redirectTo="/sign-in" />
        </>
      )}

      {/* If not logged in, show Sign In */}
      {!loading && !authed && (
        <>
          <HeaderLink href="/sign-in">Sign In</HeaderLink>
          <HeaderLink href="/sign-up">Sign Up</HeaderLink>
        </>
      )}
    </HeaderContainer>
  );
}
