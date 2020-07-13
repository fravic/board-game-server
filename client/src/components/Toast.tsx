import { omit } from "lodash";
import React from "react";
import styled, { keyframes } from "styled-components/macro";

type Toast = {
  message: string;
};

type ToastsByKey = { [key: string]: Toast };

export const ToastContext = React.createContext({
  showToast: (key: string, toast: Toast) => {
    // Implemented in Provider
  },
});

type PropsType = {
  children: React.ReactNode;
};

export const ToastProvider = (props: PropsType) => {
  const [toasts, setToasts] = React.useState<ToastsByKey>({});
  const showToast = React.useCallback(
    (key: string, toast: Toast) => {
      setToasts({ ...toasts, [key]: toast });
    },
    [toasts, setToasts]
  );
  const handleToastDismiss = React.useCallback(
    (key: string) => {
      setToasts(omit(toasts, key));
    },
    [toasts, setToasts]
  );
  return (
    <ToastContext.Provider value={{ showToast }}>
      {props.children}
      <ToastRenderer toasts={toasts} onDismiss={handleToastDismiss} />
    </ToastContext.Provider>
  );
};

export const ToastRenderer = (props: {
  toasts: ToastsByKey;
  onDismiss: (key: string) => void;
}) => {
  return (
    <>
      {Object.entries(props.toasts).map(entry => (
        <Toast
          key={entry[0]}
          toast={entry[1]}
          onDismiss={() => props.onDismiss(entry[0])}
        />
      ))}
    </>
  );
};

const Toast = (props: { toast: Toast; onDismiss: () => void }) => {
  return (
    <ToastDiv role="button" onClick={props.onDismiss}>
      {props.toast.message}
    </ToastDiv>
  );
};

const popUpAnim = keyframes`
0% {
  bottom: -100px;
}
100% {
  bottom: 10px;
}
`;

const ToastDiv = styled.div`
  position: fixed;
  margin: 0 auto;
  left: 50%;
  bottom: 10px;
  text-align: center;
  padding: 10px;
  z-index: 999;

  width: 300px;
  margin-left: -150px;

  ${p => p.theme.tablet} {
    width: 450px;
    margin-left: -225px;
  }

  animation: ${popUpAnim} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  background: ${p => p.theme.alertBg};
  color: ${p => p.theme.lightTextColor};
  border-radius: ${p => p.theme.borderRadius};
  cursor: pointer;

  &:hover {
    background: ${p => p.theme.alertLightBg};
  }
`;
