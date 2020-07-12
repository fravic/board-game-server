import React from "react";
import styled, { keyframes } from "styled-components/macro";

type PropsType = {
  children: React.ReactNode;
  className?: string;
};

export const Spinner = (props: PropsType) => {
  return (
    <SpinnerContainer className={props.className}>
      <SpinnerAnimation />
      {props.children}
    </SpinnerContainer>
  );
};

const SpinnerContainer = styled.div`
  color: ${p => p.theme.primaryCta};
  font-weight: bold;
  text-align: center;
`;

// Spinner by Luke Haas
// https://projects.lukehaas.me/css-loaders/
const spinnerAnim = keyframes`
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
`;

const SpinnerAnimation = styled.div`
  color: ${p => p.theme.primaryCta};
  font-size: 10px;
  margin: 80px auto;
  position: relative;
  text-indent: -9999em;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;

  &,
  &:before,
  &:after {
    border-radius: 50%;
    width: 2.5em;
    height: 2.5em;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation: ${spinnerAnim} 1.8s infinite ease-in-out;
    animation: ${spinnerAnim} 1.8s infinite ease-in-out;
  }

  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 0;
  }
  &:before {
    left: -3.5em;
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }
  &:after {
    left: 3.5em;
  }
`;
