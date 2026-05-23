"use client";

import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";

// Premium Glassmorphic Glowing Box
const WidgetContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  padding: 24px;
  border-radius: 20px;
  background: rgba(20, 10, 40, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(138, 43, 226, 0.3);
  box-shadow: 0 8px 32px rgba(138, 43, 226, 0.15),
              inset 0 0 20px rgba(138, 43, 226, 0.05);
  overflow: hidden;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  /* The Light Reflection effect */
  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at 50% 0%,
      rgba(191, 128, 255, 0.15) 0%,
      transparent 50%
    );
    transform: rotate(30deg);
    pointer-events: none;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h3`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 500;
  margin: 0;
`;

const ViewerCount = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 12px;
  text-shadow: 0 0 20px rgba(191, 128, 255, 0.5);
`;

const PulseDot = styled(motion.div)`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #bf80ff;
  box-shadow: 0 0 10px #bf80ff, 0 0 20px #8a2be2;
`;

export default function LiveViewersWidget() {
  const params = useParams();
  const carId = params?.id;
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    if (!carId) return;

    const fetchViewers = async () => {
      try {
        const res = await fetch(`http://localhost:3002/api/leads/active/${carId}`);
        const data = await res.json();
        if (data.success) {
          setActiveCount(data.activeCount);
        }
      } catch (err) {
        console.error("Failed to fetch active viewers", err);
      }
    };

    // Initial fetch
    fetchViewers();

    // Poll every 10 seconds for real-time feel
    const interval = setInterval(fetchViewers, 10000);
    return () => clearInterval(interval);
  }, [carId]);

  return (
    <AnimatePresence>
      {activeCount > 0 && (
        <WidgetContainer
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <ContentWrapper>
            <Title>Active Shoppers Right Now</Title>
            <ViewerCount>
              <PulseDot
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {activeCount} {activeCount === 1 ? "Person" : "People"}
            </ViewerCount>
          </ContentWrapper>
        </WidgetContainer>
      )}
    </AnimatePresence>
  );
}
