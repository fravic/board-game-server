import Color from "color";

// Colors
export const GREEN = "#2AD34F";
export const LIGHT_GREEN = "#83E799";
export const DARK_GRAY = "#34495E";
export const TRANSPARENT_GRAY = "rgba(52, 73, 94, 50%)";
export const LIGHT_GRAY = "#E5E5E5";
export const LIGHTER_GRAY = "#F2F3F4";
export const WHITE = "#FFF";
export const RED = "#E23131";
export const LIGHT_RED = Color(RED).lighten(0.1).hex();

// styled-components theme
export const theme = {
  // Text
  bodyTextColor: DARK_GRAY,
  lightTextColor: WHITE,

  // Background
  lightBg: WHITE,
  lineBg: LIGHT_GRAY,
  inputBg: LIGHTER_GRAY,
  darkBg: TRANSPARENT_GRAY,
  alertBg: RED,
  alertBgLight: LIGHT_RED,
  okayBg: LIGHT_GREEN,

  // CTAs
  primaryCta: GREEN,
  primaryCtaLight: LIGHT_GREEN,
  secondaryCta: DARK_GRAY,
  secondaryCtaLight: Color(DARK_GRAY).lighten(0.4).hex(),

  // Spacing
  small: "6px",
  med: "12px",
  large: "24px",
  xlarge: "48px",
  gutterSmall: "20px",
  gutterLarge: "40px",
  borderRadius: "12px",

  // Breakpoints
  tablet: "@media (min-width: 481px)",
  desktop: "@media (min-width: 769px)",
};
