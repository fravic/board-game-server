import styled from "styled-components/macro";

const Button = styled.button`
  border-radius: 12px;
  cursor: pointer;
  font-size: 24px;
  font-weight: bold;
  padding: ${({ theme }) => `${theme.med} ${theme.large}`};
  width: 100%;

  ${({ theme }) => theme.tablet} {
    width: auto;
  }

  &:disabled {
    opacity: .6;
    pointer-events: none;
  }
`;

export const PrimaryButton = styled(Button)`
  background: ${p => p.theme.primaryCta};
  color: ${p => p.theme.lightTextColor};

  &:hover {
    background: ${p => p.theme.primaryCtaLight};
  }
`;

export const SecondaryButton = styled(Button)`
  background: ${p => p.theme.secondaryCta};
  color: ${p => p.theme.lightTextColor};

  &:hover {
    background: ${p => p.theme.secondaryCtaLight};
  }
`;
