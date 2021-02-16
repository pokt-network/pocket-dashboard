import React from "react";
import PropTypes from "prop-types";
import { createGlobalStyle } from "styled-components";
import { DEFAULT_FONT_FAMILY, MONOSPACE_FONT_FAMILY } from "ui/utils";
import { textStyle } from "ui/style";
import { useTheme } from "ui/theme";

import overpassLightWoff2 from "./assets/overpass/overpass-light.woff2";
import overpassRegularWoff2 from "./assets/overpass/overpass-regular.woff2";
import overpassSemiBoldWoff2 from "./assets/overpass/overpass-semibold.woff2";
import overpassMonoLightWoff2 from "./assets/overpass-mono/overpass-mono-light.woff2";

const DEFAULT_FONTS = {
  400: { url: overpassLightWoff2, format: "woff2" },
  600: { url: overpassRegularWoff2, format: "woff2" },
  800: { url: overpassSemiBoldWoff2, format: "woff2" },
};

const MONOSPACE_FONTS = {
  400: { url: overpassMonoLightWoff2, format: "woff2" },
};

function fontSrc(publicUrl, { url, format }) {
  return `url(${publicUrl + url}) format('${format}')`;
}

function fontFaceDeclarations({ fontFamily, publicUrl }) {
  // No need to declare the font faces if the font family has changed.
  if (fontFamily !== BaseStyles.defaultProps.fontFamily) {
    return "";
  }
  return `
    @font-face {
      font-family: ${DEFAULT_FONT_FAMILY};
      src: ${fontSrc(publicUrl, DEFAULT_FONTS["400"])};
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: ${DEFAULT_FONT_FAMILY};
      src: ${fontSrc(publicUrl, DEFAULT_FONTS["600"])};
      font-weight: 600;
      font-style: normal;
    }
    @font-face {
      font-family: ${DEFAULT_FONT_FAMILY};
      src: ${fontSrc(publicUrl, DEFAULT_FONTS["800"])};
      font-weight: 800;
      font-style: normal;
    }
    @font-face {
      font-family: ${MONOSPACE_FONT_FAMILY};
      src: ${fontSrc(publicUrl, MONOSPACE_FONTS["400"])};
      font-weight: 400;
      font-style: normal;
    }
  `;
}

const BaseStyles = React.memo(function BaseStyles(props) {
  const theme = useTheme();

  return (
    <GlobalStyle
      {...props}
      theme={theme}
      fontFaces={fontFaceDeclarations(props)}
      textStyleCss={textStyle("body2")}
    />
  );
});

BaseStyles.propTypes = {
  publicUrl: PropTypes.string,
  fontFamily: PropTypes.string,
};

BaseStyles.defaultProps = {
  publicUrl: "/",
  fontFamily: `${DEFAULT_FONT_FAMILY}, sans-serif`,
};

const GlobalStyle = createGlobalStyle`

  // @font-face declarations
  ${(p) => (p.fontFaces ? p.fontFaces : "")}

  *, *:before, *:after {
    box-sizing: border-box;
  }
  html {
    -webkit-overflow-scrolling: touch;
  }
  body {
    height: 0;
    min-height: 100vh;
    color: ${(p) => p.theme.content};
    font-family: ${(p) => p.fontFamily};
    ${(p) => p.textStyleCss};
  }
  html, body {
    overflow: hidden;
  }
  body, ul, p, h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
  }
  button, select, input, textarea, h1, h2, h3, h4, h5, h6 {
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    line-height: inherit;
  }
  a, button, select, input, textarea {
    color: inherit;
  }
  strong, b {
    font-weight: 600;
  }
  ::selection {
    background: ${(p) => p.theme.selected};
    color: ${(p) => p.theme.selectedContent};
  }
`;

export default BaseStyles;
