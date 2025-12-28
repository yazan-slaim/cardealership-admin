"use client";
import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Link from "next/link";

// Styled Components with Emotion
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const CarMakeList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CarMakeItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const EditLink = styled.a`
  padding: 5px 10px;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-right: 10px;
  text-decoration: none;

  &:hover {
    background-color: #005bb5;
  }
`;

const DeleteButton = styled.button`
  padding: 5px 10px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background-color: #d93636;
  }
`;

const NoCarMakes = styled.p`
  font-size: 18px;
  color: #666;
`;

const LoadingMessage = styled.p`
  font-size: 16px;
  color: #666;
`;

// Main Page Component
const CarMakesPage = () => {
  const [carMakes, setCarMakes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch car makes from the API
  useEffect(() => {
    const fetchCarMakes = async () => {
      try {
        const response = await fetch("/api/carmake");
        const data = await response.json();
        setCarMakes(data);
      } catch (error) {
        console.error("Error fetching car makes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarMakes();
  }, []);

  // Handle delete car make
  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this car make?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/carmake/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCarMakes(carMakes.filter((carMake) => carMake._id !== id));
      } else {
        console.error("Failed to delete car make");
      }
    } catch (error) {
      console.error("Error deleting car make:", error);
    }
  };

  return (
    <Container>
      <Title>Car Makes</Title>
      {loading ? (
        <LoadingMessage>Loading car makes...</LoadingMessage>
      ) : carMakes.length === 0 ? (
        <NoCarMakes>No car makes available.</NoCarMakes>
      ) : (
        <CarMakeList>
          {carMakes.map((carMake) => (
            <CarMakeItem key={carMake._id}>
              <span>{carMake.title}</span>
              <div>
                <Link href={`/carmake/${carMake._id}`} passHref>
                  <EditLink>Edit</EditLink>
                </Link>
                <DeleteButton onClick={() => handleDelete(carMake._id)}>
                  Delete
                </DeleteButton>
              </div>
            </CarMakeItem>
          ))}
        </CarMakeList>
      )}
    </Container>
  );
};

export default CarMakesPage;
