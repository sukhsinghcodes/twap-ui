import { GlobalStyles, Stack, ThemeProvider } from "@mui/material";
import {
  Components,
  Translations,
  TwapAdapter,
  hooks,
  TWAPProps,
  store,
  Orders,
  ORDERS_CONTAINER_ID,
} from "@orbs-network/twap-ui";
import { createContext, useContext, useEffect } from "react";
import translations from "./i18n/en.json";
import { Box } from "@mui/system";
import {
  DfynCard,
  PrimaryButton,
  configureStyles,
  theme,
} from "./styles";
import { Configs, Status, TokenData } from "@orbs-network/twap";
import { isNativeAddress } from "@defi.org/web3-candies";
import Web3 from "web3";
import { TwapContextUIPreferences } from "@orbs-network/twap-ui";


interface DfynTWAPProps extends TWAPProps {
  getTokenLogoURL: (address: string) => string;
  dappTokens: any[];
  connect?: () => void;
  swapAnimationStart: boolean;
}

const uiPreferences: TwapContextUIPreferences = {
  getOrdersTabsLabel: (name: string, amount: number) => `${name} (${amount})`,
  qrSize: 120,
  switchVariant: "ios",
  orderTabsToExclude: [Status.Canceled],
};


interface DfynRawToken {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
}

const config = Configs.QuickSwap;

const parseToken = (getTokenLogoURL: (symbol: string) => string, rawToken: DfynRawToken): TokenData | undefined => {
  if (!rawToken.symbol) {
    console.error("Invalid token", rawToken);
    return;
  }
  if (!rawToken.address || isNativeAddress(rawToken.address)) {
    return config.nativeToken;
  }
  return {
    address: Web3.utils.toChecksumAddress(rawToken.address),
    decimals: rawToken.decimals,
    symbol: rawToken.symbol,
    logoUrl: getTokenLogoURL(rawToken.symbol),
  };
};

const AdapterContext = createContext({} as DfynTWAPProps);

const AdapterContextProvider = AdapterContext.Provider;

const useAdapterContext = () => useContext(AdapterContext);







const limitStoreOverride = {
  isLimitOrder: true,
  chunks: 1,
  customDuration: { resolution: store.TimeResolution.Days, amount: 7 },
  customFillDelay: { resolution: store.TimeResolution.Minutes, amount: 2 },
};

const Listener = () => {
  const switchTokens = hooks.useSwitchTokens();

  const { swapAnimationStart } = useAdapterContext();
  useEffect(() => {
    if (swapAnimationStart) {
      switchTokens();
    }
  }, [swapAnimationStart]);

  return <></>;
};

const TWAP = (props: DfynTWAPProps) => {
  return (
    <Box className="adapter-wrapper">
      <TwapAdapter
        connect={props.connect ? props.connect : () => { }}
        config={config}
        maxFeePerGas={props.maxFeePerGas}
        priorityFeePerGas={props.priorityFeePerGas}
        translations={translations as Translations}
        provider={props.provider}
        account={props.account}
        dappTokens={props.dappTokens}
        parseToken={(rawToken) => parseToken(props.getTokenLogoURL, rawToken)}
        srcToken={props.srcToken}
        dstToken={props.dstToken}
        storeOverride={props.limit ? limitStoreOverride : undefined}
        uiPreferences={uiPreferences}
      >
        <ThemeProvider theme={theme}>
          <GlobalStyles styles={configureStyles() as any} />
          <AdapterContextProvider value={props}>
            <Listener />
            <div className="twap-container">
              <DfynCard>
                <Stack spacing={1}>

                  <div>TWAPPanel</div>
                  <PrimaryButton onClick={() => console.log('bam')}>Approve USDC</PrimaryButton>
                  <PrimaryButton disabled onClick={() => console.log('bam')}>Insufficient funds</PrimaryButton>
                </Stack>

              </DfynCard>
            </div>
            <Components.Base.Portal id={ORDERS_CONTAINER_ID}>
              Orders
            </Components.Base.Portal>
          </AdapterContextProvider>
        </ThemeProvider>
      </TwapAdapter>
    </Box>
  );
};




export { Orders, TWAP };
