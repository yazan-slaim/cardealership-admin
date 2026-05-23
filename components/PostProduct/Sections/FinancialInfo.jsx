import React, { memo } from "react";
import {
  Section,
  InputContainer,
  StyledLabel,
  StyledInput
} from "../PostProductStyles";

const FinancialInfo = ({
  car,
  financialInformation,
  handleInputChange
}) => {
  const getNestedValue = (obj, path) => {
    if (!path) return undefined;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  return (
    <Section>
      <div style={{ gridColumn: "1 / -1", marginBottom: "8px" }}>
        <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.2rem', fontWeight: 800 }}>Unit Economics</h3>
        <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "0.85rem" }}>
          Landed Cost and Market Average are auto-calculated.
        </p>
      </div>

      {financialInformation.map((item) => (
        <InputContainer key={item.key}>
          <StyledLabel htmlFor={item.key}>{item.label}</StyledLabel>
          <div style={{ position: 'relative' }}>
            {item.type === "number" && (
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600 }}>$</span>
            )}
            <StyledInput
              type={item.type === "number" ? "number" : "text"}
              id={item.key}
              value={getNestedValue(car, item.key) !== undefined ? getNestedValue(car, item.key) : ""}
              onChange={(e) => handleInputChange(e, null, null, item.key)}
              placeholder={`Enter ${item.label}...`}
              readOnly={item.readOnly}
              style={{ 
                paddingLeft: item.type === "number" ? '28px' : '14px',
                background: item.readOnly ? '#f1f5f9' : '#fff',
                color: item.readOnly ? '#64748b' : 'inherit',
                fontWeight: item.readOnly ? 700 : 400
              }}
            />
          </div>
        </InputContainer>
      ))}
    </Section>
  );
};

export default memo(FinancialInfo);
