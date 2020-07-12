import styled from "styled-components/macro";

export const Input = styled.input`
  padding: ${({ theme }) => `${theme.med} ${theme.large}`};
  font-size: 24px;

  border-radius: 12px;
  background: ${({ theme }) => theme.inputBg};
`;
