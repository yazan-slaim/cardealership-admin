import React, { memo } from "react";
import { ReactSortable } from "react-sortablejs";
import {
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
    <div style={{ display: "flex", flexDirection: "column", gap: "30px", padding: "30px 10px" }}>
      {/* Extra Information Section */}
      <div>
        <StyledLabel style={{ fontSize: "1.2rem", marginBottom: "15px" }}>Extra Information</StyledLabel>
        {car.extra.map((option, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              padding: "10px 0",
              gap: "15px",
              alignItems: "center",
            }}
          >
            <h1 style={{ color: "white", minWidth: "40px" }}>{`(${index + 1 < 10 ? `0${index + 1}` : index + 1})`}</h1>
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
        <SmallButton onClick={() => handleAddCategory("extra")} style={{ marginTop: "10px", background: "white", color: "black" }}>
          Add Extra Info
        </SmallButton>
      </div>

      {/* Last Page Description */}
      <div>
        <StyledLabel htmlFor="lastPageDescription">Closing Description</StyledLabel>
        <StyledTextArea
          id="lastPageDescription"
          value={car.lastPageDescription}
          onChange={(e) => handleInputChange(e, null, null, "lastPageDescription")}
          placeholder="Enter text for the last page..."
        />
      </div>

      {/* Images Gallery */}
      <ImagesContainer>
        <h1 style={{ color: "white", marginBottom: "20px" }}>Vehicle Gallery</h1>
        <ImagesSecondContainer>
          <ReactSortable
            list={images || []}
            className="flex flex-wrap gap-4"
            setList={updateImagesOrder}
            animation={200}
          >
            {images?.map((link, imgindex) => (
              <ImagePreview key={link}>
                <h1 style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{`(${imgindex + 1 < 10 ? `0${imgindex + 1}` : imgindex + 1})`}</h1>
                <StyledImage src={link} alt="" />
                <SmallButton onClick={() => handleRemoveImage(imgindex)} red style={{ marginTop: "5px" }}>
                  Remove
                </SmallButton>
              </ImagePreview>
            ))}
          </ReactSortable>
          
          <UploadLabel style={{ width: "120px", height: "120px", borderStyle: "dashed" }}>
            {isUploading ? (
              <div style={{ fontSize: "12px" }}>Uploading...</div>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: "32px", height: "32px" }}>
                  <path d="M16 13v4H8v-4H4l8-8 8 8h-4z"></path>
                  <line x1="12" y1="2" x2="12" y2="13"></line>
                </svg>
                <div style={{ fontSize: "12px", marginTop: "5px" }}>Add Gallery Image</div>
              </>
            )}
            <input type="file" multiple onChange={uploadImages} className="hidden" />
          </UploadLabel>
        </ImagesSecondContainer>
      </ImagesContainer>

      {/* Logo Section */}
      <div>
        <StyledLabel htmlFor="logoImage">Featured/Logo Image</StyledLabel>
        <UploadLabel background={car.logoImage} style={{ width: "200px", height: "150px" }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: "32px", height: "32px" }}>
            <path d="M16 13v4H8v-4H4l8-8 8 8h-4z"></path>
            <line x1="12" y1="2" x2="12" y2="13"></line>
          </svg>
          <div style={{ marginTop: "5px" }}>Set Logo</div>
          <input type="file" id="logoImage" onChange={(e) => uploadImage(e, null, null, "logoImage")} className="hidden" />
        </UploadLabel>
      </div>
    </div>
  );
};

export default memo(AssetsExtras);
