"use client";

import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 80px;
  background: transparent;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 80px;
  cursor: pointer;
  margin-bottom: 20px;
  border: 1px solid #ddd;

  &:hover {
    background-color: white;
    color: black;
  }
`;

const BackLink = styled.p`
  display: inline-block;
  margin-top: 20px;
  text-decoration: none;
  color: white;
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.p`
  color: red;
`;

const UploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 175px;
  height: 175px;
  cursor: pointer;
  border-radius: 8px;
  border: 2px dashed rgba(255, 255, 255, 0.4);
  color: white;
  margin: 10px;
  background: ${(props) =>
    props.background ? `url(${props.background})` : "rgba(0, 0, 0, 0.2)"};
  background-size: cover;
  background-position: center;
`;

const StyledLabel = styled.label`
  color: white;
  display: block;
  margin-bottom: 5px;
  min-width: 100px;
`;

const EditCarMake = ({ carMake }) => {
  const [title, setTitle] = useState(carMake?.title || "");
  const [logoURL, setLogoURL] = useState(carMake?.logoURL || "");
  const [error, setError] = useState("");
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const isEdit = !!carMake;

  useEffect(() => {
    if (carMake) {
      setTitle(carMake.title || "");
      setLogoURL(carMake.logoURL || "");
    }
  }, [carMake]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `/api/carmake/${carMake._id}` : "/api/carmake";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, logoURL }),
      });

      if (response.ok) {
        router.push("/car-makes"); // Redirect to car makes list page after success
      } else {
        const errorData = await response.json();
        setError(
          errorData.error ||
            `Failed to ${isEdit ? "update" : "create"} car make`
        );
      }
    } catch (error) {
      console.error(
        `Error ${isEdit ? "updating" : "creating"} car make:`,
        error
      );
      setError(`Failed to ${isEdit ? "update" : "create"} car make`);
    }
  };

  const uploadImage = async (ev) => {
    const file = ev.target.files[0];
    if (!file) return;

    setIsUploading(true);

    const data = new FormData();
    data.append("file", file);

    const response = await fetch("/api/uploadOneImage", {
      method: "POST",
      body: data,
    });

    if (!response.ok) {
      setIsUploading(false);
      return;
    }

    const responseData = await response.json();
    setLogoURL(responseData.link);
    setIsUploading(false);
  };

  return (
    <Container>
      <Title>{isEdit ? "Edit Car Make" : "Create a New Car Make"}</Title>

      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Car Make Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <div>
          <StyledLabel htmlFor="logoImage">Logo Image</StyledLabel>

          <UploadLabel background={logoURL}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-upload"
            >
              <path d="M16 13v4H8v-4H4l8-8 8 8h-4z"></path>
              <line x1="12" y1="2" x2="12" y2="13"></line>
            </svg>
            <div>Add Image</div>
            <input
              type="file"
              id="logoImage"
              onChange={uploadImage}
              className="hidden"
            />
          </UploadLabel>
        </div>
        <Button type="submit">
          {isEdit ? "Update Car Make" : "Create Car Make"}
        </Button>
      </form>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Link href="/carmake" passHref>
        <BackLink>Back to Car Makes</BackLink>
      </Link>
    </Container>
  );
};

export default EditCarMake;
