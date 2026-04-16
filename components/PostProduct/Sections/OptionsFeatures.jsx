import React, { memo } from "react";
import {
  Section,
  StyledLabel,
  StyledInput,
  SmallButton
} from "../PostProductStyles";

const OptionsFeatures = ({
  car,
  arrayParts,
  handleCategoryChange,
  handleRemoveCategory,
  handleAddCategory
}) => {
  return (
    <Section style={{ flexDirection: "column" }}>
      {arrayParts.map((partkey, index) => (
        <div key={index} style={{ width: "100%", maxWidth: "600px" }}>
          <StyledLabel style={{ fontSize: "1.2rem", marginBottom: "15px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "5px" }}>
            {partkey.charAt(0).toUpperCase() + partkey.slice(1)}
          </StyledLabel>
          {car[partkey].map((option, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px"
              }}
            >
              <h1 style={{ color: "white", minWidth: "40px" }}>{`(${
                idx + 1 < 10 ? `0${idx + 1}` : idx + 1
              })`}</h1>
              <StyledInput
                type="text"
                value={option}
                onChange={(e) =>
                  handleCategoryChange(partkey, idx, e.target.value)
                }
                style={{ marginBottom: 0 }}
              />
              <SmallButton
                onClick={() => handleRemoveCategory(partkey, idx)}
                red={true}
              >
                Remove
              </SmallButton>
            </div>
          ))}
          <SmallButton 
            onClick={() => handleAddCategory(partkey)}
            style={{ marginTop: "10px", background: "white", color: "black" }}
          >
            Add {partkey.endsWith("s") ? partkey.slice(0, -1) : partkey}
          </SmallButton>
        </div>
      ))}
    </Section>
  );
};

export default memo(OptionsFeatures);
