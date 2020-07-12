import React, { useContext, createContext, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

export const ModalPortalContext = createContext<HTMLDivElement | null>(null);

export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${(props) => props.theme.darkBg};
  padding: 25px;
`;

export const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 45px;
`;

type Props = {
  children: React.ReactNode;
};

export function Modal(props: Props) {
  const modalPortalDOMNode = useContext(ModalPortalContext);
  if (!modalPortalDOMNode) {
    console.warn("Attempted to render Modal without ModalPortal");
    return null;
  }
  return ReactDOM.createPortal(
    <Backdrop>
      <Card>{props.children}</Card>
    </Backdrop>,
    modalPortalDOMNode
  );
}

export function ModalPortal(props: Props) {
  const [
    modalPortalDOMNode,
    setModalPortalDOMNode,
  ] = useState<HTMLDivElement | null>(null);
  const setModalPortalRef = useCallback((el: HTMLDivElement | null) => {
    setModalPortalDOMNode(el);
  }, []);
  return (
    <ModalPortalContext.Provider value={modalPortalDOMNode}>
      <div style={{ position: "relative", zIndex: 0 }}>{props.children}</div>
      <div ref={setModalPortalRef} style={{ zIndex: 1 }} />
    </ModalPortalContext.Provider>
  );
}
