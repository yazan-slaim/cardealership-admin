import React, { memo } from "react";
import {
  Section,
  InputContainer,
  FloatingLabel,
  FloatingInput
} from "../PostProductStyles";

const FinancialInfo = ({
  financialInformation,
  handleInputChange
}) => {
  return (
    <Section>
      {financialInformation.map((item) => (
        <InputContainer key={item.key} style={{ minWidth: "45%" }}>
          <FloatingInput
            type={item.type === "number" ? "number" : "text"}
            id={item.key}
            value={item.value || ""}
            onChange={(e) => handleInputChange(e, null, null, item.key)}
            placeholder=" "
          />
          <FloatingLabel htmlFor={item.key}>{item.label}</FloatingLabel>
        </InputContainer>
      ))}
    </Section>
  );
};

export default memo(FinancialInfo);
