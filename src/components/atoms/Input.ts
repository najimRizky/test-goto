import styled from "@emotion/styled";

const Input = styled.input`
  border: none;
  border-bottom: 2px solid var(--gray);
  font-size: 1rem;
  padding-bottom: 0.75rem;
  width: 100%;
  transition: var(--transition);
  outline: none;

  &:focus {
    border-color: var(--primary);

    & + label {
      color: var(--primary);
    }
  }

  &:disabled {
    border-color: var(--gray-light);
    background-color: transparent;
  }

  &.error {
    border-color: var(--red);
    color: var(--red);
  }
`;

export default Input;