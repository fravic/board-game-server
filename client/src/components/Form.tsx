import styled from "styled-components/macro";

export const Input = styled.input`
  padding: ${({ theme }) => `${theme.med} ${theme.large}`};
  font-size: 24px;
  max-width: 100%;

  border-radius: 12px;
  box-sizing: border-box;
  background: ${({ theme }) => theme.inputBg};
`;
