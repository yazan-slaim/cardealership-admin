import React, { memo } from "react";
import {
  Section,
  StyledLabel,
  StyledInput,
  SmallButton,
  StyledBlock
} from "../PostProductStyles";

const OptionsFeatures = ({
  car,
  arrayParts,
  handleCategoryChange,
  handleRemoveCategory,
  handleAddCategory
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: "0 24px" }}>
        <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.2rem', fontWeight: 800 }}>Equipment & Features</h3>
      </div>
      
      <Section style={{ display: 'flex', flexDirection: "column", gap: '32px' }}>
        {arrayParts.map((partkey, index) => (
          <div key={index} style={{ width: "100%", borderBottom: index !== arrayParts.length - 1 ? "1px solid #e2e8f0" : "none", paddingBottom: "24px" }}>
            <StyledLabel style={{ fontSize: "1rem", marginBottom: "16px", color: '#0f172a' }}>
              {partkey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </StyledLabel>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {car[partkey].map((option, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <span style={{ color: "#64748b", fontWeight: 600, width: "30px", textAlign: 'right' }}>
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}.
                  </span>
                  <StyledInput
                    type="text"
                    value={option}
                    onChange={(e) => handleCategoryChange(partkey, idx, e.target.value)}
                    style={{ marginBottom: 0 }}
                  />
                  <SmallButton onClick={() => handleRemoveCategory(partkey, idx)} red={true}>
                    Remove
                  </SmallButton>
                </div>
              ))}
            </div>

            <SmallButton 
              onClick={() => handleAddCategory(partkey)}
              style={{ marginTop: "16px", marginLeft: "42px" }}
            >
              + Add {partkey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace(/s$/, '')}
            </SmallButton>
          </div>
        ))}
      </Section>
    </div>
  );
};

export default memo(OptionsFeatures);
