"use client";

import { useEffect, useState } from "react";
import styled from "@emotion/styled";

const Container = styled.div`
  background-color: black;
  color: white;
  min-height: 100vh;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
`;

const ReviewContainer = styled.div`
  border: 1px solid white;
  padding: 20px;
  margin: 10px 0;
`;

const ReviewTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const Author = styled.p`
  font-style: italic;
  margin-bottom: 10px;
`;

const Stars = styled.p`
  margin-bottom: 10px;
`;

const ReviewText = styled.p`
  margin-bottom: 10px;
`;

const DeleteButton = styled.button`
  background-color: red;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: darkred;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  background-color: grey;
  color: white;
  border: none;
  padding: 10px;
  margin: 0 5px;
  cursor: pointer;
  &:hover {
    background-color: darkgrey;
  }
  &:disabled {
    background-color: darkgray;
    cursor: not-allowed;
  }
`;

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(false);
  const reviewsPerPage = 20;

  const fetchReviews = async (page) => {
    setLoading(true);
    const res = await fetch(
      `/api/reviews?page=${page}&limit=${reviewsPerPage}`
    );
    const data = await res.json();
    setReviews(data.reviews);
    setTotalReviews(data.totalReviews);
    setLoading(false);
  };

  const deleteReview = async (id) => {
    await fetch("/api/reviews", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    setReviews(reviews.filter((review) => review._id !== id));
  };

  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  const totalPages = Math.ceil(totalReviews / reviewsPerPage);

  return (
    <Container>
      <Title>Customer Reviews</Title>
      {loading ? (
        <p>Loading...</p>
      ) : (
        reviews.map((review) => (
          <ReviewContainer key={review._id}>
            <ReviewTitle>{review.title}</ReviewTitle>
            <Author>by {review.author}</Author>
            <Stars>Rating: {review.stars} stars</Stars>
            <ReviewText>{review.review}</ReviewText>
            <DeleteButton onClick={() => deleteReview(review._id)}>
              Delete Review
            </DeleteButton>
          </ReviewContainer>
        ))
      )}

      <PaginationContainer>
        <PaginationButton
          onClick={() => setPage(page - 1)}
          disabled={page === 1 || loading}
        >
          Previous
        </PaginationButton>
        <PaginationButton
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages || loading}
        >
          Next
        </PaginationButton>
      </PaginationContainer>
    </Container>
  );
};

export default ReviewsPage;
