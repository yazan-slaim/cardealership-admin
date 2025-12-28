"use client";
import React, { useState } from "react";
import styled from "@emotion/styled";

const Container = styled.div`
  padding: 40px;
  background-color: #f4f4f4;
  min-height: 100vh;
`;
const SmallButton = styled.button`
  max-height: 25px;
  padding: 5px 10px;
  background-color: ${(props) => (props.red ? "darkred" : "black")};
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  min-width: fit-content;
  white-space: nowrap;
  transition: all 0.3s;

  &:hover {
    background: white;
    color: black;
  }
`;

const Title = styled.h2`
  color: #0d6efd;
  text-align: center;
  margin-bottom: 32px;
`;

const CarsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: center;
`;

const CarCard = styled.div`
  width: 300px;
  background: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CarImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const CarDetails = styled.div`
  padding: 16px;
`;

const CarTitle = styled.h3`
  color: #212529;
  margin-bottom: 8px;
`;

const AddButton = styled(SmallButton)`
  background-color: #28a745;
  margin-top: 8px;

  &:hover {
    background-color: #218838;
    color: white;
  }
`;

export default function FeaturedComponent({ stock }) {
  console.log(stock);
  const [featured, setFeatured] = useState([]);

  const addToFeatured = (car) => {
    if (featured.length < 5 && !featured.some((item) => item._id === car._id)) {
      setFeatured([...featured, car]);
    }
  };

  const removeFromFeatured = (carToRemove) => {
    setFeatured(featured.filter((car) => car._id !== carToRemove._id));
  };
  async function postfeatured() {
    let response = await fetch("/api/featured", {
      method: "POST",
      body: JSON.stringify({
        featured,
      }),
    });
    let answer = await response.json();
    console.log(answer);
  }

  return (
    <Container>
      <Title>Featured Cars</Title>
      <CarsContainer>
        {featured.map((car) => (
          <CarCard key={car._id}>
            <CarImage src={car.images[0]} alt={car.title} />
            <CarDetails>
              <CarTitle>{car.title}</CarTitle>
              <SmallButton onClick={() => removeFromFeatured(car)} red={true}>
                Remove from Featured
              </SmallButton>
            </CarDetails>
          </CarCard>
        ))}
      </CarsContainer>
      <Title>All Cars</Title>
      <CarsContainer>
        {stock.map((car) => (
          <CarCard key={car._id}>
            <CarImage src={car.images[0]} alt={car.title} />
            <CarDetails>
              <CarTitle>{car.title}</CarTitle>
              <AddButton onClick={() => addToFeatured(car)}>
                Add to Featured
              </AddButton>
            </CarDetails>
          </CarCard>
        ))}
      </CarsContainer>
      <button onClick={postfeatured}>post featured array</button>
    </Container>
  );
}
