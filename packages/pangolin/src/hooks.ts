import { zeroAddress, eqIgnoreCase } from "@defi.org/web3-candies";
import { TokenData } from "@orbs-network/twap";
import { hooks } from "@orbs-network/twap-ui";
import _ from "lodash";
import { useMemo, useEffect, useRef, createContext, useContext } from "react";
import { PangolinTWAPProps } from ".";

export const parseToken = (rawToken: any): TokenData => {
  if (!rawToken.tokenInfo) {
    return {
      address: zeroAddress,
      decimals: 18,
      symbol: "AVAX",
      logoUrl: "https://raw.githubusercontent.com/pangolindex/sdk/master/src/images/chains/avax.png",
    };
  }
  const { tokenInfo } = rawToken;
  return {
    address: tokenInfo.address,
    decimals: tokenInfo.decimals,
    symbol: tokenInfo.symbol,
    logoUrl: tokenInfo.logoURI,
  };
};
const nativeToken: TokenData = {
  decimals: 18,
  symbol: "AVAX",
  address: zeroAddress,
  logoUrl: "https://raw.githubusercontent.com/pangolindex/sdk/master/src/images/chains/avax.png",
};

export const useParseTokenList = (dappTokens?: any): TokenData[] => {
  return useMemo(() => {
    if (!dappTokens) return [];
    const result = _.map(dappTokens, (t) => parseToken(t));

    return [nativeToken, ...result];
  }, [dappTokens]);
};

const findToken = (tokenList?: TokenData[], address?: string) => {
  if (!address || !tokenList || !tokenList.length) return;
  const token = _.find(tokenList, (t: any) => eqIgnoreCase(t.address, address));
  return !token ? undefined : token;
};

export const useTokensFromDapp = (srcTokenAddress?: string, dstTokenAddress?: string, tokenList?: TokenData[]) => {
  const setTokens = hooks.useSetTokens();
  const tokenListRef = useRef<TokenData[] | undefined>(undefined);
  tokenListRef.current = tokenList;
  const tokensLength = tokenList?.length || 0;

  useEffect(() => {
    if (!tokensLength) return;

    const srcToken = findToken(tokenListRef.current, srcTokenAddress);
    const dstToken = findToken(tokenListRef.current, dstTokenAddress);

    setTokens(srcToken, dstToken);
  }, [srcTokenAddress, dstTokenAddress, tokensLength]);
};

export interface AdapterContextProps {
  TokenSelectModal: any;
}

export const usePrepareAdapterContextProps = (props: PangolinTWAPProps) => {
  return {
    TokenSelectModal: props.TokenSelectModal,
  };
};

const AdapterContext = createContext({} as AdapterContextProps);
export const AdapterContextProvider = AdapterContext.Provider;
export const useAdapterContext = () => useContext(AdapterContext);
