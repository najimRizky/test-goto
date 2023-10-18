import styled from "@emotion/styled";

interface Props {
  size?: "small" | "medium" | "large";
}

const avatarSize = {
  small: "2rem",
  medium: "2.5rem", 
  large: "3rem",
}

const Avatar = styled.div<Props>`
  width: ${({ size }) => avatarSize[size || "medium"]};
  height: ${({ size }) => avatarSize[size || "medium"]};
  padding: 0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease-in-out;
  background-color: var(--primary);
  color: var(--white);
  flex-shrink: 0;
`;

export default Avatar;