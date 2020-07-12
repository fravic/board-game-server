import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components/macro";

import { CenterColumnBox } from "./Flexbox";
import { Header } from "./Text";
import { Backdrop, ModalPortalContext } from "./Modal";

export const RotateDevice = () => {
  const modalPortalDOMNode = React.useContext(ModalPortalContext);
  const [visible, setVisible] = React.useState(false);
  const handleResize = React.useCallback(() => {
    setVisible(window.innerHeight > window.innerWidth);
  }, [setVisible]);
  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);
  if (!modalPortalDOMNode) {
    console.warn("Attempted to render RotateDevice without ModalPortal");
    return null;
  }
  if (visible) {
    return ReactDOM.createPortal(
      <OpaqueBackdrop style={{ zIndex: 999 }}>
        <CenterColumnBox>
          <RotateDeviceIconContainer>
            <RotateDeviceIcon />
          </RotateDeviceIconContainer>
          <Header>please rotate your device</Header>
        </CenterColumnBox>
      </OpaqueBackdrop>,
      modalPortalDOMNode
    );
  }
  return null;
};

const RotateDeviceIconContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.med};
`;

const OpaqueBackdrop = styled(Backdrop)`
  background: ${({ theme }) => theme.lightBg};
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const RotateDeviceIcon = () => (
  <svg
    width="128"
    height="105"
    viewBox="0 0 128 105"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.5">
      <path d="M8.125 15.5H46.875V69.75H8.125V15.5Z" fill="#E5E5E5" />
      <path
        d="M46.875 0.03875L8.12501 0C3.86251 0 0.413757 3.4875 0.413757 7.75V77.5C0.413757 81.7625 3.86251 85.25 8.12501 85.25H46.875C51.1375 85.25 54.625 81.7625 54.625 77.5V7.75C54.625 3.4875 51.1375 0.03875 46.875 0.03875ZM46.875 69.75H8.12501V15.5H46.875V69.75Z"
        fill="#34495E"
      />
    </g>
    <path d="M57.375 58.25H111.625V97H57.375V58.25Z" fill="#E5E5E5" />
    <path
      d="M119.375 50.5H49.625C45.3625 50.5 41.9137 53.9875 41.9137 58.25L41.875 97C41.875 101.263 45.3625 104.75 49.625 104.75H119.375C123.637 104.75 127.125 101.263 127.125 97V58.25C127.125 53.9875 123.637 50.5 119.375 50.5ZM111.625 97H57.375V58.25H111.625V97Z"
      fill="#34495E"
    />
    <path
      d="M87.4785 31.7462L97.1959 31.6581L82.9243 46.1908L68.7082 31.9163L81.0846 31.8041C79.4837 22.8284 71.6351 16.062 62.2342 16.1472L62.1768 9.81655C75.0913 9.69951 85.8144 19.2889 87.4785 31.7462Z"
      fill="#34495E"
    />
  </svg>
);
