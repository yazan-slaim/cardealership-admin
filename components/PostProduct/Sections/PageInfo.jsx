import React, { memo } from "react";
import {
  Button,
  StyledPage,
  InputContainer,
  StyledInput,
  FloatingLabel,
  FloatingInput,
  StyledLabel,
  StyledTextArea,
  StyledBlock,
  StyledSelect,
  UploadLabel,
  StyledButton,
  ContnetTextContainer,
  MajorButton,
  SmallButton,
  Section
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
      <h3 style={{ margin: 0, color: '#0f172a' }}>Block {blockIndex + 1 < 10 ? `0${blockIndex + 1}` : blockIndex + 1}</h3>
      <SmallButton onClick={() => removeBlock(activeSubIndex, blockIndex)} red>Remove Block</SmallButton>
    </div>
    
    <div style={{ display: "flex", gap: "24px" }}>
      <div style={{ flex: "2", display: "flex", flexDirection: "column", gap: '16px' }}>
        <InputContainer style={{ marginBottom: 0 }}>
          <StyledLabel htmlFor={`blockTitle${blockIndex}`}>Block Title</StyledLabel>
          <StyledInput
            type="text"
            id={`blockTitle${blockIndex}`}
            value={block.title || ""}
            onChange={(e) => handleInputChange(e, activeSubIndex, blockIndex, "blocks", "title")}
            placeholder="Enter block title..."
          />
        </InputContainer>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <StyledLabel htmlFor={`blockDescription${blockIndex}`}>Block Description</StyledLabel>
          <StyledTextArea
            id={`blockDescription${blockIndex}`}
            value={block.description || ""}
            onChange={(e) => handleInputChange(e, activeSubIndex, blockIndex, "blocks", "description")}
            placeholder="Enter block text..."
          />
        </div>
        
        {block.enum !== undefined && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <StyledLabel htmlFor={`blockEnum${blockIndex}`}>Layout Style</StyledLabel>
            <StyledSelect
              id={`blockEnum${blockIndex}`}
              value={block.enum || ""}
              onChange={(e) => handleInputChange(e, activeSubIndex, blockIndex, "blocks", "enum")}
            >
              <option value="">Select Layout</option>
              <option value="right">Right Aligned</option>
              <option value="small-right">Small Right</option>
              <option value="center">Center</option>
              <option value="small-left">Small Left</option>
            </StyledSelect>
          </div>
        )}
      </div>

      <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        {block.image !== undefined && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: '#fff', padding: '16px', borderRadius: '0px', border: '1px solid #cbd5e1', height: '100%' }}>
            <StyledLabel style={{ marginBottom: '16px' }}>Block Cover Image</StyledLabel>
            <UploadLabel background={block.image} style={{ width: "100%", height: "200px" }}>
              {!block.image && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: "32px", height: "32px", color: '#94a3b8' }}>
                    <path d="M16 13v4H8v-4H4l8-8 8 8h-4z"></path>
                    <line x1="12" y1="2" x2="12" y2="13"></line>
                  </svg>
                  <div style={{ marginTop: "8px", fontWeight: 600 }}>Upload Image</div>
                </>
              )}
              <input type="file" onChange={(e) => uploadImage(e, activeSubIndex, blockIndex, "blocks")} style={{ display: 'none' }} />
            </UploadLabel>
          </div>
        )}
      </div>
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
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Section style={{ display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#0f172a', fontSize: '1.2rem', fontWeight: 800 }}>Marketing Pages Builder</h3>
        
        <div style={{ display: 'flex', borderBottom: "1px solid #e2e8f0" }}>
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
            <div style={{ display: "flex", gap: "24px" }}>
              <div style={{ flex: "1" }}>
                <InputContainer>
                  <StyledLabel htmlFor={`pageH2Title${activeSubIndex}`}>Hero Title</StyledLabel>
                  <StyledInput
                    type="text"
                    id={`pageH2Title${activeSubIndex}`}
                    value={page.h2Title || ""}
                    onChange={(e) => handleInputChange(e, activeSubIndex, null, "h2Title")}
                    placeholder="Enter main heading..."
                  />
                </InputContainer>
              </div>
              <div style={{ flex: "2" }}>
                <StyledLabel htmlFor={`pageIntro${activeSubIndex}`}>Hero Introduction</StyledLabel>
                <StyledTextArea
                  id={`pageIntro${activeSubIndex}`}
                  value={page.intro || ""}
                  onChange={(e) => handleInputChange(e, activeSubIndex, null, "intro")}
                  style={{ height: "100px" }}
                  placeholder="Enter introductory paragraph..."
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
              <MajorButton onClick={() => addBlock(activeSubIndex, TEXT_BLOCK)}>+ Add Text Block</MajorButton>
              <MajorButton onClick={() => addBlock(activeSubIndex, CONTENT_BLOCK)}>+ Add Image Content Block</MajorButton>
            </ContnetTextContainer>

            {page.title === "Technology" && (
              <div style={{ marginTop: "40px", padding: '24px', background: '#f8fafc', borderRadius: '0px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#0f172a' }}>Feature Carousel (Splide)</h3>
                {page.splide.map((slide, slideIndex) => (
                  <StyledBlock key={slideIndex} style={{ background: '#fff' }}>
                    <div style={{ display: 'flex', gap: '24px' }}>
                      <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <InputContainer style={{ marginBottom: 0 }}>
                          <StyledLabel htmlFor={`slideTitle${slideIndex}`}>Slide Title</StyledLabel>
                          <StyledInput
                            type="text"
                            id={`slideTitle${slideIndex}`}
                            value={slide.title || ""}
                            onChange={(e) => handleInputChange(e, activeSubIndex, slideIndex, "splide", "title")}
                            placeholder="Enter slide title..."
                          />
                        </InputContainer>
                        <InputContainer style={{ marginBottom: 0 }}>
                          <StyledLabel htmlFor={`slideDescription${slideIndex}`}>Slide Description</StyledLabel>
                          <StyledInput
                            type="text"
                            id={`slideDescription${slideIndex}`}
                            value={slide.description || ""}
                            onChange={(e) => handleInputChange(e, activeSubIndex, slideIndex, "splide", "description")}
                            placeholder="Enter description..."
                          />
                        </InputContainer>
                        <div style={{ alignSelf: 'flex-start' }}>
                          <SmallButton onClick={() => removeSplide(activeSubIndex, slideIndex)} red>Remove Slide</SmallButton>
                        </div>
                      </div>

                      <div style={{ flex: '1', display: "flex", gap: "20px", alignItems: "center", background: '#f8fafc', padding: '16px', borderRadius: '0px', border: '1px dashed #cbd5e1' }}>
                        <UploadLabel background={slide.image} style={{ width: '100px', height: '100px' }}>
                          {!slide.image && (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: "24px", height: "24px" }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                              <div style={{ fontSize: '0.75rem', marginTop: '4px', fontWeight: 600 }}>Image</div>
                            </>
                          )}
                          <input type="file" onChange={(e) => uploadImage(e, activeSubIndex, slideIndex, "splide")} style={{ display: 'none' }} />
                        </UploadLabel>
                        {slide.image && <img src={slide.image} alt="" style={{ width: "100px", height: "100px", borderRadius: "0px", objectFit: "cover", border: '1px solid #e2e8f0' }} />}
                      </div>
                    </div>
                  </StyledBlock>
                ))}
                <MajorButton 
                  onClick={() => addSplide(activeSubIndex)} 
                  style={{ height: "60px", marginTop: "20px" }}
                >
                  + Add Carousel Slide
                </MajorButton>
              </div>
            )}
          </StyledPage>
        )}
      </Section>
    </div>
  );
};

export default memo(PageInfo);
