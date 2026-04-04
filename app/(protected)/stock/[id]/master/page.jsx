"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styled from "@emotion/styled";
import { 
  Phone, 
  WhatsApp, 
  AutoAwesome, 
  Bolt, 
  Info, 
  FileDownload,
  DocumentScanner,
  Inventory
} from "@mui/icons-material";

// --- GLOBAL LAYOUT --- 
const PageContainer = styled.div`
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 32px;
  color: #0f172a;
`;

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// --- HEADER STRIP ---
const HeaderStrip = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  margin-bottom: 24px;
  max-width: 1400px;
  margin: 0 auto 24px auto;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const TitleCol = styled.div`
  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #0f172a;
  }
  .sub {
    font-size: 1.2rem;
    color: #475569;
    font-weight: 500;
    margin-bottom: 12px;
  }
`;

const TagsRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 600;
  
  .stock-vin {
    color: #64748b;
    background: #f1f5f9;
    padding: 4px 8px;
    border-radius: 4px;
  }
  .ready {
    background: #16a34a;
    color: white;
    padding: 4px 10px;
    border-radius: 4px;
  }
  .hot {
    background: #fee2e2;
    color: #ef4444;
    padding: 4px 10px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Btn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;

  &:hover { opacity: 0.9; }
  
  &.call { background: #f1f5f9; color: #0f172a; }
  &.whatsapp { background: #16a34a; color: white; }
  &.reserve { background: #1e3a8a; color: white; }
  &.sold { background: #0f172a; color: white; }
`;

// --- METRICS ROW ---
const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
`;

const Metric = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .val {
    font-size: 1.2rem;
    font-weight: 800;
    color: #0f172a;
  }
  .blue { color: #1e3a8a; }
  .green { color: #16a34a; }
`;

// --- GALLERY ---
const GalleryBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

const HeroImage = styled.div`
  width: 100%;
  height: 400px;
  background-color: #cbd5e1;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: 12px;
  position: relative;
`;

const WatermarkToggle = styled.div`
  position: absolute;
  top: 12px; left: 12px;
  background: white;
  color: #0f172a;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ThumbRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`;

const Thumb = styled.div`
  height: 90px;
  background-color: #f1f5f9;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  border: ${props => props.active ? '2px solid #1e3a8a' : '2px solid transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 0.7rem;
  font-weight: 600;
`;

// --- TWIN PANELS ---
const TwinPanels = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

const Panel = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);

  h3 {
    margin: 0 0 16px 0;
    font-size: 1rem;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const SpecRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.9rem;
  
  &:last-child { border: none; padding-bottom: 0; }
  
  .lbl { color: #64748b; }
  .val { font-weight: 700; color: #0f172a; }
`;

const HealthWidget = styled.div`
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;

  .icon {
    width: 40px; height: 40px;
    background: #dcfce7; color: #16a34a;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }
  .info {
    display: flex; flex-direction: column;
    .lbl { font-size: 0.75rem; color: #64748b; font-weight: 600; }
    .val { font-size: 1rem; font-weight: 800; color: #0f172a; }
  }
`;

// --- TIMELINE ---
const TimelineBox = styled(Panel)`
  margin-top: 0;
`;
const TimeItem = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  position: relative;
  
  &:last-child { margin-bottom: 0; }
  
  .dot {
    width: 32px; height: 32px;
    background: #f1f5f9;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #64748b;
    z-index: 2;
  }
  .content {
    flex: 1;
    .title { font-weight: 600; font-size: 0.95rem; color: #0f172a; margin-bottom: 4px; }
    .meta { font-size: 0.8rem; color: #64748b; }
  }
`;

// --- RIGHT COL WIDGETS ---
const AICard = styled.div`
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  border-radius: 12px;
  padding: 24px;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(30, 58, 138, 0.4);

  h3 { margin: 0 0 12px 0; font-size: 1rem; display: flex; align-items: center; gap: 8px; }
  p { font-size: 0.9rem; line-height: 1.5; color: #e0e7ff; margin: 0 0 16px 0; }
  
  .rec {
    background: rgba(255,255,255,0.1);
    padding: 12px; border-radius: 8px;
    font-size: 0.85rem; font-style: italic; margin-bottom: 16px; border-left: 3px solid #60a5fa;
  }
  
  button {
    width: 100%; background: white; color: #1e3a8a;
    border: none; padding: 12px; border-radius: 8px;
    font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
  }
`;

const LeadCard = styled(Panel)`
  .head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  h3 { margin: 0; }
  .badge { background: #dbeafe; color: #1e3a8a; font-size: 0.7rem; padding: 4px 8px; border-radius: 12px; font-weight: 700;}
`;

const LeadItem = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  display: flex; justify-content: space-between; align-items: center;
  &:last-child { border: none; padding-bottom: 0; }
  
  .info {
    .name { font-weight: 700; font-size: 0.95rem; color: #0f172a; margin-bottom: 2px;}
    .desc { font-size: 0.8rem; color: #64748b; display: flex; align-items: center; gap: 4px;}
  }
`;

const NegCard = styled(Panel)`
  background: #f8fafc;
`;
const NegRow = styled.div`
  display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 8px;
  .lbl { color: #64748b; }
  .val { font-weight: 700; color: #0f172a;}
`;

const DocCard = styled(Panel)``;
const DocRow = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px;
  .info {
    .name { font-weight: 600; font-size: 0.85rem; margin-bottom: 2px; color: #0f172a;}
    .meta { font-size: 0.7rem; color: #64748b;}
  }
  .icon { color: #64748b; cursor: pointer; }
`;


export default function MasterStockDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    if (!id) return;
    async function fetchCar() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/cars/${id}`);
        const data = await res.json();
        setCar(data.car);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCar();
  }, [id]);

  if (!car) return <div style={{ padding: 48, fontWeight: 600 }}>Loading Vehicle Intelligence...</div>;

  const floorPrice = Math.floor((car.price || 0) * 0.9);
  const profit = Math.floor((car.price || 0) * 0.1);

  return (
    <PageContainer>
      
      {/* 🔴 HEADER STRIP */}
      <HeaderStrip>
        <TitleRow>
          <TitleCol>
            <h1>{car.year} {car.carMake} {car.model}</h1>
            <div className="sub">({car.trim || "Base Trim"})</div>
            <TagsRow>
              <div className="stock-vin">Stock: #{car._id.slice(-6).toUpperCase()}</div>
              <div className="stock-vin">VIN: {car.vinNumber || "N/A"}</div>
            </TagsRow>
            <TagsRow style={{ marginTop: 12 }}>
              <div className="ready">{car.sold ? 'SOLD' : 'READY FOR SALE'}</div>
              {car.statusLevel === 'HOT' && <div className="hot">🔥 HOT</div>}
            </TagsRow>
          </TitleCol>

          <ActionsRow>
            <Btn className="call"><Phone fontSize="small"/> Call</Btn>
            <Btn className="whatsapp"><WhatsApp fontSize="small"/> WhatsApp</Btn>
            <Btn className="reserve">Reserve Vehicle</Btn>
            <Btn className="sold">Mark Sold</Btn>
          </ActionsRow>
        </TitleRow>

        <MetricsRow>
          <Metric>
            <label>Asking Price</label>
            <div className="val blue">${(car.price || 0).toLocaleString()}</div>
          </Metric>
          <Metric>
            <label>Floor Price</label>
            <div className="val">${floorPrice.toLocaleString()}</div>
          </Metric>
          <Metric>
            <label>Profit @ Ask</label>
            <div className="val green">${profit.toLocaleString()}</div>
          </Metric>
          <Metric>
            <label>Days In Stock</label>
            <div className="val">{car.daysInStock || 0} Days</div>
          </Metric>
          <Metric>
            <label>Lead Score</label>
            <div className="val">{car.leadScore || 85}/100</div>
          </Metric>
        </MetricsRow>
      </HeaderStrip>

      {/* 🔴 MAIN GRID */}
      <LayoutGrid>
        
        {/* LEFT COLUMN */}
        <LeftCol>
          
          <GalleryBox>
            <HeroImage src={car.images?.[0] || "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1200&auto=format&fit=crop"}>
              <WatermarkToggle><DocumentScanner fontSize="small"/> Watermark: ON</WatermarkToggle>
            </HeroImage>
            <ThumbRow>
              <Thumb active src={car.images?.[0] || "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b"} />
              <Thumb src={car.images?.[1] || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8"} />
              <Thumb>📸 MISSING: ENGINE</Thumb>
              <Thumb>📸 MISSING: TRUNK</Thumb>
            </ThumbRow>
          </GalleryBox>

          <TwinPanels>
            <Panel>
              <h3><Info fontSize="small"/> VIN Decoded Data</h3>
              <SpecRow><span className="lbl">Engine</span><span className="val">{car.engineSize || '3.0L'} Turbo</span></SpecRow>
              <SpecRow><span className="lbl">Drive Type</span><span className="val">{car.transmission || '4MATIC AWD'}</span></SpecRow>
              <SpecRow><span className="lbl">Mileage</span><span className="val">{car.mileage || '4,200'} km</span></SpecRow>
              <SpecRow><span className="lbl">Fuel Type</span><span className="val">{car.fuel || 'Mild Hybrid (48V)'}</span></SpecRow>
            </Panel>
            <Panel>
              <h3><AutoAwesome fontSize="small"/> Health & History</h3>
              <HealthWidget>
                <div className="icon"><Bolt /></div>
                <div className="info">
                  <span className="lbl">Battery Health</span>
                  <span className="val">98.4% (Excellent)</span>
                </div>
              </HealthWidget>
              <HealthWidget style={{ background: '#eff6ff' }}>
                <div className="icon" style={{ background: '#dbeafe', color: '#1d4ed8' }}><DocumentScanner /></div>
                <div className="info">
                  <span className="lbl">CarSeer History</span>
                  <span className="val">CLEAN REPORT</span>
                </div>
              </HealthWidget>
            </Panel>
          </TwinPanels>

          <TimelineBox>
            <h3>Activity Timeline</h3>
            <TimeItem>
              <div className="dot"><WhatsApp fontSize="small"/></div>
              <div className="content">
                <div className="title">WhatsApp sent to <span style={{color:'#1e3a8a'}}>Zaid Al-Hariri</span></div>
                <div className="meta">2 hours ago • By System Auto-Copilot</div>
              </div>
            </TimeItem>
            <TimeItem>
              <div className="dot" style={{ background: '#fee2e2', color: '#ef4444' }}><Bolt fontSize="small"/></div>
              <div className="content">
                <div className="title">Price dropped by <span style={{color:'#ef4444'}}>$200</span></div>
                <div className="meta">Yesterday • Authorized by Manager</div>
              </div>
            </TimeItem>
            <TimeItem>
              <div className="dot"><Inventory fontSize="small"/></div>
              <div className="content">
                <div className="title">Car added to Active Inventory</div>
                <div className="meta">12 days ago • By Admin</div>
              </div>
            </TimeItem>
          </TimelineBox>

        </LeftCol>

        {/* RIGHT COLUMN */}
        <RightCol>
          
          <AICard>
            <h3><AutoAwesome fontSize="small"/> AI Copilot Strategy</h3>
            <p>Zaid Al-Hariri has viewed this listing <strong>4x in 48 hours</strong> and checked the finance calculator. His session behavior suggests high emotional intent.</p>
            <div className="rec">
              "Send Zaid the 3-year extended warranty PDF. Mention it covers the mild-hybrid system specifically."
            </div>
            <button><AutoAwesome fontSize="small"/> Generate AI Reply</button>
          </AICard>

          <LeadCard>
            <div className="head">
              <h3>Qualified Leads</h3>
              <div className="badge">3 Serious Matches</div>
            </div>
            <LeadItem>
              <div className="info">
                <div className="name">Zaid Al-Hariri</div>
                <div className="desc">⚡ High Interest • Viewed 4x</div>
              </div>
              <div style={{color: '#94a3b8', cursor: 'pointer'}}>⋮</div>
            </LeadItem>
            <LeadItem>
              <div className="info">
                <div className="name">Omar F.</div>
                <div className="desc">🔋 EV Enthusiast • Finance Inquiry</div>
              </div>
              <div style={{color: '#94a3b8', cursor: 'pointer'}}>⋮</div>
            </LeadItem>
            <LeadItem>
              <div className="info">
                <div className="name">Laila Murad</div>
                <div className="desc">🔄 Trade-in Candidate</div>
              </div>
              <div style={{color: '#94a3b8', cursor: 'pointer'}}>⋮</div>
            </LeadItem>
          </LeadCard>

          <NegCard>
            <h3>Negotiation Helper</h3>
            <NegRow><span className="lbl">Landed Cost</span><span className="val">${car.landedCost || 74100}</span></NegRow>
            <NegRow><span className="lbl">Current ROI Estimate</span><span className="val">11.3%</span></NegRow>
            <div style={{ background: 'white', padding: 12, borderRadius: 8, marginTop: 16, display: 'flex', gap: 12 }}>
              <div style={{ flex: 1, background: '#f1f5f9', padding: 8, borderRadius: 6, fontWeight: 700 }}>$79,000</div>
              <div style={{ flex: 1, background: '#bbf7d0', color: '#166534', padding: 8, borderRadius: 6, fontWeight: 700, textAlign: 'center' }}>
                Profit: $4.9k
              </div>
            </div>
          </NegCard>

          <DocCard>
            <h3>Document Center</h3>
            <DocRow>
              <div className="info">
                <div className="name">Customs_Paperwork_GLE.pdf</div>
                <div className="meta">Attached via WhatsApp • 2MB</div>
              </div>
              <FileDownload className="icon" />
            </DocRow>
            <DocRow>
              <div className="info">
                <div className="name">Title_Deed_Registry.pdf</div>
                <div className="meta">Attached via Email • 1.4MB</div>
              </div>
              <FileDownload className="icon" />
            </DocRow>
            <DocRow style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
              <div className="info">
                <div className="name" style={{ color: '#ef4444' }}>Missing Customs Paper</div>
                <div className="meta" style={{ color: '#ef4444' }}>Final export cleared, original missing.</div>
              </div>
            </DocRow>
          </DocCard>

        </RightCol>

      </LayoutGrid>

    </PageContainer>
  );
}
