import React, { memo } from "react";
import { ReactSortable } from "react-sortablejs";
import {
  Section,
  StyledLabel,
  StyledInput,
  SmallButton,
  StyledTextArea,
  ImagesContainer,
  ImagesSecondContainer,
  ImagePreview,
  StyledImage,
  UploadLabel
} from "../PostProductStyles";

const AssetsExtras = ({
  car,
  images,
  isUploading,
  handleCategoryChange,
  handleRemoveCategory,
  handleAddCategory,
  handleInputChange,
  uploadImages,
  uploadImage,
  handleRemoveImage,
  updateImagesOrder
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Extra Information Section */}
      <Section style={{ display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#0f172a', fontSize: '1.2rem', fontWeight: 800 }}>Extra Information</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {car.extra.map((option, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span style={{ color: "#64748b", fontWeight: 600, width: "30px", textAlign: 'right' }}>
                {index + 1 < 10 ? `0${index + 1}` : index + 1}.
              </span>
              <StyledInput
                type="text"
                value={option}
                onChange={(e) => handleCategoryChange("extra", index, e.target.value)}
                style={{ marginBottom: 0 }}
              />
              <SmallButton onClick={() => handleRemoveCategory("extra", index)} red>
                Remove
              </SmallButton>
            </div>
          ))}
        </div>
        <SmallButton onClick={() => handleAddCategory("extra")} style={{ marginTop: "16px", marginLeft: "42px" }}>
          + Add Extra Info
        </SmallButton>
      </Section>

      {/* Media Engine */}
      <Section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.2rem', fontWeight: 800 }}>Media Engine</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Logo Section */}
          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '0px', border: '1px solid #e2e8f0' }}>
            <StyledLabel htmlFor="logoImage" style={{ color: '#0f172a', fontSize: '1rem', marginBottom: '12px' }}>Brand / Featured Logo</StyledLabel>
            <UploadLabel background={car.logoImage} style={{ width: "100%", height: "200px" }}>
              {!car.logoImage && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: "32px", height: "32px", color: '#94a3b8' }}>
                    <path d="M16 13v4H8v-4H4l8-8 8 8h-4z"></path>
                    <line x1="12" y1="2" x2="12" y2="13"></line>
                  </svg>
                  <div style={{ marginTop: "8px", fontWeight: 600 }}>Upload Logo</div>
                </>
              )}
              <input type="file" id="logoImage" onChange={(e) => uploadImage(e, null, null, "logoImage")} style={{ display: 'none' }} />
            </UploadLabel>
          </div>

          {/* Last Page Description */}
          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '0px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            <StyledLabel htmlFor="lastPageDescription" style={{ color: '#0f172a', fontSize: '1rem', marginBottom: '12px' }}>Closing Sales Pitch</StyledLabel>
            <StyledTextArea
              id="lastPageDescription"
              value={car.lastPageDescription}
              onChange={(e) => handleInputChange(e, null, null, "lastPageDescription")}
              placeholder="Enter closing statement..."
              style={{ flex: 1 }}
            />
          </div>
        </div>

        {/* Images Gallery */}
        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '0px', border: '1px solid #e2e8f0', marginTop: '12px' }}>
          <StyledLabel style={{ color: '#0f172a', fontSize: '1rem', marginBottom: '16px' }}>Master Photo Gallery</StyledLabel>
          <ImagesSecondContainer style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <ReactSortable
              list={images || []}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}
              setList={updateImagesOrder}
              animation={200}
            >
              {images?.map((link, imgindex) => (
                <ImagePreview key={link} style={{ position: 'relative' }}>
                  <StyledImage src={link} alt="" />
                  <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                    {imgindex + 1}
                  </span>
                  <SmallButton onClick={() => handleRemoveImage(imgindex)} red style={{ marginTop: "8px", width: '100%' }}>
                    Remove
                  </SmallButton>
                </ImagePreview>
              ))}
            </ReactSortable>
            
            <UploadLabel style={{ width: "120px", height: "120px" }}>
              {isUploading ? (
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: '#3b82f6' }}>Uploading...</div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: "24px", height: "24px", color: '#94a3b8' }}>
                    <path d="M16 13v4H8v-4H4l8-8 8 8h-4z"></path>
                    <line x1="12" y1="2" x2="12" y2="13"></line>
                  </svg>
                  <div style={{ fontSize: "0.75rem", marginTop: "8px", fontWeight: 600, textAlign: 'center' }}>Add Photos</div>
                </>
              )}
              <input type="file" multiple webkitdirectory="true" directory="true" onChange={uploadImages} style={{ display: 'none' }} />
            </UploadLabel>
          </ImagesSecondContainer>
        </div>
      </Section>
    </div>
  );
};

export default memo(AssetsExtras);
