import styled from "@emotion/styled";

export const PageContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 100px 100px;
  background: black;
`;

export const Section = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  margin: 10px 0;
  gap: 20px;

  > div {
    flex: 1;
    min-width: 250px;
  }
`;

export const Button = styled.button`
  padding: 3px 16px;
  margin: 10px 6px;
  background-color: ${(props) => (props.active ? "white" : "transparent")};
  color: ${(props) => (props.active ? "black" : "white")};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  cursor: pointer;
  transition:
    background-color 0.4s,
    color 0.4s,
    transform 0.4s;
  font-size: small;
  font-weight: 540;

  &:hover {
    background-color: white;
    color: black;
    transform: scale(1.1);
  }
  ${(props) =>
    props.active &&
    `
    transform: scale(1.1); 
  `}
`;

export const StyledInput = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  width: 100%;
  outline: none;
`;

export const StyledTextArea = styled.textarea`
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  width: 100%;
  min-height: 100px;
`;

export const StyledLabel = styled.label`
  color: white;
  display: block;
  margin-bottom: 5px;
  min-width: 100px;
`;

export const ImagePreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  gap: 5px;
`;

export const StyledImage = styled.img`
  width: 100px;
  height: 100px;
  cursor: pointer;
  border-radius: 8px;
  object-fit: cover;
`;

export const ImagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

export const ImagesSecondContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-around;
`;

export const UploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 175px;
  height: 175px;
  cursor: pointer;
  border-radius: 8px;
  border: 2px dashed rgba(255, 255, 255, 0.4);
  color: white;
  margin: 10px;
  background: ${(props) =>
    props.background ? `url(${props.background})` : "rgba(0, 0, 0, 0.2)"};
  background-size: cover;
  background-position: center;
`;

export const StyledBlock = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  padding: 15px;
  margin-top: 15px;
  border-radius: 8px;
`;

export const StyledPage = styled.div`
  margin-top: 25px;
  padding-top: 15px;
`;

export const StyledButton = styled.button`
  color: #7e1818;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px 150px;
  margin-top: 40px;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const StyledSelect = styled.select`
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px top 50%;
  cursor: pointer;
  option {
    color: black;
  }
`;

export const StyledCheckbox = styled.input`
  width: 20px;
  height: 20px;
  appearance: none;
  position: relative;
  cursor: pointer;
  background: ${(props) => (props.checked ? "black" : "white")};

  &::before {
    content: ${(props) => (props.checked ? '""' : "none")};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    background: white;
  }
`;

export const InputContainer = styled.div`
  position: relative;
  margin-bottom: 15px;
  width: 100%;
`;

export const FloatingLabel = styled.label`
  position: absolute;
  left: 0px;
  top: 14px;
  color: white;
  transition: all 0.3s ease;
  pointer-events: none;
`;

export const FloatingInput = styled.input`
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  box-sizing: border-box;
  outline: none;

  &:focus + label, &:not(:placeholder-shown) + label {
    top: -14px;
    left: 0;
  }
`;

export const ContnetTextContainer = styled.div`
  padding: 40px;
  display: flex;
  gap: 25px;
`;

export const MajorButton = styled.button`
  flex: 1;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  height: 300px;
`;

export const SmallButton = styled.button`
  max-height: 25px;
  padding: 5px 10px;
  background-color: ${(props) => (props.red ? "darkred" : "black")};
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  min-width: fit-content;
  white-space: nowrap;
  transition: all 0.3s;

  &:hover {
    background: white;
    color: black;
  }
`;
