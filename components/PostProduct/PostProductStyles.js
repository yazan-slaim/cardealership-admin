import styled from "@emotion/styled";

export const PageContainer = styled.div`
  font-family: 'Outfit', 'Inter', sans-serif;
  padding: 40px;
  background: #f8fafc;
  color: #0f172a;
  min-height: 100vh;
`;

export const Section = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  padding: 32px;
  background: white;
  border-radius: 0px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
`;

export const Button = styled.button`
  padding: 12px 24px;
  margin-right: 8px;
  background-color: ${(props) => (props.active ? "#0f172a" : "transparent")};
  color: ${(props) => (props.active ? "#fff" : "#475569")};
  border: 1px solid ${(props) => (props.active ? "#0f172a" : "#cbd5e1")};
  border-radius: 0px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-size: 0.95rem;
  font-weight: 700;

  &:hover {
    color: ${(props) => (props.active ? "#fff" : "#0f172a")};
    background: ${(props) => (props.active ? "#0f172a" : "#f1f5f9")};
  }
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 14px;
  border: 1px solid #cbd5e1;
  background-color: #fff;
  color: #0f172a;
  outline: none;
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.2s;
  border-radius: 0px;

  &:focus {
    border-color: #0f172a;
    box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.1);
  }
`;

export const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 14px;
  border: 1px solid #cbd5e1;
  border-radius: 0px;
  background-color: #fff;
  color: #0f172a;
  outline: none;
  font-family: inherit;
  font-size: 0.95rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    border-color: #0f172a;
    box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.1);
  }
`;

export const StyledLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const ImagePreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const StyledImage = styled.img`
  width: 120px;
  height: 120px;
  cursor: pointer;
  border-radius: 0px;
  object-fit: cover;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }
`;

export const ImagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  background: #f8fafc;
  padding: 24px;
  border-radius: 0px;
  border: 1px solid #e2e8f0;
`;

export const ImagesSecondContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-start;
  margin-top: 16px;
`;

export const UploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 160px;
  cursor: pointer;
  border-radius: 0px;
  border: 2px dashed #cbd5e1;
  color: #64748b;
  background: ${(props) =>
    props.background ? `url(${props.background})` : "#f8fafc"};
  background-size: cover;
  background-position: center;
  transition: all 0.2s;

  &:hover {
    border-color: #0f172a;
    background-color: #f1f5f9;
    color: #0f172a;
  }
`;

export const StyledBlock = styled.div`
  background-color: #f8fafc;
  padding: 24px;
  margin-top: 16px;
  border-radius: 0px;
  border: 1px solid #e2e8f0;
`;

export const StyledPage = styled.div`
  margin-top: 24px;
  padding-top: 16px;
`;

export const StyledButton = styled.button`
  color: white;
  background: #0f172a;
  border: none;
  border-radius: 0px;
  padding: 16px 48px;
  margin-top: 40px;
  cursor: pointer;
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  transition: all 0.2s;

  &:hover {
    background: #1e293b;
  }
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 14px;
  border: 1px solid #cbd5e1;
  background-color: #fff;
  color: #0f172a;
  outline: none;
  font-family: inherit;
  font-size: 0.95rem;
  box-sizing: border-box;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg fill="%230f172a" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 14px top 50%;
  cursor: pointer;
  border-radius: 0px;
  transition: all 0.2s;

  option {
    background: white;
    color: #0f172a;
  }

  &:focus {
    border-color: #0f172a;
    box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.1);
  }
`;

export const StyledCheckbox = styled.input`
  width: 24px;
  height: 24px;
  appearance: none;
  position: relative;
  cursor: pointer;
  background: ${(props) => (props.checked ? "#0f172a" : "#fff")};
  border: 2px solid ${(props) => (props.checked ? "#0f172a" : "#cbd5e1")};
  border-radius: 0px;
  transition: all 0.2s;

  &::before {
    content: ${(props) => (props.checked ? '""' : "none")};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    width: 6px;
    height: 12px;
    border: solid white;
    border-width: 0 2px 2px 0;
    margin-top: -2px;
  }
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: 100%;
`;

export const FloatingLabel = styled(StyledLabel)`
  margin-bottom: 6px;
  position: static;
  pointer-events: auto;
  color: #475569;
`;

export const FloatingInput = styled(StyledInput)``;

export const ContnetTextContainer = styled.div`
  padding: 24px;
  display: flex;
  gap: 24px;
  flex-direction: column;
`;

export const MajorButton = styled.button`
  flex: 1;
  border: 2px dashed #cbd5e1;
  border-radius: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #64748b;
  height: 100px;
  background: #f8fafc;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #0f172a;
    color: #0f172a;
    background: #f1f5f9;
  }
`;

export const SmallButton = styled.button`
  padding: 8px 16px;
  background-color: ${(props) => (props.red ? "#fef2f2" : "#f1f5f9")};
  color: ${(props) => (props.red ? "#ef4444" : "#0f172a")};
  border: 1px solid ${(props) => (props.red ? "#fca5a5" : "#cbd5e1")};
  border-radius: 0px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 700;
  min-width: fit-content;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.red ? "#ef4444" : "#0f172a")};
    color: #fff;
    border-color: ${(props) => (props.red ? "#ef4444" : "#0f172a")};
  }
`;
