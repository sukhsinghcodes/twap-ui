import { StylesConfig } from "@orbs-network/twap-ui";

// Styles configuration
export const darkModeStylesConfig: StylesConfig = {
  iconsColor: "rgb(105, 108, 128)",
  textColor: "#D1D5DB",
  tooltipBackground: "#1C1E29",
  tooltipTextColor: "white",
  spinnerColor: "white",
  containerBackground: "rgb(16, 23, 38)",
  cardBackground: "#282D3D",
  progressBarColor: "linear-gradient(180deg,#448aff,#004ce6)",
  progressBarTrackColor: "#c7cad9",
  orderHistorySelectedTabBackground: "#134DC8",
  orderHistoryTabColor: "white",
  orderHistorySelectedTabColor: "rgb(96, 230, 197)",
  buttonBackground: "linear-gradient(180deg,#448aff,#004ce6)",
  buttonColor: "white",
  disabledButtonBackground: "#12131a",
  disabledButtonColor: "#c7cad9",
  selectTokenBackground: "linear-gradient(180deg,#448aff,#004ce6)",
  selectTokenTextColor: "white",
  selectedTokenBackground: "#404557",
  selectedTokenTextColor: "#c7cad9",
};
export const configureStyles = () => {
  const styles = darkModeStylesConfig;
  return {
    ".twap-trade-size": {
      paddingTop: "8px!important",
      paddingBottom: "17px!important",
      marginBottom: 12,
      ".twap-token-logo": {
        width: 18,
        height: 18,
      },
      ".twap-token-name": {
        fontSize: "13px!important",
        fontWeight: "400!important",
        // fontSize: 14,
      },
      input: {
        fontSize: "13px!important",
      },
      ".twap-label": {
        fontSize: "14px",
      },
      ".MuiSlider-thumb": {
        background: "white",
      },
      ".MuiSlider-rail": {
        color: "#40475A",
      },
      ".MuiSlider-track": {
        color: "#A3A8B8",
      },
    },
    ".twap-percent-selector": {
      button: {
        "&:nth-child(2)": {
          marginLeft: 22.5,
        },
        padding: 0,
        background: "transparent",
        border: "unset",
        color: "#448aff",
        fontWeight: `500!important`,
        fontSize: 14,
        textTransform: "uppercase" as const,
        cursor: "pointer",
      },
    },
    ".twap-warning": {
      fontSize: 14,
      color: "white",
      opacity: 0.5,
    },
    ".twap-odnp": {
      color: styles.textColor,
      background: "transparent",
      border: "0.75px solid #26A7EF",
    },
    ".twap-limit-price": {
      marginBottom: 12,
      ".twap-label": {
        fontSize: 14,
      },
    },
    ".twap-limit-price-input": {
      width: "100%",
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: "0!important",
      borderRadius: 10,
      gap: 10,
      ".twap-input": {
        textAlign: "center" as const,
        input: {
          "&::placeholder": {
            color: styles.textColor,
          },
        },
      },
      p: {
        fontSize: "13px!important",
        fontWeight: "400!important",
      },
      ".twap-token-display img": {
        width: 25,
        height: 25,
      },
    },
    ".twap-input-loader": {
      right: 0,
      left: "unset",
    },
    ".twap-percent-button": {
      border: "unset",
      borderRadius: 4,
      cursor: "pointer",
      color: "#448aff!important",
      background: "unset",
      fontSize: 14,
      fontWeight: 600,
      textTransform: "uppercase" as const,
      margin: 0,
      padding: 0,
    },
    ".twap-label": {
      fontSize: 16,
    },
    ".twap-token-select": {
      ".twap-token-name": {
        fontWeight: "500!important",
        fontSize: "16px!important",
      },
      width: "115px !important",
      height: 45,
      border: "unset",
      padding: "8px 7px",
      marginBottom: 2,
      borderRadius: 38,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      color: `${styles.selectTokenTextColor}!important`,
      p: {
        color: "inherit",
      },
      ".twap-token-display": {
        img: {
          width: 30,
          height: 30,
          minWidth: 30,
          minHeight: 30,
        },
        p: {
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        },
        justifyContent: "start",
        width: "100%",
      },
    },
    ".twap-token-not-selected": {
      background: "#448AFF",
      p: {
        fontSize: 16,
      },
    },

    ".twap-token-selected": {
      background: "#404557",
      p: {
        fontSize: 16,
      },
    },
    ".twap-market-price": {
      img: {
        width: "25px!important",
        minWidth: "25px!important",
        height: "25px!important",
        minHeight: "25px!important",
      },
      p: {
        display: "flex",
        alignItems: "center",
        fontSize: "13px",
        fontWeight: "400!important",
        span: {
          fontSize: "13px",
        },
      },
      "&:nth-child(2)": {
        fontSize: "13px!important",
        display: "flex",
        alignItems: "center",
      },
      // borderRadius: "0px 0px 10px 10px",
      // background: "#12141B",
      padding: "13px 26px",
      ".title": {
        fontSize: 14,
      },
    },
    ".twap-icon": {
      "& *": {
        color: `${styles.iconsColor}!important`,
      },
    },
    ".twap-tooltip": {
      "& .MuiTooltip-tooltip": {
        backgroundColor: styles.tooltipBackground,
        borderRadius: "4px",
        color: styles.tooltipTextColor,
        fontSize: 14,
        fontFamily: "inherit",
        lineHeight: 1.5,
        maxWidth: 400,
        padding: 10,
        "& *": {
          color: styles.tooltipTextColor,
          fontSize: 14,
        },
      },
      "& .MuiTooltip-arrow": {
        color: styles.tooltipBackground,
      },
    },
    ".twap-loader": {
      backgroundColor: `${styles.skeletonLoaderBackground || "rgba(255,255,255, 0.1)"}!important`,
    },

    ".twap-button-loader": {
      color: styles.spinnerColor,
    },
    ".twap-time-selector": {
      "& input": {
        fontSize: "14px!important",
        "&::placeholder": {
          color: "rgba(255,255,255, 0.5)!important",
        },
      },
    },
    ".twap-time-selector-list": {
      background: styles.containerBackground,
      border: `1px solid ${styles.borderColor || "transparent"}`,
      right: 0,
    },
    ".twap-card": {
      padding: "15px 26px 20px",
      background: styles.cardBackground,
      // borderRadius: 10,
    },
    ".twap-container": {
      ".twap-limit-price": {
        paddingTop: 9,
        paddingBottom: 9,
      },
      background: "#1B1E29!important",
      padding: "36px 0",
      marginTop: 26,
      width: "100%",
      fontWeight: 500,
      "*": {
        color: styles.textColor,
        fontFamily: "inherit!important",
        fontWeight: "inherit!important",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      },
    },
    ".twap-small-label": {
      fontSize: 14,
      fontWeight: "500!important",
    },
    ".twap-slider": {
      ".MuiSlider-thumb.Mui-focusVisible, .MuiSlider-thumb:hover": {
        boxShadow: "none!important",
      },
      "& .MuiSlider-valueLabel": {
        background: styles.tooltipBackground,
        boxShadow: "none!important",
      },
      "& .MuiSlider-valueLabelLabel": {
        boxShadow: "none!important",
        color: styles.tooltipTextColor,
      },
      "& .MuiSlider-thumb": {
        boxShadow: "none!important",
        background: "#D9D9D9",
        width: 13,
        height: 13,
      },
    },
    ".twap-change-order": {
      width: 50,
      height: 50,
    },
    ".twap-token-name": {
      fontSize: 18,
    },
    ".twap-token-logo": {
      width: 28,
      height: 28,
    },
    ".twap-switch": {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0!important",

      "& .MuiSwitch-thumb": {
        padding: "0!important",
        width: 16,
        height: 16,
        background: "#D9D9D9",
      },
      "& .MuiSwitch-track": {
        padding: "0!important",
        width: 46,
        height: 24,
        borderRadius: 20,
        border: "1px solid #636679",
        background: "#1B1E29",
        opacity: "1!important",
      },
      "& .Mui-checked+.MuiSwitch-track": {
        padding: "0!important",
        backgroundColor: `${styles.containerBackground}!important`,
        opacity: "1!important",
      },
      "& .Mui-checked .MuiSwitch-thumb": {
        padding: "0!important",
        background: "#D9D9D9",
      },
      "& .MuiSwitch-switchBase": {
        top: 11,
        left: 17,
        padding: "0!important",
      },
    },
    ".twap-order": {
      border: "unset",
      background: styles.cardBackground,
      ".twap-order-expanded-colored": {
        background: styles.containerBackground,
      },
      ".twap-order-main-progress-bar": {
        background: `${styles.progressBarTrackColor}!important`,
      },
      "& .twap-order-progress": {
        "&::after": {
          background: `${styles.progressBarTrackColor}!important`,
        },
      },
      "& .MuiLinearProgress-bar": {
        background: styles.progressBarColor,
      },
    },
    ".twap-chunks-size": {
      ".twap-label": {
        fontSize: 14,
      },
    },
    ".twap-orders": {
      fontWeight: 500,
      color: styles.textColor,
      "*": {
        fontWeight: "inherit!important",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      },
    },
    ".twap-orders-header": {
      "& .twap-orders-header-tabs": {
        "& .MuiTabs-indicator": {
          backgroundColor: styles.orderHistorySelectedTabBackground,
        },
        "& .MuiButtonBase-root": {
          color: styles.orderHistoryTabColor,
          fontWeight: 400,
        },
        "& .Mui-selected": {
          color: styles.orderHistorySelectedTabColor,
        },
      },
    },
    ".twap-token-panel": {
      ".twap-token-panel-title": {
        fontSize: 16,
      },
      ".twap-input": {
        input: {
          fontSize: 18,
          fontWeight: `600!important`,
          textAlign: "end" as const,
        },
      },
    },
    ".twap-input": {
      "& input": {
        fontFamily: "inherit",
        textIndent: 0,
        outline: "1px solid transparent",
        borderRadius: "0.375rem",
        transition: "0.2s all",
        height: 35,
        color: styles.textColor,
        paddingRight: 0,
      },
    },
    ".twap-button": {
      height: 60,
      width: "calc(100% - 52px)!important",
      borderRadius: 10,
      background: styles.buttonBackground,
      color: styles.buttonColor,
      fontWeight: `600!important`,
      fontSize: 16,
      margin: "0 26px",
      "& *": {
        color: "inherit",
        fontWeight: "inherit",
        fontSize: "inherit",
      },
    },
    ".twap-button-disabled": {
      background: styles.disabledButtonBackground,
      color: styles.disabledButtonColor,
    },

    ".twap-modal-content": {
      background: styles.containerBackground,

      maxHeight: "85vh",
      overflow: "auto",
      borderRadius: "10px",
      padding: 15,
      paddingTop: 30,
      color: styles.textColor,
      "& a": {
        color: "white",
        fontWeight: 500,
        textDecoration: "underline",
      },
      "& .MuiIconButton-root": {
        color: "white",
      },
      "& *": {
        fontFamily: "inherit",
        color: "inherit",
      },
    },
    ".twap-change-tokens-order": {
      position: "absolute",
      width: "36px!important",
      height: 36,
      top: -24,
      background: "#1b1e29",
      border: `3px solid ${styles.cardBackground}`,
      borderRadius: 8,
      button: {
        padding: "0!important",
      },
    },
    ".twap-powered-by": {
      p: {
        fontSize: "11px!important",
        fontWeight: "400!important",
      },
      img: {
        width: "18px!important",
        height: "18px!important",
      },
      marginBottom: "50px!important",
    },
    ".twap-input input": {
      paddingRight: "0!important",
      fontSize: "13px!important",
    },
    ".twap-token-panel .twap-input input": {
      fontSize: "24px!important",
      color: "#D1D5DB!important",
      fontWeight: "400!important",
      "&::placeholder": {
        color: "#D1D5DB!important",
      },
    },
    ".twap-balance": {
      marginBottom: 8,
    },
    ".adapter-wrapper": {
      padding: "26px 0",
      width: "454px!important",
      margin: "auto",
    },
    ".twap-max-duration-wrapper, .twap-trade-interval-wrapper": {
      minHeight: 56,
      paddingTop: 9,
      paddingBottom: 9,
      ".twap-label": {
        fontSize: 14,
        fontWeight: 500,
      },
    },
    ".twap-label-tooltip-content svg": {
      width: "15px!important",
      height: "15px!important",
    },
  };
};
