import { StyledModalContent, StyledStella, StyledStellaSwapBox, StyledStellaSwapLayout } from "./styles";
import { TWAP, Orders } from "@orbs-network/twap-ui-stellaswap";
import { useConnectWallet, useNetwork, useTheme } from "./hooks";
import { Configs } from "@orbs-network/twap";
import { useWeb3React } from "@web3-react/core";
import { Dapp, TokensList, UISelector } from "./Components";
import { Popup } from "./Components";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { erc20s, zeroAddress } from "@defi.org/web3-candies";
import { SelectorOption, TokenListItem } from "./types";
const config = { ...Configs.QuickSwap };
config.name = "StellaSwap";

const nativeTokenLogo = "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png";
export const useDappTokens = () => {
  const { account } = useWeb3React();
  const { isInValidNetwork } = useNetwork(config.chainId);

  return useQuery(
    ["useDappTokens", config.chainId],
    async () => {
      const response = await fetch(`https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/polygon.json`);

      const tokenList = await response.json();
      const parsed = tokenList
        .filter((t: any) => t.chainId === config.chainId)
        .map(({ symbol, address, decimals, logoURI, name }: any) => ({
          decimals,
          symbol,
          name,
          address,
          logoURI: (logoURI as string)?.replace("/logo_24.png", "/logo_48.png"),
        }));
      const candiesAddresses = [zeroAddress, ..._.map(erc20s.poly, (t) => t().address)];

      const _tokens = _.sortBy(parsed, (t: any) => {
        const index = candiesAddresses.indexOf(t.address);
        return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
      });

      return { ..._.mapKeys(_tokens, (t) => t.address) } as any;
    },
    { enabled: !!account && !isInValidNetwork }
  );
};

interface TokenSelectModalProps {
  popup: boolean;
  setPopup: (value: boolean) => void;
  selectedAsset: any;
  setSelectedAsset: (value: any) => void;
  otherAsset: any;
  setOtherAsset: (value: any) => void;
  baseAssets: any[];
  onAssetSelect: () => void;
}

const parseList = (rawList?: any): TokenListItem[] => {
  return _.map(rawList, (rawToken) => {
    return {
      token: {
        address: rawToken.address,
        decimals: rawToken.decimals,
        symbol: rawToken.symbol,
        logoUrl: rawToken.logoURI || nativeTokenLogo,
      },
      rawToken,
    };
  });
};

const TokenSelectModal = ({ popup, setPopup, setSelectedAsset, baseAssets }: TokenSelectModalProps) => {
  const tokensListSize = _.size(baseAssets);
  const parsedList = useMemo(() => parseList(baseAssets), [tokensListSize]);

  return (
    <Popup isOpen={popup} onClose={() => setPopup(true)}>
      <StyledModalContent>
        <TokensList tokens={parsedList} onClick={setSelectedAsset} />
      </StyledModalContent>
    </Popup>
  );
};

const TWAPComponent = ({ limit }: { limit?: boolean }) => {
  const { account, library } = useWeb3React();
  const connect = useConnectWallet();
  const { data: dappTokens } = useDappTokens();
  const { isDarkTheme } = useTheme();

  return (
    <TWAP
      connect={connect}
      account={account}
      srcToken={zeroAddress}
      dstToken="0x614389EaAE0A6821DC49062D56BDA3d9d45Fa2ff" //ORBS
      dappTokens={dappTokens}
      TokenSelectModal={TokenSelectModal}
      provider={library}
      isDarkTheme={isDarkTheme}
      limit={limit}
    />
  );
};

const DappComponent = () => {
  const [selected, setSelected] = useState(SelectorOption.TWAP);

  const { isDarkTheme } = useTheme();

  return (
    <StyledStella isDarkMode={isDarkTheme ? 1 : 0}>
      <StyledStellaSwapLayout name={config.name}>
        <UISelector selected={selected} select={setSelected} limit={true} />
        <StyledStellaSwapBox isDarkMode={isDarkTheme ? 1 : 0}>
          <TWAPComponent limit={selected === SelectorOption.LIMIT} />
        </StyledStellaSwapBox>

        <StyledStellaSwapBox isDarkMode={isDarkTheme ? 1 : 0}>
          <Orders />
        </StyledStellaSwapBox>
      </StyledStellaSwapLayout>
    </StyledStella>
  );
};

const dapp: Dapp = {
  Component: DappComponent,
  logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/17358.png",
  config,
  workInProgress: true,
};

export default dapp;
