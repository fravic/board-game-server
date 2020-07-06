import React, { CSSProperties } from "react";

import * as theme from "./theme";

const commonStyles: CSSProperties = {
  background: "transparent",
  borderRadius: 12,
  fontSize: 24,
  fontWeight: "bold",
  padding: "15px 44px",
};

const primaryStyles: CSSProperties = {
  ...commonStyles,
  border: `5px solid ${theme.GREEN}`,
  color: theme.GREEN,
};

const secondaryStyles: CSSProperties = {
  ...commonStyles,
  border: `5px solid ${theme.TRANSPARENT_GRAY}`,
  color: theme.TRANSPARENT_GRAY,
};

type Props = {
  variant: "primary" | "secondary";
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export function Button(props: Props) {
  const { variant, ...restProps } = props;
  return (
    <button
      {...restProps}
      style={variant === "primary" ? primaryStyles : secondaryStyles}
    />
  );
}
