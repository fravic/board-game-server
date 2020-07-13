import styled from "styled-components/macro";

export const Headline = styled.span`
  color: ${({ theme }) => theme.bodyTextColor};
  font-weight: bold;
  font-size: 48px;
  line-height: 54px;
`;

export const Header = styled.span`
  color: ${({ theme }) => theme.bodyTextColor};
  font-weight: bold;
  font-size: 24px;
`;
