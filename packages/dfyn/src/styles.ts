import { createTheme, styled } from "@mui/material";
import { Components } from "@orbs-network/twap-ui";

export enum Networks {
  Polygon = "Polygon",
  Arbitrum = "Arbitrum",
}

const mobile = 500;

const MOBILE_FONT_SIZE = 11;

export const theme = createTheme({
  palette: {
    mode: "dark",
    text: {
      primary: "#ffffff",
    },
  },
  typography: {
    fontFamily: "inherit",
    fontSize: 14,
  },
  spacing: 14,
});

const brandColours = {
  network: {
    polygon: {
      main: "rgb(133 76 230)",
      dark: "rgb(69 16 158)",
    },
    arbitrum: {
      main: "rgb(40 160 240)",
    },
  },
  grayscale: {
    0: "rgb(0,0,0)",
    10: "rgb(16 20 39)",
    20: "rgb(35 38 47)",
    30: "#ffffff0f",
    40: "#ffffff12",
    100: "rgb(255, 255, 255)",
  },
};

const styles = {
  textColor: brandColours.grayscale[100],
  icon: brandColours.grayscale[100],
  border: brandColours.grayscale[20],
  cardBg: brandColours.grayscale[10],
  button: (network: Networks) => ({
    border: network === Networks.Polygon ? `1px solid ${brandColours.network.polygon.main}` : `1px solid ${brandColours.network.arbitrum.main}`,
    background: network === Networks.Polygon ? brandColours.network.polygon.main : brandColours.network.arbitrum.main,
    disabled: {
      background: "#ffffff0f ",
    },
    hover: {
      border: network === Networks.Polygon ? `1px solid ${brandColours.network.polygon.main}` : `1px solid ${brandColours.network.arbitrum.main}`,
      background: network === Networks.Polygon ? brandColours.network.polygon.dark : brandColours.network.arbitrum.main,
    },
    borderRadius: "0.75rem",
    fontSize: "14px",
    lineHeight: 1.25,
    textAlign: "center" as const,
    padding: "1rem",
  }),
};

export const PrimaryButton = styled(Components.Base.Button)();

export const DfynCard = styled(Components.Base.Card)({
  border: `1px solid ${styles.border}`,
});

const button = styles.button(Networks.Polygon);

const buttonStyles = () => {
  return {
    background: `${button.background}`,
    border: `1px solid ${button.background} !important`,
    borderRadius: button.borderRadius,
    fontSize: `${button.fontSize} !important`,
    color: "white",
    transition: "0s all !important",
    padding: button.padding,
    fontFamily: "inherit",
    fontWeight: 500,
    position: "relative",
    overflow: "hidden",
    ".twap-button-children": {
      position: "relative",
      zIndex: 2,
    },
    "*": {
      fontSize: `${button.fontSize} !important`,
      color: "inherit",
      fontWeight: 500,
    },
    "&:hover": {
      background: `${button.hover.background} !important`,
      border: button.hover.border,
    },
    "&:disabled": {
      opacity: "1 !important",
      background: "#ffffff0f !important",
      borderColor: "#ffffff12 !important",
      color: "rgb(195 197 203)",
      cursor: "not-allowed",
    },
    [`@media(max-width: ${mobile}px)`]: {
      fontSize: 12,
    },
  };
};

export const configureStyles = () => {
  return {
    "*": {
      color: `${styles.textColor}`,
    },
    ".twap-container": {
      color: `${styles.textColor}`,
    },
    ".twap-market-price": {
      width: "auto!important",
    },
    ".twap-price-compare": {
      border: `1px solid ${styles.border}`,
      borderRadius: 100,
      padding: "0px 18px",
      height: 34,

      ".twap-token-logo": {
        width: 16,
        height: 16,
        minWidth: 16,
        minHeight: 16,
      },
      "p, span": {
        position: "relative",
        top: 2,
        fontSize: 14,
      },
    },
    ".twap-icon": {
      "*": {
        color: styles.icon,
      },
    },
    ".twap-limit-reset": {
      "*": {
        stroke: styles.icon,
      },
    },

    ".twap-modal": {
      ".MuiBackdrop-root": {
        backdropFilter: "blur(15px)",
        background: "rgba(26, 28, 48, 0.50)",
      },
    },
    ".twap-modal-content": {
      overflowY: "auto",
      background: "#34385F",
      borderRadius: 30,
      padding: "50px 20px 20px 20px",
      maxWidth: "600px!important",
      color: styles.textColor,
      "*": {
        "-ms-overflow-style": "none",
      },
      "&::-webkit-scrollbar": {
        display: "none",
      },
      ".twap-card": {
        background: "#45497D",
        "&:before": {
          display: "none",
        },
      },
    },
    ".twap-disclaimer-text": {
      paddingRight: 15,
      fontSize: 14,
      "p, *": {
        fontSize: "inherit",
      },
    },
    ".twap-order-summary-details-item-right": {
      fontSize: 14,
      "*": {
        fontSize: "inherit",
      },
    },
    ".twap-token-display": {
      ".twap-token-logo": {
        width: 50,
        height: 50,
      },
      ".twap-token-name": {},
    },
    ".twap-cancel-order": {
      ...buttonStyles(),
      ".twap-button-loader": {
        width: "25px!important",
        height: "25px!important",
      },
    },
    ".twap-button": {
      ...buttonStyles(),
    },
    ".twap-button-disabled": {
      opacity: "0.5!important",
    },
    ".twap-button-loading": {
      opacity: "1!important",
    },
    ".twap-button-loader": {
      color: "white!important",
    },
    ".twap-usd-zero": {
      opacity: 0.5,
    },
    ".twap-tooltip": {
      "*": {
        fontFamily: "inherit",
      },
      ".MuiTooltip-tooltip": {
        background: "#44486D",
        borderRadius: 15,
        padding: "10px 15px",
        fontSize: 13,
        color: styles.textColor,
        "*": {
          color: "inherit",
        },
        ".MuiTooltip-arrow": {
          display: "none",
        },
      },
    },

    ".twap-time-selector-list": {
      background: "#44486D",
      "&-item": {
        "&:hover": {
          background: "rgba(255,255,255, 0.03)",
        },
      },
    },
    ".twap-input": {
      input: {
        fontWeight: 400,
        fontFamily: "inherit",
        color: styles.textColor,
        "&::placeholder": {
          color: `${styles.textColor}!important`,
          opacity: 0.5,
        },
      },
    },
    ".twap-loader": {
      background: "rgba(255,255,255, 0.1)!important",
    },
    ".twap-input-loader": {
      background: "rgba(255,255,255, 0.1)!important",
      maxWidth: "60%",
    },
    ".twap-card": {
      borderRadius: 25,
      padding: "14px 18px",
      background: styles.cardBg,
      position: "relative",
    },
    ".twap-label": {
      p: {
        fontWeight: 400,
        fontSize: 16,
      },
    },

    ".twap-slider": {
      ".MuiSlider-valueLabel": {
        borderRadius: 10,
        background: "#44486D",
        color: styles.textColor,
      },
    },
    ".twap-switch": {
      ".MuiSwitch-switchBase": {
        "&:hover": {
          background: "transparent!important",
        },
      },
      ".MuiSwitch-thumb": {
        background: "#4F4974",
        transform: "scale(0.8)",
      },
      ".Mui-checked .MuiSwitch-thumb": {
        background: "white",
      },
      ".MuiSwitch-track": {
        border: `1.5px solid ${styles.border}`,
        background: "transparent!important",
        opacity: "1!important",
      },
      ".Mui-checked+.MuiSwitch-track": {
        background: "transparent!important",
        border: `1.5px solid ${styles.border}!important`,
      },
    },
    [`@media(max-width: ${mobile}px)`]: {
      ".twap-odnp-button": {
        height: "100%",
        padding: "0px 10px!important",
        p: {
          fontSize: "11px!important",
        },
      },
      ".twap-label": {
        p: { fontSize: 11 },
      },
      ".twap-market-price": {
        fontSize: MOBILE_FONT_SIZE,
      },
    },
  };
};
