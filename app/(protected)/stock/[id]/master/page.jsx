"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styled from "@emotion/styled";
import { Button, Chip } from "@mui/material";
import { Phone, MessageCircle, Send } from "lucide-react";

const Wrapper = styled.div`
  padding: 16px;
  background: #f5f7fa;
  color: black;
`;

/* 🔵 TOP BAR */
const TopBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: #1e3a5f;
  color: white;
  padding: 12px 16px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftTop = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 18px;
`;

const SubText = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

const StatusBadge = styled.div`
  background: #f4c542;
  color: black;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: bold;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionBtn = styled(Button)`
  background: white;
  color: #1e3a5f;
`;

/* 🧾 CONTEXT */
const ContextStrip = styled.div`
  margin-top: 10px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  flex-direction: column;
`;

/* 📦 SECTION */
const Section = styled.div`
  margin-top: 16px;
  background: white;
  border-radius: 10px;
`;

const SectionHeader = styled.div`
  background: #2f4f6f;
  color: white;
  padding: 10px;
  font-weight: bold;
  border-radius: 10px 10px 0 0;
`;

/* 🚗 VEHICLE */
const VehicleGrid = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
`;

const CarImage = styled.img`
  width: 200px;
  height: 130px;
  object-fit: cover;
  border-radius: 8px;
`;

const VehicleDetails = styled.div`
  flex: 1;
  padding: 10px;
`;

const DetailRow = styled.div`
  font-size: 14px;
  margin-top: 4px;
  border-bottom: 1px solid #eee;
  padding: 5px;
  display: flex;
  flex-direction: row;
`;
const Label = styled.span`
  color: #1e3a5f;
  font-size: large;
`;

const PriceRow = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 20px;
`;

const ProfitBadge = styled.span`
  background: #2ecc71;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: bold;
`;

/* 💰 PRICING */
const PricingGrid = styled.div`
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const Hot = styled.span`
  color: red;
  font-weight: bold;
`;
const Main = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
`;

const Left = styled.div`
  flex: 2;
`;

const Right = styled.div`
  flex: 1;
  position: sticky;
  top: 80px;
  height: fit-content;
`;

/* 🟡 MINI ACTIVITY */
const MiniActivity = styled.div`
  font-size: 13px;
  margin-bottom: 10px;
`;

/* 🔥 TABS */
const Tabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const Tab = styled.div`
  padding: 6px 12px;
  cursor: pointer;
  border-bottom: ${(p) => (p.active ? "2px solid blue" : "none")};
`;

/* 🧠 CONTENT */
const Content = styled.div`
  background: white;
  padding: 12px;
  border-radius: 8px;
`;

/* 📊 LEADS */
const LeadsTable = styled.div``;

const RowHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  font-weight: bold;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 4px;
`;

/* 🕓 TIMELINE */
const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Event = styled.div`
  font-size: 14px;
`;

/* 📁 DOCS */
const Docs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DocItem = styled.div`
  padding: 8px;
  background: #f1f1f1;
`;

/* 💰 RIGHT */
const PriceBox = styled.div`
  background: white;
  padding: 12px;
  border-radius: 8px;
`;

const Value = styled.div`
  font-weight: bold;
`;

const Profit = styled.div`
  color: green;
  margin-top: 10px;
`;

const Small = styled.div`
  font-size: 12px;
  margin-top: 6px;
`;

const RightActions = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Thirdheader = styled.h3`
  font-weight: bold;
  font-size: large;
  color: #1e3a5f;
`;
const Card = styled.div`
  background: white;
  border-radius: 8px;
  margin-top: 12px;
  overflow: hidden;
`;

const CardHeader = styled.div`
  background: #2f4f6f;
  color: white;
  padding: 8px 10px;
  font-size: 13px;
  font-weight: bold;
`;

const CardBody = styled.div`
  padding: 10px;
  * {
    color: black;
  }
`;

const AlertItem = styled.div`
  font-size: 13px;
  margin-bottom: 6px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 4px 0;
`;

const Green = styled.span`
  color: green;
  font-weight: bold;
`;
const LeadsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 10px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 6px;
`;

const FilterBtn = styled.div`
  padding: 5px 10px;
  border-radius: 6px;
  background: ${(p) => (p.active ? "#1e3a5f" : "#eee")};
  color: ${(p) => (p.active ? "white" : "black")};
  font-size: 12px;
  cursor: pointer;
`;

const LeadRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
`;

const LeadName = styled.div`
  font-weight: 500;
`;

const LeadMeta = styled.div`
  font-size: 12px;
  color: gray;
`;

const Badge = styled.span`
  background: ${(p) =>
    p.type === "hot" ? "#ff4d4f" : p.type === "warm" ? "#faad14" : "#ccc"};
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  margin-left: 6px;
`;

const LeadActions = styled.div`
  display: flex;
  gap: 6px;
`;
function Page({}) {
  const { id } = useParams();
  const [car, setCar] = React.useState(null);
  const [activeTab, setActiveTab] = useState("leads");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    console.log("Car ID from URL:", id);
    if (!id) return;

    async function fetchCar() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cars/${id}`,
        );
        const data = await response.json();
        setCar(data.car);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCar();
  }, []);
  console.log(car);

  if (!car) return <div>Loading...</div>;

  return (
    <Wrapper>
      {!car ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* 🔵 TOP BAR */}
          <TopBar>
            <LeftTop>
              <Title>
                {car.year} {car.carMake} {car.model}
              </Title>
              <SubText>Stock #{car._id.slice(-6).toUpperCase()}</SubText>
            </LeftTop>

            <StatusBadge>
              {car.NewArrival ? "New Arrival" : car.sold ? "Sold" : "Ready"}
            </StatusBadge>

            <Actions>
              <ActionBtn startIcon={<Phone />}>Call</ActionBtn>
              <ActionBtn startIcon={<MessageCircle />}>WhatsApp</ActionBtn>
              <ActionBtn startIcon={<Send />}>Send</ActionBtn>
              <ActionBtn color="success">Reserve</ActionBtn>
              <ActionBtn color="error">Mark Sold</ActionBtn>
            </Actions>
          </TopBar>

          {/* 🧾 CONTEXT STRIP */}
          <ContextStrip>
            <span>Client: Ahmad Khaled</span>
            <span>Sales Rep: You</span>
            <span>Last Contact: 2h ago</span>
            <span>Lead Score: 78</span>
          </ContextStrip>

          {/* 🚗 VEHICLE SECTION */}

          {/* 💰 PRICING / OPPORTUNITY */}
          <Section>
            <SectionHeader>PRICING & OPPORTUNITY</SectionHeader>

            <PricingGrid>
              <Row>
                <span>Days in Stock</span>
                <b>{car.daysInStock}</b>
              </Row>

              <Row>
                <span>Lead Score</span>
                <b>78</b>
              </Row>

              <Row>
                <span>Hotness</span>
                <Hot>Hot</Hot>
              </Row>

              <Row>
                <span>Condition</span>
                <b>{car.condition}</b>
              </Row>

              <Row>
                <span>Transmission</span>
                <b>{car.transmission}</b>
              </Row>

              <Row>
                <span>Mileage</span>
                <b>{car.mileage}</b>
              </Row>
            </PricingGrid>
          </Section>
        </>
      )}
      <Main>
        {/* LEFT */}
        <Left>
          {/* 🟡 MINI ACTIVITY */}
          <Section>
            <SectionHeader>VEHICLE</SectionHeader>

            <VehicleGrid>
              <CarImage src={car.images?.[0] || "/placeholder-car.jpg"} />

              <VehicleDetails>
                <DetailRow>
                  <Thirdheader>
                    {car.year} {car.carMake} {car.model} {car.trim}
                  </Thirdheader>
                </DetailRow>
                <DetailRow style={{ flexDirection: "column" }}>
                  <DetailRow>
                    <Label>VIN:</Label>{" "}
                    <Thirdheader>{car.vinNumber || "N/A"}</Thirdheader>
                  </DetailRow>
                  <DetailRow>
                    <Label>Stock #:</Label>{" "}
                    <Thirdheader>{car._id.slice(-6).toUpperCase()}</Thirdheader>
                  </DetailRow>
                </DetailRow>

                <PriceRow>
                  <span>Asking: ${car.price?.toLocaleString()}</span>
                  <span>Floor: ${(car.price * 0.9).toLocaleString()}</span>

                  <ProfitBadge>
                    Profit: ${(car.price * 0.1).toLocaleString()}
                  </ProfitBadge>
                </PriceRow>
              </VehicleDetails>
            </VehicleGrid>
          </Section>

          <MiniActivity>
            <b>Recent Activity:</b>
            <span> Ahmad viewed (2h ago)</span>
            <span> • Price updated</span>
          </MiniActivity>

          {/* 🔥 TABS */}
          <Tabs>
            <Tab
              active={activeTab === "leads"}
              onClick={() => setActiveTab("leads")}
            >
              Leads
            </Tab>
            <Tab
              active={activeTab === "activity"}
              onClick={() => setActiveTab("activity")}
            >
              Activity
            </Tab>
            <Tab
              active={activeTab === "docs"}
              onClick={() => setActiveTab("docs")}
            >
              Documents
            </Tab>
          </Tabs>

          {/* 🧠 TAB CONTENT */}
          <Content>
            {activeTab === "leads" && (
              <div>
                {/* 🔍 HEADER */}
                <LeadsHeader>
                  <SearchInput
                    placeholder="Search lead..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <FilterGroup>
                    {["all", "hot", "warm", "cold"].map((f) => (
                      <FilterBtn
                        key={f}
                        active={filter === f}
                        onClick={() => setFilter(f)}
                      >
                        {f}
                      </FilterBtn>
                    ))}
                  </FilterGroup>
                </LeadsHeader>

                {/* 📊 TABLE */}
                <LeadsTable>
                  <RowHeader>
                    <span>Name</span>
                    <span>Visits</span>
                    <span>Last Seen</span>
                    <span>Actions</span>
                  </RowHeader>

                  {[
                    { name: "Ahmad", visits: 3, last: "2h ago", type: "hot" },
                    { name: "Sarah", visits: 2, last: "1d ago", type: "warm" },
                    { name: "Omar", visits: 1, last: "3d ago", type: "cold" },
                  ]
                    .filter((lead) =>
                      lead.name.toLowerCase().includes(search.toLowerCase()),
                    )
                    .filter((lead) =>
                      filter === "all" ? true : lead.type === filter,
                    )
                    .map((lead, i) => (
                      <LeadRow key={i}>
                        {/* NAME */}
                        <div>
                          <LeadName>
                            {lead.name}
                            <Badge type={lead.type}>{lead.type}</Badge>
                          </LeadName>
                          <LeadMeta>{lead.visits} visits</LeadMeta>
                        </div>

                        {/* VISITS */}
                        <span>{lead.visits}</span>

                        {/* LAST */}
                        <span>{lead.last}</span>

                        {/* ACTIONS */}
                        <LeadActions>
                          <Button size="small" variant="contained">
                            Call
                          </Button>
                          <Button
                            size="small"
                            color="success"
                            variant="contained"
                          >
                            WA
                          </Button>
                        </LeadActions>
                      </LeadRow>
                    ))}
                </LeadsTable>
              </div>
            )}

            {activeTab === "activity" && (
              <Timeline>
                <Event>Client viewed car (2h ago)</Event>
                <Event>Price updated</Event>
                <Event>WhatsApp sent</Event>
              </Timeline>
            )}

            {activeTab === "docs" && (
              <Docs>
                <DocItem>Customs.pdf</DocItem>
                <DocItem>Inspection.pdf</DocItem>
              </Docs>
            )}
          </Content>
        </Left>

        {/* RIGHT (STICKY) */}
        <Right>
          {/* 💰 PRICING */}
          <Card>
            <CardHeader>PRICING & OPPORTUNITY</CardHeader>
            <CardBody>
              <StatRow>
                <span>Asking</span>
                <b>${car.price}</b>
              </StatRow>

              <StatRow>
                <span>Floor</span>
                <b>${Math.floor(car.price * 0.9)}</b>
              </StatRow>

              <StatRow>
                <span>Profit</span>
                <Green>${Math.floor(car.price * 0.1)}</Green>
              </StatRow>

              <StatRow>
                <span>Days in Stock</span>
                <b>{car.daysInStock}</b>
              </StatRow>
            </CardBody>
          </Card>

          {/* ⚡ QUICK ACTIONS */}
          <Card>
            <CardHeader>QUICK ACTIONS</CardHeader>
            <CardBody>
              <Button fullWidth size="small">
                Send Details
              </Button>
              <Button fullWidth size="small">
                Send Images
              </Button>
              <Button fullWidth size="small">
                Send Location
              </Button>
              <Button fullWidth size="small">
                Print Tag
              </Button>
            </CardBody>
          </Card>

          {/* 🔥 HOT LEAD ALERTS */}
          <Card>
            <CardHeader>HOT LEAD ALERTS</CardHeader>
            <CardBody>
              <AlertItem>🔥 Viewed 3 times</AlertItem>
              <AlertItem>⚠️ 30 days in stock</AlertItem>
            </CardBody>
          </Card>

          {/* 📊 QUICK STATS */}
          <Card>
            <CardHeader>QUICK STATS</CardHeader>
            <CardBody>
              <StatRow>
                <span>Views</span>
                <b>120</b>
              </StatRow>

              <StatRow>
                <span>Leads</span>
                <b>8</b>
              </StatRow>

              <StatRow>
                <span>Calls</span>
                <b>3</b>
              </StatRow>

              <StatRow>
                <span>WhatsApp</span>
                <b>5</b>
              </StatRow>
            </CardBody>
          </Card>
        </Right>
      </Main>
    </Wrapper>
  );
}

export default Page;
