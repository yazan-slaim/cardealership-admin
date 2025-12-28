"use client";
import React, { useState, useEffect } from "react";
import { ReactSortable } from "react-sortablejs";
import styled from "styled-components";

const PageContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 100px 100px;
`;
const Section = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  margin: 10px 0;
  gap: 20px;

  > div {
    flex: 1;
    min-width: 250px;
  }
`;
const Button = styled.button`
  padding: 3px 16px;
  margin: 10px 6px;
  background-color: ${(props) => (props.$active ? "white" : "transparent")};
  color: ${(props) => (props.$active ? "black" : "white")};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.4s, color 0.4s, transform 0.4s;
  font-size: small;
  font-weight: 540;

  &:hover {
    background-color: white;
    color: black;
    transform: scale(1.1);
  }
  ${(props) =>
    props.$active &&
    `
    transform: scale(1.1); 

  `}
`;
const StyledInput = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  width: 100%;
  outline: none;
`;
const StyledTextArea = styled.textarea`
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  width: 100%;
  min-height: 100px;
`;

const StyledLabel = styled.label`
  color: white;
  display: block;
  margin-bottom: 5px;
  min-width: 100px;
`;

const ImagePreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  gap: 5px;
`;

const StyledImage = styled.img`
  width: 100px;
  height: 100px;
  cursor: pointer;
  border-radius: 8px;
  object-fit: cover;
`;

const ImagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const ImagesSecondContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-around;
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

const StyledBlock = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  padding: 15px;
  margin-top: 15px;
  border-radius: 8px;
`;

const StyledPage = styled.div`
  margin-top: 25px;
  padding-top: 15px;
`;

const StyledButton = styled.button`
  color: #7e1818;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px 150px;
  margin-top: 40px;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;
const StyledSelect = styled.select`
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px top 50%;
  cursor: pointer;
  option {
    color: black;
  }
`;

const StyledCheckbox = styled.input`
  width: 20px;
  height: 20px;
  appearance: none;
  position: relative;
  cursor: pointer;
  background: ${(props) => (props.checked ? "black" : "white")};

  &::before {
    content: ${(props) => (props.checked ? '""' : "none")};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    background: white;
  }
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 15px;
  width: 100%;
`;

const FloatingLabel = styled.label`
  position: absolute;
  left: 0px;
  top: 14px;
  color: white;
  transition: all 0.3s ease;
  pointer-events: none;
`;

const FloatingInput = styled.input`
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  box-sizing: border-box;
  outline: none;

  &:focus + ${FloatingLabel}, &:not(:placeholder-shown) + ${FloatingLabel} {
    top: -14px;
    left: 0;
  }
`;
const ContnetTextContainer = styled.div`
  padding: 40px;
  display: flex;
  gap: 25px;
`;
const MajorButton = styled.button`
  flex: 1;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  height: 300px;
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

export default function PostProductPage({ product }) {
  console.log(product);
  const initialCarState = {
    title: "",
    carMake: "",
    model: "",
    trim: "",
    year: 0,
    color: "",
    bodyType: "",
    condition: "",
    mileage: "",
    fuel: "",
    transmission: "",
    carLicense: false,
    insurance: "",
    carCustoms: false,
    regionalSpecs: "",
    engineSize: 0,
    specifications: [],
    tireSize: "",
    interiorOptions: [],
    exteriorOptions: [],
    paymentMethod: "",
    price: 0,
    pricePerMonth: 0,
    vinNumber: "",
    paint: false,
    images: [],
    logoImage: "",
    pages: [
      {
        title: "Luxury",
        intro: "",
        h2Title: "",
        blocks: [],
      },
      {
        title: "Technology",
        intro: "",
        h2Title: "",
        splide: [],
        blocks: [],
      },
      {
        title: "Comfort",
        intro: "",
        h2Title: "",
        blocks: [],
      },
      {
        title: "Performance",
        intro: "",
        h2Title: "",
        blocks: [],
      },
    ],
    lastPageDescription: "",
    extra: [],
    specifications: [],
    interiorOptions: [],
    exteriorOptions: [],
  };

  const [car, setCar] = useState(initialCarState);
  const [carMakes, setCarMakes] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const mainSections = [
    { title: "Basic Information" },
    { title: "Options and Features" },
    { title: "Money Related Information" },
    { title: "Pages Information" },
    { title: "Assets & Extras" },
  ];

  const setActiveSection = (index) => {
    setActiveIndex(index);
  };

  const setActiveSubSection = (index) => {
    setActiveSubIndex(index);
  };

  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const handleInputChange = (e, pageIndex, blockIndex, field, subField) => {
    const { type, checked, value } = e.target;

    const inputValue = type === "checkbox" ? checked : value;

    setCar((prevCar) => {
      const updatedCar = { ...prevCar };

      if (pageIndex !== null) {
        const updatedPages = [...updatedCar.pages];

        if (field === "splide" && blockIndex != null) {
          const updatedSplide = [...updatedPages[pageIndex].splide];
          updatedSplide[blockIndex][subField] =
            type === "number" ? parseInt(inputValue) : inputValue;
          updatedPages[pageIndex].splide = updatedSplide;
        } else if (blockIndex != null) {
          const updatedBlocks = [...updatedPages[pageIndex].blocks];
          if (subField) {
            updatedBlocks[blockIndex][subField] =
              type === "number" ? parseInt(inputValue) : inputValue;
          } else {
            updatedBlocks[blockIndex][field] =
              type === "number" ? parseInt(inputValue) : inputValue;
          }
          updatedPages[pageIndex].blocks = updatedBlocks;
        } else {
          updatedPages[pageIndex][field] =
            type === "number" ? parseInt(inputValue) : inputValue;
        }

        updatedCar.pages = updatedPages;
      } else {
        updatedCar[field] =
          type === "number" ? parseInt(inputValue) : inputValue;
      }

      return updatedCar;
    });
  };

  const TEXT_BLOCK = "text";
  const CONTENT_BLOCK = "content";

  const addBlock = (pageIndex, type) => {
    const updatedPages = [...car.pages];
    const newBlock = {
      title: "",
      description: "",
      ...(type === CONTENT_BLOCK && { enum: "center", image: "" }),
    };

    updatedPages[pageIndex].blocks.push(newBlock);
    setCar((prevData) => ({
      ...prevData,
      pages: updatedPages,
    }));
  };

  const removeBlock = (pageIndex, blockIndex) => {
    console.log(pageIndex);
    console.log(blockIndex);

    const updatedPages = [...car.pages];
    updatedPages[pageIndex].blocks.splice(blockIndex, 1);
    setCar((prevData) => ({
      ...prevData,
      pages: updatedPages,
    }));
  };

  useEffect(() => {
    // Fetch car makes from the API when the component mounts
    async function fetchCarMakes() {
      try {
        const response = await fetch("/api/carmake");
        const data = await response.json();
        setCarMakes(data); // Store the car makes in the state
      } catch (error) {
        console.error("Failed to fetch car makes", error);
      }
    }
    fetchCarMakes();
  }, []);
  const addSplide = (pageIndex) => {
    const updatedPages = [...car.pages];
    updatedPages[pageIndex].splide.push({
      title: "",
      image: "",
      description: "",
    });
    setCar((prevData) => ({
      ...prevData,
      pages: updatedPages,
    }));
  };

  const removeSplide = (pageIndex, splideIndex) => {
    const updatedPages = [...car.pages];
    updatedPages[pageIndex].splide.splice(splideIndex, 1);
    setCar((prevData) => ({
      ...prevData,
      pages: updatedPages,
    }));
  };

  const handleAddCategory = (partkey) => {
    setCar((prevData) => ({
      ...prevData,
      [partkey]: [...prevData[partkey], ""],
    }));
  };

  const handleCategoryChange = (partkey, index, value) => {
    setCar((prevData) => ({
      ...prevData,
      [partkey]: prevData[partkey].map((option, i) =>
        i === index ? value : option
      ),
    }));
  };

  useEffect(() => {
    if (product) {
      const filteredProduct = Object.keys(product).reduce((acc, key) => {
        if (!["_id", "__v", "createdAt", "updatedAt"].includes(key)) {
          acc[key] = product[key];
        }
        return acc;
      }, {});

      // Assuming `product.pages` is an object and needs to be converted to an array
      const pagesArray = Object.keys(filteredProduct.pages || {}).map(
        (key) => ({
          ...filteredProduct.pages[key],
          title: key,
        })
      );

      setCar({ ...filteredProduct, pages: pagesArray });
    }
  }, [product]);

  const handleRemoveCategory = (partkey, index) => {
    setCar((prevData) => {
      const updatedOptions = [...prevData[partkey]];
      updatedOptions.splice(index, 1);
      return {
        ...prevData,
        [partkey]: updatedOptions,
      };
    });
  };

  const arrayParts = Object.keys(car).filter(
    (key) =>
      Array.isArray(car[key]) &&
      key !== "pages" &&
      key !== "images" &&
      key !== "extra"
  );
  const stringParts = Object.keys(car).filter(
    (key) =>
      typeof car[key] === "string" &&
      key !== "logoImage" &&
      key !== "paymentMethod" &&
      key !== "insurance" &&
      key !== "lastPageDescription" &&
      key !== "carMake"
  );

  const numberParts = Object.keys(car).filter(
    (key) =>
      typeof car[key] === "number" && key !== "price" && key !== "pricePerMonth"
  );
  const booleanParts = Object.keys(car).filter(
    (key) => typeof car[key] === "boolean"
  );
  const financialInformation = [
    { key: "price", value: car.price, label: "Price", type: "number" },
    {
      key: "pricePerMonth",
      value: car.pricePerMonth,
      label: "Price per Month",
      type: "number",
    },
    {
      key: "insurance",
      value: car.insurance,
      label: "Insurance",
      type: "string",
    },
    {
      key: "paymentMethod",
      value: car.paymentMethod,
      label: "Payment Method",
      type: "string",
    },
  ];

  function updateImagesOrder(newImages) {
    setImages(newImages);
  }

  const handleInputChangeImage = (
    e,
    pageIndex,
    blockIndex,
    field,
    subField
  ) => {
    setCar((prevCar) => {
      const updatedCar = { ...prevCar };
      if (pageIndex !== null && blockIndex !== null) {
        if (subField) {
          updatedCar.pages[pageIndex][field][blockIndex][subField] = e;
        } else {
          updatedCar.pages[pageIndex][field][blockIndex] = e;
        }
      } else {
        updatedCar[field] = e;
      }
      return updatedCar;
    });
  };
  async function uploadImage(ev, pageIndex, blockIndex, fieldname) {
    const file = ev.target.files[0];
    if (!file) {
      return;
    }
    setIsUploading(true);

    const data = new FormData();
    data.append("file", file);

    const response = await fetch("/api/uploadOneImage", {
      method: "POST",
      body: data,
    });

    if (!response.ok) {
      // Handle upload error
      setIsUploading(false);
      return;
    }

    const responseData = await response.json();

    if (fieldname === "logoImage") {
      setCar((prevCar) => ({ ...prevCar, logoImage: responseData.link }));
    } else {
      handleInputChangeImage(
        responseData.link,
        pageIndex,
        blockIndex,
        fieldname,
        "image"
      );
    }

    setIsUploading(false);
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }

      const response = await fetch("/api/uploadMultipleImages", {
        method: "POST",
        body: data,
      });

      const responseData = await response.json();
      console.log(responseData);

      setImages((oldImages) => {
        return [...oldImages, ...responseData.links];
      });

      setIsUploading(false);
    }
  }
  useEffect(() => {
    setCar((prevFormData) => ({
      ...prevFormData,
      images: images,
    }));
  }, [images]);
  const handleRemoveImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };
  async function postProduct() {
    if (product) {
      try {
        let response = await fetch("/api/post-car", {
          method: "POST",
          body: JSON.stringify({
            id: product._id,
            car,
          }),
        });

        let answer = await response.json();
        console.log(answer);
      } catch (error) {
        console.error("Error posting product:", error);
      }
    } else {
      try {
        let response = await fetch("/api/post-car", {
          method: "POST",
          body: JSON.stringify({
            car,
          }),
        });

        let answer = await response.json();
        console.log(answer);
      } catch (error) {
        console.error("Error posting product:", error);
      }
    }
  }
  const renderSubSection = () => {
    const page = car.pages[activeSubIndex];
    return (
      <StyledPage key={activeSubIndex}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <InputContainer style={{ flex: "1" }}>
            <FloatingInput
              type="text"
              id={`pageH2Title${activeSubIndex}`}
              value={page.h2Title}
              onChange={(e) =>
                handleInputChange(e, activeSubIndex, null, "h2Title")
              }
              placeholder=""
            />
            <FloatingLabel htmlFor={`pageH2Title${activeSubIndex}`}>
              Subheading Title
            </FloatingLabel>
          </InputContainer>
          <div style={{ flex: "1" }}>
            <StyledLabel htmlFor={`pageIntro${activeSubIndex}`}>
              Page Intro
            </StyledLabel>
            <StyledTextArea
              type="text"
              id={`pageIntro${activeSubIndex}`}
              value={page.intro}
              onChange={(e) =>
                handleInputChange(e, activeSubIndex, null, "intro")
              }
              style={{ height: "250px" }}
            />
          </div>
        </div>
        {page.blocks.map((block, blockIndex) => (
          <StyledBlock key={blockIndex}>
            <h1>{`(${
              blockIndex + 1 < 10 ? `0${blockIndex + 1}` : blockIndex + 1
            })`}</h1>
            <div style={{ display: "flex", padding: "20px", gap: "20px" }}>
              <div
                style={{ flex: "1", display: "flex", flexDirection: "column" }}
              >
                <InputContainer>
                  <FloatingInput
                    type="text"
                    id={`blockTitle${blockIndex}`}
                    value={block.title}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        activeSubIndex,
                        blockIndex,
                        "blocks",
                        "title"
                      )
                    }
                    placeholder=""
                  />
                  <FloatingLabel htmlFor={`blockTitle${blockIndex}`}>
                    Block Title
                  </FloatingLabel>
                </InputContainer>
                <div>
                  <StyledLabel htmlFor={`blockDescription${blockIndex}`}>
                    Block Description
                  </StyledLabel>
                  <StyledTextArea
                    id={`blockDescription${blockIndex}`}
                    value={block.description}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        activeSubIndex,
                        blockIndex,
                        "blocks",
                        "description"
                      )
                    }
                  />
                </div>
                {block.enum !== undefined && (
                  <StyledSelect
                    id={`blockEnum${blockIndex}`}
                    value={block.enum || ""}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        activeSubIndex,
                        blockIndex,
                        "blocks",
                        "enum"
                      )
                    }
                  >
                    <option value="">StyledSelect</option>
                    <option value="right">Right</option>
                    <option value="small-right">Small Right</option>
                    <option value="center">Center</option>
                    <option value="small-left">Small Left</option>
                  </StyledSelect>
                )}
              </div>
              <div
                style={{
                  flex: "1",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {block.image !== undefined && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <StyledLabel>Insert Cover Image block</StyledLabel>
                    <UploadLabel background={block.image || "black"}>
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
                        onChange={(e) =>
                          uploadImage(e, activeSubIndex, blockIndex, "blocks")
                        }
                        className="hidden"
                      />
                    </UploadLabel>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <StyledButton
                onClick={() => removeBlock(activeSubIndex, blockIndex)}
              >
                Remove Block
              </StyledButton>
            </div>
          </StyledBlock>
        ))}
        <ContnetTextContainer>
          {" "}
          <MajorButton onClick={() => addBlock(activeSubIndex, TEXT_BLOCK)}>
            Add Text Block
          </MajorButton>
          <MajorButton onClick={() => addBlock(activeSubIndex, CONTENT_BLOCK)}>
            Add Content Block
          </MajorButton>
        </ContnetTextContainer>

        {page.title === "Technology" && (
          <>
            <h3>Splide</h3>
            {page.splide.map((slide, slideIndex) => (
              <StyledBlock key={slideIndex}>
                <div>
                  <StyledLabel htmlFor={`slideTitle${slideIndex}`}>
                    Slide Title
                  </StyledLabel>
                  <StyledInput
                    type="text"
                    id={`slideTitle${slideIndex}`}
                    value={slide.title}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        activeSubIndex,
                        slideIndex,
                        "splide",
                        "title"
                      )
                    }
                  />
                </div>
                <div>
                  <UploadLabel>
                    <h1>Insert Cover Image</h1>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    <input
                      type="file"
                      onChange={(e) =>
                        uploadImage(e, activeSubIndex, slideIndex, "splide")
                      }
                      className="hidden"
                    />
                    {slide.image && (
                      <div>
                        <img
                          src={slide.image}
                          alt={`Block ${slideIndex}`}
                          style={{ width: "100px", height: "100px" }}
                        />
                      </div>
                    )}
                  </UploadLabel>
                </div>
                <div>
                  <StyledLabel htmlFor={`slideDescription${slideIndex}`}>
                    Slide Description
                  </StyledLabel>
                  <StyledInput
                    type="text"
                    id={`slideDescription${slideIndex}`}
                    value={slide.description}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        activeSubIndex,
                        slideIndex,
                        "splide",
                        "description"
                      )
                    }
                  />
                </div>
                <button
                  onClick={() => removeSplide(activeSubIndex, slideIndex)}
                >
                  Remove Slide
                </button>
              </StyledBlock>
            ))}
            <button onClick={() => addSplide(activeSubIndex)}>Add Slide</button>
          </>
        )}
      </StyledPage>
    );
  };

  const renderSection = () => {
    const section = mainSections[activeIndex];
    switch (activeIndex) {
      case 0:
        return (
          <Section>
            {stringParts.map((partkey, index) => (
              <InputContainer key={index}>
                <FloatingInput
                  type="text"
                  id={partkey}
                  placeholder=" "
                  value={car[partkey]}
                  onChange={(e) => handleInputChange(e, null, null, partkey)}
                />
                <FloatingLabel htmlFor={partkey}>
                  {partkey.charAt(0).toUpperCase() + partkey.slice(1)}
                </FloatingLabel>
              </InputContainer>
            ))}
            <InputContainer>
              <StyledLabel htmlFor="carMake">Car Make</StyledLabel>
              <StyledSelect
                id="carMake"
                value={car.carMake}
                onChange={(e) => handleInputChange(e, null, null, "carMake")}
              >
                <option value="">Select Car Make</option>
                {carMakes.map((make) => (
                  <option key={make._id} value={make.title}>
                    {make.title}
                  </option>
                ))}
              </StyledSelect>
            </InputContainer>
            {numberParts.map((partkey, index) => (
              <InputContainer key={index}>
                <FloatingInput
                  type="number"
                  id={partkey}
                  value={car[partkey]}
                  onChange={(e) => handleInputChange(e, null, null, partkey)}
                />
                <FloatingLabel htmlFor={partkey}>
                  {partkey.charAt(0).toUpperCase() + partkey.slice(1)}
                </FloatingLabel>
              </InputContainer>
            ))}
            {booleanParts.map((partkey, index) => (
              <div key={index} style={{ display: "flex", gap: "10px" }}>
                <StyledLabel htmlFor={partkey}>
                  {partkey.charAt(0).toUpperCase() + partkey.slice(1)}
                </StyledLabel>
                <StyledCheckbox
                  id={partkey}
                  checked={car[partkey]}
                  onChange={(e) => handleInputChange(e, null, null, partkey)}
                  type="checkbox"
                />
              </div>
            ))}
          </Section>
        );
      case 1:
        return (
          <Section style={{ flexDirection: "column" }}>
            {arrayParts.map((partkey, index) => (
              <div key={index} style={{ width: "500px" }}>
                <StyledLabel>
                  {partkey.charAt(0).toUpperCase() + partkey.slice(1)}
                </StyledLabel>
                {car[partkey].map((option, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                  >
                    <h1>{`(${
                      index + 1 < 10 ? `0${index + 1}` : index + 1
                    })`}</h1>
                    <StyledInput
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleCategoryChange(partkey, index, e.target.value)
                      }
                    />
                    <SmallButton
                      onClick={() => handleRemoveCategory(partkey, index)}
                      red={true}
                    >
                      Remove{" "}
                      {partkey.endsWith("s") ? partkey.slice(0, -1) : partkey}
                    </SmallButton>
                  </div>
                ))}
                <SmallButton onClick={() => handleAddCategory(partkey)}>
                  Add Category
                </SmallButton>
              </div>
            ))}
          </Section>
        );
      case 2:
        return (
          <Section>
            {financialInformation.map((item) => (
              <InputContainer key={item.key} style={{ minWidth: "500px" }}>
                <FloatingInput
                  type={item.type === "number" ? "number" : "text"}
                  id={item.key}
                  value={item.value}
                  onChange={(e) => handleInputChange(e, null, null, item.key)}
                  placeholder=""
                />
                <FloatingLabel htmlFor={item.key}>{item.label}</FloatingLabel>
              </InputContainer>
            ))}
          </Section>
        );
      case 3:
        return (
          <>
            <div>
              {car.pages.map((page, index) => (
                <Button
                  key={index}
                  $active={activeSubIndex === index}
                  onClick={() => setActiveSubSection(index)}
                >
                  {page.title}
                </Button>
              ))}
            </div>
            <div>{renderSubSection()}</div>
          </>
        );
      case 4:
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "30px",
              padding: "30px 10px",
            }}
          >
            <div>
              <StyledLabel>{"extra"}</StyledLabel>
              {car.extra.map((option, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    padding: "0px 20px",
                    gap: "20px",
                    alignItems: "center",
                  }}
                >
                  <h1>{`(${index + 1 < 10 ? `0${index + 1}` : index + 1})`}</h1>

                  <StyledInput
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleCategoryChange("extra", index, e.target.value)
                    }
                  />
                  <SmallButton
                    onClick={() => handleRemoveCategory("extra", index)}
                    red={true}
                  >
                    Remove info
                  </SmallButton>
                </div>
              ))}

              <SmallButton onClick={() => handleAddCategory("extra")}>
                Add info
              </SmallButton>
            </div>
            <div>
              <StyledLabel htmlFor={"lastPageDescription"}>
                {"lastPageDescription".charAt(0).toUpperCase() +
                  "lastPageDescription".slice(1)}
              </StyledLabel>
              <StyledTextArea
                id={"lastPageDescription"}
                value={car.lastPageDescription}
                onChange={(e) =>
                  handleInputChange(e, null, null, "lastPageDescription")
                }
              />
            </div>
            <ImagesContainer>
              <h1>images Container</h1>
              <ImagesSecondContainer>
                <ReactSortable
                  list={images}
                  className="flex flex-wrap gap-1"
                  setList={updateImagesOrder}
                >
                  {!!images?.length &&
                    images.map((link, imgindex) => (
                      <ImagePreview key={link}>
                        <h1>{`(${
                          imgindex + 1 < 10 ? `0${imgindex + 1}` : imgindex + 1
                        })`}</h1>
                        <StyledImage src={link} alt="" />
                        <SmallButton
                          onClick={() => handleRemoveImage(imgindex)}
                          red={true}
                        >
                          Remove
                        </SmallButton>
                      </ImagePreview>
                    ))}
                </ReactSortable>
                {isUploading && <ImagePreview>...loading</ImagePreview>}
                <UploadLabel style={{ width: "100px", height: "100px" }}>
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
                    onChange={uploadImages}
                    className="hidden"
                  />
                </UploadLabel>
              </ImagesSecondContainer>
            </ImagesContainer>

            <div>
              <StyledLabel htmlFor="logoImage">Logo Image</StyledLabel>

              <UploadLabel background={car.logoImage}>
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
                  onChange={(e) => uploadImage(e, null, null, "logoImage")}
                  className="hidden"
                />{" "}
              </UploadLabel>
            </div>
          </div>
        );
      default:
        return (
          <Section>
            <h2>{section.title}</h2>
          </Section>
        );
    }
  };

  return (
    <PageContainer>
      <h2>Car Details</h2>

      <div>
        {mainSections.map((section, index) => (
          <Button
            key={index}
            $active={activeIndex === index}
            onClick={() => setActiveSection(index)}
          >
            {section.title}
          </Button>
        ))}
      </div>
      <div>{renderSection()}</div>
      <Button onClick={postProduct}>SUBMIT CHANGES</Button>
    </PageContainer>
  );
}
