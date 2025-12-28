'use client';

import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #0f0f0f;
  color: white;
  font-family: 'Inter', sans-serif;
  padding: 2rem;
  gap: 2rem;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatsBox = styled.div`
  background: #1a1a1a;
  border: 1px solid #ff7f11;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 0 8px rgba(255, 127, 17, 0.3);
  flex: 1;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 2rem;
`;

const Row = styled.div`
  display: flex;
  gap: 2rem;
`;

const Highlight = styled.span`
  color: #ff7f11;
  font-weight: bold;
`;

const Progress = styled.div`
  background: #333;
  border-radius: 10px;
  overflow: hidden;
  height: 10px;
  margin-top: 0.5rem;
`;

const ProgressBar = styled.div`
  background: #ff7f11;
  width: ${props => props.width || '0%'};
  height: 100%;
`;

export default function SalesAgentDashboard() {
      async function fetchCar() {
      try {
        const response = await fetch(`/api/Car/fetchCar?id=${id}`);
        const data = await response.json();
    
        if (data.success) {
          console.log('Featured status:', data.fetchedCar);
          setCar(data.fetchedCar); 
          setNewPrice(data.fetchedCar.price)
          console.log(car) // You can now access the featured status
        } else {
          console.error('Error:', data.message);
        }
      } catch (error) {
        console.error('Error fetching featured status:', error);
      }
    }
  return (
    <Container>
      <Header>
        <div>
          <h1><Highlight>815</Highlight> Points</h1>
          <p>Quota Conqueror — <Highlight>Silver</Highlight> Tier</p>
        </div>
        <div>
          <h2><Highlight>Great Job!</Highlight></h2>
          <p>Target 100%</p>
        </div>
      </Header>

      <Row>
        <StatsBox>
          <h3>Total Sales</h3>
          <h1><Highlight>$14,211.09</Highlight></h1>
          <p>↑ 14% from last period</p>
        </StatsBox>

        <StatsBox>
          <h3>Total Revenue</h3>
          <h1><Highlight>$321,411.09</Highlight></h1>
          <p>Line chart placeholder</p>
        </StatsBox>
      </Row>

      <Grid>
        <StatsBox>
          <h3><Highlight>Samantha L</Highlight> — Manager Sales</h3>
          <p>Tasks: 40%</p>
          <Progress>
            <ProgressBar width="40%" />
          </Progress>
          <p>Completed Work: 94%</p>
          <Progress>
            <ProgressBar width="94%" />
          </Progress>
        </StatsBox>

        <StatsBox>
          <h3>Total Orders</h3>
          <h1><Highlight>32,112</Highlight></h1>
          <p>↑ 14%</p>
          <p>Pie chart placeholder (Direct, Organic, Referral)</p>
        </StatsBox>
      </Grid>
    </Container>
  );
}
