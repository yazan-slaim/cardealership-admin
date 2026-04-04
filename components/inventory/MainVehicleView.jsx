"use client";

import styled from "@emotion/styled";
import { Phone, WhatsApp } from "@mui/icons-material";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

const TagsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  background-color: ${(props) => props.$bg || "#e2e8f0"};
  color: ${(props) => props.$color || "#64748b"};
`;

const TextBadge = styled.span`
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #64748b;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: monospace;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 8px;
  border: none;
  background-color: ${(props) => props.$bg || "#ffffff"};
  color: ${(props) => props.$color || "#0f172a"};
  border: 1px solid ${(props) => props.$borderColor || "transparent"};
  
  &:hover {
    opacity: 0.9;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
  margin-bottom: 32px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 24px;
`;

const MetricBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MetricLabel = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 600;
`;

const MetricValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.$color || "#0f172a"};
`;

const GalleryPlaceholder = styled.div`
  width: 100%;
  height: 400px;
  background-color: #cbd5e1;
  border-radius: 12px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-weight: 500;
  position: relative;
`;

export default function MainVehicleView({ car }) {
  if (!car) return <div>Loading...</div>;

  return (
    <div>
      <HeaderContainer>
        <TitleSection>
          <Title>{car.year} {car.carMake} {car.model}</Title>
          <div style={{ color: "#64748b", fontSize: "1.2rem", fontWeight: 500 }}>
            ({car.trim || "Base Trim"})
          </div>
          <TagsRow style={{ marginTop: 8 }}>
            <TextBadge>Stock: #{car._id?.slice(-6).toUpperCase()}</TextBadge>
            <TextBadge>VIN: {car.vinNumber || "N/A"}</TextBadge>
          </TagsRow>
          <TagsRow style={{ marginTop: 12 }}>
            <Badge $bg="#22c55e" $color="white">{car.sold ? 'SOLD' : 'READY FOR SALE'}</Badge>
            {car.statusLevel === 'HOT' && <Badge $bg="#fee2e2" $color="#ef4444">🔥 HOT</Badge>}
          </TagsRow>
        </TitleSection>
        
        <ActionGrid>
          <Button $borderColor="#cbd5e1"><Phone fontSize="small" /> Call</Button>
          <Button $bg="#16a34a" $color="white"><WhatsApp fontSize="small" /> WhatsApp</Button>
          <Button $bg="#1e3a8a" $color="white">Reserve Vehicle</Button>
          <Button $bg="#0f172a" $color="white">Mark Sold</Button>
        </ActionGrid>
      </HeaderContainer>

      <MetricsGrid>
        <MetricBox>
          <MetricLabel>Asking Price</MetricLabel>
          <MetricValue $color="#1d4ed8">${car.price?.toLocaleString() || 0}</MetricValue>
        </MetricBox>
        <MetricBox>
          <MetricLabel>Floor Price</MetricLabel>
          <MetricValue>${Math.floor(car.price * 0.9).toLocaleString()}</MetricValue>
        </MetricBox>
        <MetricBox>
          <MetricLabel>Profit @ Ask</MetricLabel>
          <MetricValue $color="#16a34a">${Math.floor(car.price * 0.1).toLocaleString()}</MetricValue>
        </MetricBox>
        <MetricBox>
          <MetricLabel>Days In Stock</MetricLabel>
          <MetricValue>{car.daysInStock || 0} Days</MetricValue>
        </MetricBox>
        <MetricBox>
          <MetricLabel>Lead Score</MetricLabel>
          <MetricValue>{car.leadScore || 0}/100</MetricValue>
        </MetricBox>
      </MetricsGrid>

      <GalleryPlaceholder>
        {car.images?.length > 0 ? (
          <img src={car.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} alt="Car" />
        ) : (
          "Main Car Image Gallery Placeholder"
        )}
      </GalleryPlaceholder>
    </div>
  );
}
