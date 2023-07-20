import { GlobalStyles, Stack, TextField, ThemeProvider } from "@mui/material";
import { Components, Translations, TwapAdapter, hooks, TWAPProps, Orders, ORDERS_CONTAINER_ID, TwapContextUIPreferences } from "@orbs-network/twap-ui";
import { createContext, useContext, useEffect } from "react";
import translations from "./i18n/en.json";
import { Box } from "@mui/system";
import { DfynCard, configureStyles, theme } from "./styles";
import { Configs, Status, TokenData } from "@orbs-network/twap";
import { isNativeAddress } from "@defi.org/web3-candies";
import Web3 from "web3";

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
        uiPreferences={uiPreferences}
      >
        <ThemeProvider theme={theme}>
          <GlobalStyles styles={configureStyles() as any} />
          <AdapterContextProvider value={props}>
            <Listener />
            <div className="twap-container">
              <DfynCard>
                <Stack spacing={1} style={{ width: '100%' }}>
                  <Stack direction="row" spacing={1}>
                    <Components.TokenSelect onClick={() => console.log('selecting token')} />
                    <Components.TokenSelect onClick={() => console.log('selecting token')} />
                    <Components.Base.IconButton onClick={() => console.log('switch')}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg></Components.Base.IconButton>
                  </Stack>
                  <TextField label="From" variant="outlined" />
                  <Components.Base.IconButton onClick={() => console.log('switch')}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-[0.875rem] w-[0.875rem]"><polyline points="6 9 12 15 18 9"></polyline></svg></Components.Base.IconButton>
                  <TextField label="To" variant="outlined" />
                  <Components.MarketPrice />
                  <div>
                    Limit: <Components.LimitPriceToggle />
                  </div>
                  <div>
                    Limit price: <Components.LimitPriceInput />
                  </div>
                  <div>
                    Trade size: <Components.TradeSize />
                  </div>
                  <div>
                    Trade interval selector: <Components.TradeIntervalSelector />
                  </div>
                  <div>
                    Max duration: <Components.MaxDurationSelector />
                  </div>
                  <Stack direction="row" spacing={1}>
                    <Components.SubmitButton />
                  </Stack>
                  <Components.PoweredBy />
                </Stack>
              </DfynCard>
            </div>
            <Components.Base.Portal id={ORDERS_CONTAINER_ID}><Components.OrderSummaryDetails /></Components.Base.Portal>
          </AdapterContextProvider>
        </ThemeProvider>
      </TwapAdapter>
    </Box>
  );
};

export { Orders, TWAP };
