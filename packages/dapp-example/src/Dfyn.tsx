import { StyledDfyn, StyledStyledDfynPanel, StyledDfynLayout, StyledModalContent } from "./styles";
import { useConnectWallet, useNetwork } from "./hooks";
import { Configs, ParaswapOnlyDex } from "@orbs-network/twap";
import { TWAP, Orders } from "@orbs-network/twap-ui-dfyn";
import { useWeb3React } from "@web3-react/core";
import { Dapp, TokensList, UISelector } from "./Components";
import { Popup } from "./Components";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { erc20s, zeroAddress, erc20sData, isNativeAddress } from "@defi.org/web3-candies";
import { SelectorOption, TokenListItem } from "./types";

// TODO: replace with Configs.Dfyn when twap updated
const config = {
  name: "Dfyn",
  partner: "Orbs:TWAP:Dfyn",
  exchangeAddress: "0x3dD428151c697Aa1a3E5d0ee6A52768E70D85daE",
  exchangeType: "ParaswapExchange" as const,
  chainName: "poly",
  chainId: 137,
  twapVersion: 4,
  twapAddress: "0xceFf098C9199c5d9cf24078dc14Eb8F787631cC0",
  lensAddress: "0x8ffde23Fba2d7Aea9C3CBf2d5B7B533BB46754a8",
  bidDelaySeconds: 60,
  minChunkSizeUsd: 10,
  nativeToken: {
    address: "",
    symbol: "",
    decimals: 0,
    logoUrl: "",
  },
  wToken: {
    symbol: "",
    address: "",
    decimals: 0,
    weth: "",
    logoUrl: "",
  },
  twapAbi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "_iweth",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
  ],
  lensAbi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "_iweth",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
  ],
  takerAbi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "_iweth",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
  ],
  pathfinderKey: ParaswapOnlyDex.Chronos,
};

export const useDappTokens = () => {
  const { account } = useWeb3React();
  const { isInValidNetwork } = useNetwork(config.chainId);

  return useQuery(
    ["useDappTokens", config.chainId],
    async () => {
      const response = await fetch(`https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/arbitrum.json`);

      const tokens = await response.json();

      const parsed = tokens.map(({ symbol, address, decimals, name, logoURI }: any) => ({
        decimals,
        symbol,
        name,
        address,
        logoURI: isNativeAddress(address) ? config.nativeToken.logoUrl : logoURI,
      }));

      const candiesAddresses = [zeroAddress, ..._.map(erc20s.arb, (t) => t().address)];

      return _.sortBy(parsed, (t: any) => {
        const index = candiesAddresses.indexOf(t.address);
        return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
      });
    },
    { enabled: !!account && !isInValidNetwork, staleTime: Infinity }
  );
};

interface TokenSelectModalProps {
  open: boolean;
  selectToken: (token: any) => void;
  setOpen: () => void;
}

const parseList = (rawList?: any): TokenListItem[] => {
  return _.map(rawList, (rawToken) => {
    return {
      token: {
        address: rawToken.address,
        decimals: rawToken.decimals,
        symbol: rawToken.symbol,
        logoUrl: rawToken.logoURI,
      },
      rawToken,
    };
  });
};

const TokenSelectModal = ({ open, selectToken, setOpen }: TokenSelectModalProps) => {
  const { data: tokensList } = useDappTokens();

  const tokensListSize = _.size(tokensList);
  const parsedList = useMemo(() => parseList(tokensList), [tokensListSize]);

  return (
    <Popup isOpen={open} onClose={setOpen}>
      <StyledModalContent>
        <TokensList tokens={parsedList} onClick={selectToken} />
      </StyledModalContent>
    </Popup>
  );
};

const TWAPComponent = ({ limit }: { limit?: boolean }) => {
  const { account, library } = useWeb3React();

  const connect = useConnectWallet();
  const { data: dappTokens = [] } = useDappTokens();

  const getTokenLogoURL = useCallback(
    (symbol: string) => {
      return dappTokens.find((t) => t.symbol === symbol)?.logoURI;
    },
    [_.size(dappTokens)]
  );

  return (
    <TWAP
      connect={connect}
      account={account}
      srcToken={zeroAddress}
      dstToken={erc20sData.arb.USDC.address}
      dappTokens={dappTokens}
      TokenSelectModal={TokenSelectModal}
      provider={library}
      getTokenLogoURL={getTokenLogoURL}
      limit={limit}
      isDarkTheme={true}
      swapAnimationStart={false}
    />
  );
};

const logo = "https://chronos.exchange/wp-content/uploads/2023/03/1-1-1.png";
const DappComponent = () => {
  const [selected, setSelected] = useState(SelectorOption.TWAP);

  useEffect(() => {
    document.body.classList.add("dark");
  }, []);

  return (
    <StyledDfyn isDarkMode={1}>
      <StyledDfynLayout name={config.name}>
        <UISelector selected={selected} select={setSelected} />
        <StyledStyledDfynPanel>
          <TWAPComponent />
        </StyledStyledDfynPanel>
      </StyledDfynLayout>
    </StyledDfyn>
  );
};

const dapp: Dapp = {
  Component: DappComponent,
  logo,
  config,
};

export default dapp;
