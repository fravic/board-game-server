import styled from "styled-components/macro";

const Button = styled.button`
  background: transparent;
  border-radius: 12px;
  font-size: 24px;
  font-weight: bold;
  padding: 15px 44px;
`;

export const PrimaryButton = styled(Button)`
  border: 5px solid ${(props) => props.theme.primaryCta};
  color: ${(props) => props.theme.primaryCta};
`;

export const SecondaryButton = styled(Button)`
  border: 5px solid ${(props) => props.theme.secondaryCta};
  color: ${(props) => props.theme.secondaryCta};
`;
