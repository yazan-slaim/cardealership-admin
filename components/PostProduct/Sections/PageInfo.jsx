import React, { memo } from "react";
import {
  Button,
  StyledPage,
  InputContainer,
  FloatingLabel,
  FloatingInput,
  StyledLabel,
  StyledTextArea,
  StyledBlock,
  StyledSelect,
  UploadLabel,
  StyledButton,
  ContnetTextContainer,
  MajorButton
} from "../PostProductStyles";

const PageBlock = memo(({ 
  block, 
  blockIndex, 
  activeSubIndex, 
  handleInputChange, 
  uploadImage, 
  removeBlock 
}) => (
  <StyledBlock>
    <h1>{`(${blockIndex + 1 < 10 ? `0${blockIndex + 1}` : blockIndex + 1})`}</h1>
    <div style={{ display: "flex", padding: "20px", gap: "20px" }}>
      <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
        <InputContainer>
          <FloatingInput
            type="text"
            id={`blockTitle${blockIndex}`}
            value={block.title}
            onChange={(e) => handleInputChange(e, activeSubIndex, blockIndex, "blocks", "title")}
            placeholder=" "
          />
          <FloatingLabel htmlFor={`blockTitle${blockIndex}`}>Block Title</FloatingLabel>
        </InputContainer>
        <div>
          <StyledLabel htmlFor={`blockDescription${blockIndex}`}>Block Description</StyledLabel>
          <StyledTextArea
            id={`blockDescription${blockIndex}`}
            value={block.description}
            onChange={(e) => handleInputChange(e, activeSubIndex, blockIndex, "blocks", "description")}
          />
        </div>
        {block.enum !== undefined && (
          <StyledSelect
            id={`blockEnum${blockIndex}`}
            value={block.enum || ""}
            onChange={(e) => handleInputChange(e, activeSubIndex, blockIndex, "blocks", "enum")}
          >
            <option value="">StyledSelect</option>
            <option value="right">Right</option>
            <option value="small-right">Small Right</option>
            <option value="center">Center</option>
            <option value="small-left">Small Left</option>
          </StyledSelect>
        )}
      </div>
      <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {block.image !== undefined && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <StyledLabel>Insert Cover Image block</StyledLabel>
            <UploadLabel background={block.image || "black"}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-upload">
                <path d="M16 13v4H8v-4H4l8-8 8 8h-4z"></path>
                <line x1="12" y1="2" x2="12" y2="13"></line>
              </svg>
              <div>Add Image</div>
              <input type="file" onChange={(e) => uploadImage(e, activeSubIndex, blockIndex, "blocks")} className="hidden" />
            </UploadLabel>
          </div>
        )}
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <StyledButton onClick={() => removeBlock(activeSubIndex, blockIndex)}>Remove Block</StyledButton>
    </div>
  </StyledBlock>
));

const PageInfo = ({
  car,
  activeSubIndex,
  setActiveSubSection,
  handleInputChange,
  uploadImage,
  addBlock,
  removeBlock,
  addSplide,
  removeSplide,
  TEXT_BLOCK,
  CONTENT_BLOCK
}) => {
  const page = car.pages[activeSubIndex];

  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        {car.pages.map((p, index) => (
          <Button
            key={index}
            active={activeSubIndex === index}
            onClick={() => setActiveSubSection(index)}
          >
            {p.title}
          </Button>
        ))}
      </div>
      
      {page && (
        <StyledPage>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <InputContainer style={{ flex: "1" }}>
              <FloatingInput
                type="text"
                id={`pageH2Title${activeSubIndex}`}
                value={page.h2Title}
                onChange={(e) => handleInputChange(e, activeSubIndex, null, "h2Title")}
                placeholder=" "
              />
              <FloatingLabel htmlFor={`pageH2Title${activeSubIndex}`}>Subheading Title</FloatingLabel>
            </InputContainer>
            <div style={{ flex: "1" }}>
              <StyledLabel htmlFor={`pageIntro${activeSubIndex}`}>Page Intro</StyledLabel>
              <StyledTextArea
                id={`pageIntro${activeSubIndex}`}
                value={page.intro}
                onChange={(e) => handleInputChange(e, activeSubIndex, null, "intro")}
                style={{ height: "250px" }}
              />
            </div>
          </div>

          {page.blocks.map((block, blockIndex) => (
            <PageBlock 
              key={blockIndex}
              block={block}
              blockIndex={blockIndex}
              activeSubIndex={activeSubIndex}
              handleInputChange={handleInputChange}
              uploadImage={uploadImage}
              removeBlock={removeBlock}
            />
          ))}

          <ContnetTextContainer>
            <MajorButton onClick={() => addBlock(activeSubIndex, TEXT_BLOCK)}>Add Text Block</MajorButton>
            <MajorButton onClick={() => addBlock(activeSubIndex, CONTENT_BLOCK)}>Add Content Block</MajorButton>
          </ContnetTextContainer>

          {page.title === "Technology" && (
            <div style={{ marginTop: "40px" }}>
              <h3>Splide (Carousel)</h3>
              {page.splide.map((slide, slideIndex) => (
                <StyledBlock key={slideIndex}>
                  <InputContainer>
                    <FloatingInput
                      type="text"
                      id={`slideTitle${slideIndex}`}
                      value={slide.title}
                      onChange={(e) => handleInputChange(e, activeSubIndex, slideIndex, "splide", "title")}
                      placeholder=" "
                    />
                    <FloatingLabel htmlFor={`slideTitle${slideIndex}`}>Slide Title</FloatingLabel>
                  </InputContainer>
                  
                  <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <UploadLabel background={slide.image}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: "24px", height: "24px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      <div>Add Image</div>
                      <input type="file" onChange={(e) => uploadImage(e, activeSubIndex, slideIndex, "splide")} className="hidden" />
                    </UploadLabel>
                    {slide.image && <img src={slide.image} alt="" style={{ width: "100px", height: "100px", borderRadius: "8px", objectFit: "cover" }} />}
                  </div>

                  <InputContainer style={{ marginTop: "15px" }}>
                    <FloatingInput
                      type="text"
                      id={`slideDescription${slideIndex}`}
                      value={slide.description}
                      onChange={(e) => handleInputChange(e, activeSubIndex, slideIndex, "splide", "description")}
                      placeholder=" "
                    />
                    <FloatingLabel htmlFor={`slideDescription${slideIndex}`}>Slide Description</FloatingLabel>
                  </InputContainer>
                  
                  <SmallButton onClick={() => removeSplide(activeSubIndex, slideIndex)} red>Remove Slide</SmallButton>
                </StyledBlock>
              ))}
              <MajorButton 
                onClick={() => addSplide(activeSubIndex)} 
                style={{ height: "60px", marginTop: "20px" }}
              >
                Add Slide
              </MajorButton>
            </div>
          )}
        </StyledPage>
      )}
    </>
  );
};

export default memo(PageInfo);
