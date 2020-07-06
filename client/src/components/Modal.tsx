import React, {
  CSSProperties,
  useContext,
  createContext,
  useState,
  useCallback,
} from "react";
import ReactDOM from "react-dom";

import { TRANSPARENT_GRAY } from "./theme";

const ModalPortalContext = createContext<HTMLDivElement | null>(null);

const backdropStyles: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: TRANSPARENT_GRAY,
  padding: 25,
};

const cardStyles: CSSProperties = {
  background: "white",
  borderRadius: 12,
  padding: 45,
};

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
    <div style={backdropStyles}>
      <div style={cardStyles}>{props.children}</div>
    </div>,
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
