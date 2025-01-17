import { Box, createTheme, styled, Theme } from "@mui/material";
import { Components, OrdersPanel, Styles } from "@orbs-network/twap-ui";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
  },

  typography: {
    fontFamily: "inherit",
  },
});
const isDark = (theme: Theme) => theme.palette.mode === "dark";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: "inherit",
  },
});

const lightStyles = {
  gradient: "linear-gradient(to right,rgba(59,130,246,.15),rgba(236,72,153,.15))",
  textMain: "rgba(0,0,0, 0.8)",
  modalBackground: "#F4F5F6",
  card: "#F4F5F6",
  disabledCard: "#F4F5F6",
  backdrop: "rgba(255,255,255,.4)",
  switchTrack: "rgba(0,0,0, 0.3)",
};

const darkStyles = {
  gradient: "linear-gradient(to right,rgba(59,130,246,.15),rgba(236,72,153,.15))",
  textMain: "#BFBFBF",
  modalBackground: "#151515",
  card: "rgba(8,8,8,1)",
  disabledCard: "rgba(8,8,8,0.5)",
  backdrop: "rgba(0, 0, 0, 0.424)",
  switchTrack: "hsla(0,0%,100%,.3)",
};

const baseStyles = (theme: Theme) => (isDark(theme) ? darkStyles : lightStyles);

export const StyledPanelInput = styled(Components.TokenInput)({
  height: "100%",
  input: {
    fontSize: 30,
    height: "100%",
    fontWeight: 500,
  },
});

export const StyledChunkSize = styled(Components.Base.Card)({
  ".twap-token-logo": {
    width: 30,
    height: 30,
  },
  ".twap-chunks-size-usd": {
    "*": {
      fontSize: 14,
    },
  },
});

export const StyledPanelRight = styled(Styles.StyledRowFlex)<{ isSrcToken: number }>(({ isSrcToken, theme }) => {
  const styles = baseStyles(theme);
  return {
    background: isSrcToken ? styles.card : styles.disabledCard,
    borderRadius: 10,
    padding: 10,
    minHeight: 60,
    cursor: isSrcToken ? "auto" : "not-allowed",
  };
});

export const StyledBalanceAndUSD = styled(Styles.StyledColumnFlex)({
  width: "auto",
  alignItems: "flex-end",
  gap: 0,
  "*": {
    color: "rgba(87,87,87,1)",
    fontSize: 12,
  },
});

export const StyledUSD = styled(Components.TokenUSD)({
  maxWidth: "unset",
});

export const StyledBalance = styled(Components.TokenBalance)({
  maxWidth: "unset",

  p: {
    flexDirection: "column",
    display: "flex",
    alignItems: "flex-end",
  },
});

export const StyledTop = styled(Styles.StyledColumnFlex)({
  gap: 20,
  padding: "0px 20px 0px 20px",
});

export const StyledMarketPrice = styled(Components.MarketPrice)({
  "> p": {
    fontSize: 15,
    fontWeight: 500,
  },
});

export const StyledTokenChange = styled(Components.ChangeTokensOrder)(({ theme }) => {
  const isDarkTheme = isDark(theme);
  return {
    justifyContent: "flex-start",
    button: {
      background: isDarkTheme ? "rgba(16,16,16,1)" : "rgb(243 244 246/1)",
      width: 62,
      height: 62,
      borderRadius: "50%",
      border: "2px solid black",
      "&:hover": {
        background: isDarkTheme ? "rgba(16,16,16,1)" : "rgb(243 244 246/1)",
      },
    },
    svg: {
      width: 27,
      height: 27,
      fill: "white",
    },
  };
});

export const StyledContainer = styled(Styles.StyledColumnFlex)({
  gap: 15,
});

export const StyledTokenPanel = styled(StyledContainer)({});

export const StyledColumnFlex = styled(Styles.StyledColumnFlex)({
  gap: 12,
});

export const StyledSubmit = styled(Components.SubmitButton)({});

export const StyledPoweredBy = styled(Components.PoweredBy)({
  marginTop: 20,
});

export const StyledTokenSelect = styled(Styles.StyledRowFlex)({
  alignItems: "center",
  width: "auto",
  gap: 10,
  "*": {
    whiteSpace: "nowrap",
  },
  ".twap-token-name": {
    fontSize: 24,
    fontWeight: 700,
  },
  ".twap-token-select-text": {
    fontSize: 24,
    fontWeight: 700,
  },
  ".twap-token-logo": {
    width: "54px!important",
    height: "54px!important",
  },
  ".twap-token-svg": {
    width: "60px!important",
    height: "60px!important",
  },
  cursor: "pointer",
  ".twap-token-select-title": {
    fontSize: 12,
    color: "rgba(87,87,87,1)",
  },
  ".twap-token-select-icon": {
    width: 23,
    height: 23,
  },
});

export const StyledLimitPrice = styled(Components.LimitPriceInput)({
  background: "#151519",
  borderRadius: 12,
  padding: "5px 10px 5px 10px",
  "*": {
    fontSize: `14px!important`,
    fontWeight: 500,
  },
  ".twap-input": {
    height: "auto",
    input: {
      fontSize: `15px!important`,
    },
  },
});

export const StyledOrders = styled(OrdersPanel)(({ theme }) => {
  const styles = baseStyles(theme);
  const isDarkMode = isDark(theme);

  return {
    maxWidth: "unset!important",
    color: styles.textMain,
    ".twap-orders-list": {
      gap: 16,
    },
    ".twap-order-expanded-right": {
      color: `${styles.textMain}!important`,
      fontWeight: 500,
      "*": {
        color: `inherit`,
        fontWeight: `inherit`,
      },
    },
    ".twap-token-display-amount-and-symbol": {
      fontSize: 15,
      fontWeight: 500,
    },
    ".twap-order": {
      padding: 20,

      ".twap-label p": {
        fontSize: 14,
        fontWeight: 500,
      },

      ".twap-order-separator": {
        display: "none",
      },
      ".twap-market-price-section": {
        background: isDarkMode ? "#151519" : "#F4F5F6",
        width: "100%",
        padding: "5px 10px",
        borderRadius: 8,
        "*": {
          fontSize: "13px",
        },
        ".twap-small-label p": {
          fontSize: "14px!important",
        },
      },
      ".MuiLinearProgress-root": {
        background: "hsla(0,0%,100%,.06)",
      },
      ".MuiLinearProgress-bar": {
        background: "#6034b1",
      },
      ".MuiLinearProgress-root::after": {
        display: "none",
      },
    },

    ".twap-orders-header": {
      ".twap-label": {
        p: {
          fontSize: "16px!important",
          fontWeight: 500,
        },
      },
      ".twap-orders-header-tabs": {
        border: "2px solid rgba(48,23,71,1)",
      },
      ".MuiButtonBase-root": {
        borderRadius: 4,
        transition: "0.3s all",
        color: "inherit",
      },
      ".Mui-selected": {
        background: "unset",
        color: "white",
      },
      ".MuiTabs-indicator": {
        // display: "none",
        background: "#e2107b",
      },
    },
  };
});

export const StyledOrderSummary = styled(Components.OrderSummaryModalContainer)(({ theme }) => {
  const styles = baseStyles(theme);

  return {
    fontFamily: "Inter",

    ".twap-modal-content": {
      ".twap-disclaimer-text": {
        "*": {
          color: styles.textMain,
          fontSize: 14,
          lineHeight: "18px",
        },
      },
      ".twap-ui-close": {
        padding: 5,
        background: "hsla(0,0%,100%,.06)",
        top: 10,
        right: 10,
        svg: {
          width: 20,
          height: 20,
        },
        "&:hover": {
          background: "hsla(0,0%,100%,.1)",
        },
      },
      ".twap-order-summary-limit-price": {
        fontSize: 14,
        color: styles.textMain,
        p: {
          color: "inherit",
        },
      },
      ".twap-label": {
        fontSize: 14,
        fontWeight: 600,
        color: styles.textMain,
        p: {
          fontSize: "inherit",
          fontWeight: "inherit",
          color: "inherit",
        },
      },
      ".twap-order-summary-details-item": {},
      ".twap-order-summary-details-item-right": {
        color: styles.textMain,
        fontSize: 14,
        fontWeight: 600,
        "*": {
          color: styles.textMain,
          fontSize: 14,
          fontWeight: 600,
        },
      },
    },
    ".twap-order-summary-output-address": {
      p: {
        color: styles.textMain,
        fontSize: 15,
        fontWeight: 500,
      },
    },
    ".twap-orders-summary-token-display": {
      ".twap-small-label": {
        p: {
          color: styles.textMain,
          fontSize: 16,
          fontWeight: 500,
        },
      },
      ".twap-token-logo": {
        width: 45,
        height: 45,
      },
    },
    "@media(max-width: 600px)": {
      ".twap-order-summary-details-item": {
        flexDirection: "column",
        alignItems: "flex-start",
      },
      ".twap-orders-summary-token-display-flex": {
        "&:last-of-type": {
          flexDirection: "column",
          alignItems: "flex-start",
        },
      },
    },
  };
});

export const StyledAdapter = styled(Box)(({ theme }) => {
  const styles = baseStyles(theme);

  return {
    ".MuiSlider-valueLabel": {
      backgroundColor: "#2D3545",
      fontSize: 15,
    },
    "*": {
      color: styles.textMain,
    },
    ".MuiSlider-thumb ": {
      background: "rgb(59 130 246/1)",
    },
    ".MuiSlider-track": {
      background: "rgb(59 130 246/1)",
      border: "1px solid rgb(59 130 246/1)",
    },
    ".twap-button-disabled": {
      pointer: "unset",
      background: "rgba(21,21,21,0.8)!important",
      "*": {},
    },

    ".twap-label": {
      p: {
        color: "inherit",
        fontSize: 15,
        fontWeight: 500,
      },
    },
    ".twap-time-selector-list": {
      background: "#151519",
      border: "1px solid rgba(191,191,191,1)",
    },
    ".twap-time-selector-list-item": {
      "&:hover": {
        background: "rgba(255,255,255,0.03)",
      },
    },
  };
});

const buttonStyles = {
  borderRadius: 12,
  background: "#e2107b",
  minHeight: 52,
  fontWeight: 500,
  fontSize: 16,
  lineHeight: "24px",
  padding: 10,
  color: "white",
  "*, p": {
    fontWeight: "inherit",
    fontSize: "inherit",
    lineHeight: "inherit",
    color: "white!important",
  },
};

export const configureStyles = (theme: Theme) => {
  const styles = baseStyles(theme);
  const isDarkMode = isDark(theme);
  return {
    ".twap-odnp-button": {
      ...buttonStyles,
      border: "unset",
      minHeight: "unset",
      p: {
        fontWeight: "600!important",
      },
    },
    ".twap-button": {
      ...buttonStyles,
    },
    ".twap-modal-content": {
      padding: "56px 16px 16px 16px",
      background: `${styles.modalBackground}!important`,
      border: "1px solid rgb(0, 0, 0)",
      boxShadow: "rgba(0, 0, 0, 0.05) 0px 4px 8px 0px",
      maxHeight: "90vh",
      overflowY: "auto",
      width: "calc(100vw - 40px)",
      borderRadius: 16,
      color: styles.textMain,
      ".twap-ui-close": {
        color: styles.textMain,
      },
    },
    ".twap-input": {
      input: {
        "&::placeholder": {
          color: isDarkMode ? "white!important" : "rgb(17 24 39/1)!important",
          opacity: 0.4,
        },
      },
    },
    ".twap-card": {
      background: isDarkMode ? "#080808" : "#F4F5F6",
      padding: 12,
      borderRadius: 12,
      border: isDarkMode ? "3px solid rgba(16,16,16,1)" : "unset",
    },

    ".MuiBackdrop-root": {
      background: styles.backdrop,
      backdropFilter: "blur(10px) saturate(190%) contrast(70%) brightness(80%)",
    },
    ".twap-time-selector": {
      ".twap-input": {
        input: {
          height: 40,
        },
      },
      ".twap-loader": {
        right: 0,
      },
    },
    ".twap-loader": {
      background: "rgba(255,255,255,0.1)!important",
    },
    ".twap-trade-size": {
      ".twap-token-logo": {
        width: 24,
        height: 24,
      },
      ".twap-token-name": {
        fontSize: 14,
        fontWeight: 600,
      },
    },
    ".MuiSwitch-thumb ": {
      background: styles.gradient,
    },
    ".MuiSwitch-track": {
      background: `${styles.switchTrack}!important`,
      height: 20,
    },
    ".twap-disclaimer-switch": {
      p: {
        fontSize: 15,
        fontWeight: 500,
      },
    },
    ".Mui-checked+.MuiSwitch-track": {
      background: "#6034b1!important",
      opacity: "1!important",
    },

    ".twap-tooltip": {
      "& .MuiTooltip-tooltip": {
        backgroundColor: isDarkMode ? "#151519" : "#F9F9FA",
        borderRadius: "8px",
        fontSize: 14,
        padding: 10,
        fontFamily: "Inter",
        fontWeight: 400,
        color: isDarkMode ? "rgba(191,191,191,1)" : "rgb(107 114 128/1)",
        lineHeight: "20px",
        border: "1px solid rgba(191,191,191,1)",
        "& *": {
          color: "inherit",
          fontSize: "inherit",
          fontWeight: "inherit",
        },
      },
      "& .MuiTooltip-arrow": {
        display: "none",
      },
    },
    ".twap-adapter-wrapper": {
      "*": {
        fontFamily: "inherit",
      },
    },

    ".twap-orders-header": {
      padding: "0px!important",
    },
  };
};
