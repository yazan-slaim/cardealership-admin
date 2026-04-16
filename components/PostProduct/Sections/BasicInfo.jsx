import React, { memo } from "react";
import VinScanner from "../../VinScanner";
import CarSeerUpload from "../CarSeerUpload";
import {
  Section,
  InputContainer,
  FloatingLabel,
  FloatingInput,
  SmallButton,
  StyledLabel,
  StyledSelect,
  StyledCheckbox
} from "../PostProductStyles";

const BasicInfo = ({
  car,
  carMakes,
  isLoadingVin,
  showScanner,
  stringParts,
  numberParts,
  booleanParts,
  handleInputChange,
  fetchVinDetails,
  setShowScanner,
  handleCarSeerData
}) => {
  return (
    <Section>
      {stringParts.map((partkey, index) => (
        <InputContainer key={index}>
          <FloatingInput
            type="text"
            id={partkey}
            value={car[partkey]}
            onChange={(e) => handleInputChange(e, null, null, partkey)}
            placeholder=" "
          />
          <FloatingLabel htmlFor={partkey}>
            {partkey.charAt(0).toUpperCase() + partkey.slice(1)}
          </FloatingLabel>
          {partkey === "vinNumber" && (
            <div
              style={{
                position: "absolute",
                right: "0",
                top: "0",
                display: "flex",
                gap: "5px",
              }}
            >
              <SmallButton
                type="button"
                onClick={() => fetchVinDetails()}
                disabled={isLoadingVin}
              >
                {isLoadingVin ? "Fetching..." : "Fetch Details"}
              </SmallButton>
              <SmallButton
                type="button"
                onClick={() => setShowScanner(true)}
              >
                Scan
              </SmallButton>
            </div>
          )}
        </InputContainer>
      ))}

      {showScanner && (
        <VinScanner
          onScan={(vin) => fetchVinDetails(vin)}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* CarSeer Document OCR Pipeline */}
      <CarSeerUpload onParsedData={handleCarSeerData} />

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
            placeholder=" "
          />
          <FloatingLabel htmlFor={partkey}>
            {partkey.charAt(0).toUpperCase() + partkey.slice(1)}
          </FloatingLabel>
        </InputContainer>
      ))}

      {booleanParts.map((partkey, index) => (
        <div key={index} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <StyledLabel htmlFor={partkey} style={{ marginBottom: 0 }}>
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
};

export default memo(BasicInfo);
