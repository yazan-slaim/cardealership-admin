import React, { memo } from "react";
import {
  Section,
  InputContainer,
  StyledLabel,
  StyledInput,
} from "../PostProductStyles";

const TechSpecs = ({ car, fields, handleInputChange }) => {
  return (
    <Section>
      <div style={{ gridColumn: "1 / -1", marginBottom: "8px" }}>
        <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.2rem', fontWeight: 800 }}>Technical Specifications</h3>
      </div>

      {fields.map((field, index) => (
        <InputContainer key={index}>
          <StyledLabel htmlFor={field.key}>{field.label}</StyledLabel>
          <StyledInput
            type={field.type === "number" ? "number" : "text"}
            id={field.key}
            value={car[field.key] || ""}
            onChange={(e) => handleInputChange(e, null, null, field.key)}
            placeholder={`Enter ${field.label}...`}
          />
        </InputContainer>
      ))}
    </Section>
  );
};

export default memo(TechSpecs);
