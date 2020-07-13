import styled from "styled-components/macro";

export const DividerLine = styled.div`
  border-bottom: 1px solid ${p => p.theme.lineBg};
  margin: ${p => p.theme.xlarge} 0;
  position: relative;

  text-transform: uppercase;
`;

export const DividerOr = styled.div`
  padding: 4px 10px;
  position: absolute;
  left: 50%;
  top: -13px;
  margin-left: -22px;

  color: ${p => p.theme.secondaryCta};
  background: ${p => p.theme.lightBg};
  font-weight: bold;
`;
