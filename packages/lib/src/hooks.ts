import { Order, Status, TokenData, TokensValidation, TWAPLib } from "@orbs-network/twap";
import { useTwapContext } from "./context";
import Web3 from "web3";
import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import BN from "bignumber.js";
import { InitLibProps, OrdersData, OrderUI, State } from "./types";
import _ from "lodash";
import { analytics } from "./analytics";
import { eqIgnoreCase, setWeb3Instance, switchMetaMaskNetwork, zeroAddress, estimateGasPrice, getPastEvents, findBlock, block } from "@defi.org/web3-candies";
import { amountUi, getTokenFromTokensList, parseOrderUi, useTwapStore } from "./store";
import { REFETCH_BALANCE, REFETCH_GAS_PRICE, REFETCH_ORDER_HISTORY, REFETCH_USD, STALE_ALLOWANCE } from "./consts";
import { QueryKeys } from "./enums";
import moment from "moment";
import { logger } from "./utils";
import { useNumericFormat } from "react-number-format";

/**
 * Actions
 */

export const useResetStore = () => {
  const resetTwapStore = useTwapStore((state) => state.reset);
  const storeOverride = useTwapContext().storeOverride;

  return () => {
    resetTwapStore(storeOverride || {});
  };
};

export const useReset = () => {
  const resetTwapStore = useTwapStore((state) => state.reset);
  const client = useQueryClient();
  const storeOverride = useTwapContext().storeOverride;

  return () => {
    client && client.invalidateQueries();
    resetTwapStore(storeOverride || {});
  };
};

export const useWrapToken = () => {
  const lib = useTwapStore((state) => state.lib);
  const srcAmount = useTwapStore((state) => state.getSrcAmount());
  const srcToken = useTwapStore((state) => state.srcToken);
  const dstToken = useTwapStore((state) => state.dstToken);

  const { priorityFeePerGas, maxFeePerGas } = useGasPriceQuery();

  const setSrcToken = useTwapStore((state) => state.setSrcToken);
  const reset = useReset();

  return useMutation(
    async () => {
      analytics.onWrapClick(srcAmount);
      return lib!.wrapNativeToken(srcAmount, priorityFeePerGas, maxFeePerGas);
    },
    {
      onSuccess: () => {
        analytics.onWrapSuccess();
        if (lib?.validateTokens(srcToken!, dstToken!) === TokensValidation.wrapOnly) {
          reset();
          return;
        }
        setSrcToken(lib!.config.wToken);
      },
      onError: (error: Error) => {
        console.log(error.message);
        analytics.onWrapError(error.message);
      },
    }
  );
};

export const useUnwrapToken = () => {
  const lib = useTwapStore((state) => state.lib);
  const { priorityFeePerGas, maxFeePerGas } = useGasPriceQuery();
  const reset = useReset();
  const srcTokenAmount = useTwapStore((state) => state.getSrcAmount());

  return useMutation(
    async () => {
      return lib?.unwrapNativeToken(srcTokenAmount, priorityFeePerGas, maxFeePerGas);
    },
    {
      onSuccess: reset,
    }
  );
};

export const useApproveToken = () => {
  const lib = useTwapStore((state) => state.lib);
  const srcAmount = useTwapStore((state) => state.getSrcAmount());
  const { priorityFeePerGas, maxFeePerGas } = useGasPriceQuery();
  const srcToken = useTwapStore((state) => state.srcToken);
  const { refetch } = useHasAllowanceQuery();

  return useMutation(
    async () => {
      analytics.onApproveClick(srcAmount);
      await lib?.approve(srcToken!, srcAmount, priorityFeePerGas, maxFeePerGas);
      await refetch();
    },
    {
      onSuccess: async () => {
        analytics.onApproveSuccess();
      },
      onError: (error: Error) => {
        console.log(error.message);

        analytics.onApproveError(error.message);
      },
    }
  );
};

export const useOnTokenSelect = (isSrc?: boolean) => {
  const srcSelect = useTwapStore((store) => store.setSrcToken);
  const dstSelect = useTwapStore((store) => store.setDstToken);

  return isSrc ? srcSelect : dstSelect;
};

export const useCreateSimpleLimitOrder = () => {
  return useMutation(async () => {
    return useCreateOrder();
  });
};

export const useCreateOrder = () => {
  const { maxFeePerGas, priorityFeePerGas } = useGasPriceQuery();
  const store = useTwapStore();
  const reset = useReset();
  const { askDataParams } = useTwapContext();
  const setTokensFromDapp = useSetTokensFromDapp();
  return useMutation(
    async () => {
      const fillDelayMillis = (store.getFillDelayUiMillis() - store.lib!.estimatedDelayBetweenChunksMillis()) / 1000;

      console.log({
        srcToken: store.srcToken,
        dstToken: store.dstToken,
        srcAmount: store.getSrcAmount().toString(),
        srcChunkAmount: store.getSrcChunkAmount().toString(),
        dstMinChunkAmountOut: store.getDstMinAmountOut().toString(),
        deadline: store.getDeadline(),
        fillDelay: fillDelayMillis,
        srcUsd: store.srcUsd.toString(),
        priorityFeePerGas: priorityFeePerGas?.toString(),
        maxFeePerGas: maxFeePerGas?.toString(),
      });
      analytics.onConfirmationCreateOrderClick();
      store.setLoading(true);

      const dstToken = {
        ...store.dstToken!,
        address: store.lib!.validateTokens(store.srcToken!, store.dstToken!) === TokensValidation.dstTokenZero ? zeroAddress : store.dstToken!.address,
      };

      return store.lib!.submitOrder(
        store.srcToken!,
        dstToken,
        store.getSrcAmount(),
        store.getSrcChunkAmount(),
        store.getDstMinAmountOut(),
        store.getDeadline(),
        fillDelayMillis,
        store.srcUsd,
        askDataParams,
        priorityFeePerGas,
        maxFeePerGas
      );
    },
    {
      onSuccess: async (id) => {
        analytics.onCreateOrderSuccess(id);
        reset();
        store.setOrderCreatedTimestamp(Date.now());
        setTokensFromDapp();
      },
      onError: (error: Error) => {
        analytics.onCreateOrderError(error.message);
        if ((error as any).code === 4001) {
          analytics.onCreateOrderRejected();
        }
      },

      onSettled: () => {
        store.setLoading(false);
      },
    }
  );
};

export const useInitLib = () => {
  const setTwapLib = useTwapStore((state) => state.setLib);
  const setWrongNetwork = useTwapStore((state) => state.setWrongNetwork);
  return async (props: InitLibProps) => {
    if (!props.provider || !props.account) {
      setTwapLib(undefined);
      setWrongNetwork(undefined);
      return;
    }

    const chain = props.connectedChainId || (await new Web3(props.provider).eth.getChainId());

    const wrongChain = props.config.chainId !== chain;
    setWrongNetwork(wrongChain);
    setTwapLib(wrongChain ? undefined : new TWAPLib(props.config, props.account!, props.provider));
  };
};

export const useUpdateStoreOveride = () => {
  const setStoreOverrideValues = useTwapStore((state) => state.setStoreOverrideValues);

  return useCallback(
    (values?: Partial<State>) => {
      setStoreOverrideValues(values || {});
    },
    [setStoreOverrideValues]
  );
};

export const useChangeNetwork = () => {
  const { config, provider: _provider, account, storeOverride } = useTwapContext();
  const [loading, setLoading] = useState(false);
  const initLib = useInitLib();
  const setInvalidChain = useTwapStore((state) => state.setWrongNetwork);

  const changeNetwork = async (onSuccess: () => void, onError: () => void) => {
    setWeb3Instance(new Web3(_provider));
    try {
      await switchMetaMaskNetwork(config.chainId);
      onSuccess();
    } catch (error) {
      onError();
    }
  };

  const onChangeNetwork = async () => {
    const onSuccess = () => {
      setInvalidChain(false);
      setLoading(false);
      initLib({ config, provider: _provider, account, storeOverride });
    };
    const onError = () => {
      setLoading(false);
    };
    setLoading(true);
    changeNetwork(onSuccess, onError);
  };
  return {
    changeNetwork: onChangeNetwork,
    loading,
  };
};

export const useMarketPrice = () => {
  const [inverted, setInverted] = useState(false);
  const { leftToken, rightToken, marketPriceUi: marketPrice, loading } = useTwapStore((state) => state.getMarketPrice(inverted));

  return {
    leftToken,
    rightToken,
    marketPrice,
    toggleInverted: () => setInverted(!inverted),
    loading,
  };
};

export const useLimitPrice = () => {
  const [inverted, setInverted] = useState(false);
  const translations = useTwapContext().translations;

  const { isLimitOrder, setLimitPrice, custom } = useTwapStore((state) => ({
    isLimitOrder: state.isLimitOrder,
    setLimitPrice: state.setLimitPriceUi,
    custom: state.limitPriceUi.custom,
  }));
  const { limitPriceUi: limitPrice, leftToken, rightToken } = useTwapStore((state) => state.getLimitPrice(inverted));

  const onChange = useCallback(
    (amountUi = "") => {
      setLimitPrice({ priceUi: amountUi, inverted });
    },
    [inverted]
  );

  const toggleInverted = useCallback(() => {
    setInverted(!inverted);
  }, [inverted]);

  const loading = useLoadingState();

  return {
    toggleInverted,
    onChange,
    limitPrice,
    leftToken,
    rightToken,
    warning: !leftToken || !rightToken ? translations?.selectTokens : undefined,
    isLimitOrder,
    isLoading: loading.srcUsdLoading || loading.dstUsdLoading,
    custom,
  };
};

export const useCustomActions = () => {
  const onPercentClick = useTwapStore((store) => store.setSrcAmountPercent);

  return { onPercentClick };
};

export const useCancelOrder = () => {
  const lib = useTwapStore((state) => state.lib);
  const { refetch } = useOrdersHistoryQuery();
  const { priorityFeePerGas, maxFeePerGas } = useGasPriceQuery();
  return useMutation(
    async (orderId: number) => {
      analytics.onCancelOrderClick(orderId);
      return lib?.cancelOrder(orderId, priorityFeePerGas, maxFeePerGas);
    },
    {
      onSuccess: (_result, orderId) => {
        analytics.onCancelOrderSuccess(orderId.toString());
        refetch();
      },
      onError: (error: Error) => {
        analytics.onCancelOrderError(error.message);
      },
    }
  );
};

export const useHistoryPrice = (order: OrderUI) => {
  const [inverted, setInverted] = useState(false);

  const price = inverted ? BN(1).div(order.ui.dstPriceFor1Src) : order.ui.dstPriceFor1Src;
  return {
    inverted,
    toggleInverted: () => setInverted(!inverted),
    price,
    priceUi: price.toFormat(),
    leftToken: inverted ? order.ui.dstToken : order.ui.srcToken,
    rightToken: !inverted ? order.ui.dstToken : order.ui.srcToken,
  };
};

export const useLoadingState = () => {
  const srcToken = useTwapStore((store) => store.srcToken);
  const dstToken = useTwapStore((store) => store.dstToken);
  const srcUSD = useSrcUsd();
  const dstUSD = useDstUsd();
  const srcBalance = useSrcBalance();

  const dstBalance = useDstBalance();

  return {
    srcUsdLoading: (srcToken && !srcUSD.data) || srcUSD.isLoading,
    dstUsdLoading: (dstToken && !dstUSD.data) || dstUSD.isLoading,
    srcBalanceLoading: srcBalance.isLoading,
    dstBalanceLoading: dstBalance.isLoading,
  };
};

export const useSrcUsd = () => {
  const state = useTwapStore();
  return useUsdValueQuery(state.srcToken, state.setSrcUsd);
};

export const useDstUsd = () => {
  const state = useTwapStore();
  return useUsdValueQuery(state.dstToken, state.setDstUsd);
};

export const useSrcBalance = () => {
  const state = useTwapStore();

  return useBalanceQuery(state.srcToken, state.setSrcBalance);
};

export const useDstBalance = () => {
  const state = useTwapStore();
  return useBalanceQuery(state.dstToken, state.setDstBalance);
};

/**
 * Queries
 */

export const useHasAllowanceQuery = () => {
  const { lib, amount, srcToken } = useTwapStore((state) => ({
    lib: state.lib,
    amount: state.getSrcAmount(),
    srcToken: state.srcToken,
  }));
  const query = useQuery([QueryKeys.GET_ALLOWANCE, lib?.config.chainId, srcToken?.address, amount.toString()], () => lib!.hasAllowance(srcToken!, amount), {
    enabled: !!lib && !!srcToken && amount.gt(0),
    staleTime: STALE_ALLOWANCE,
    refetchOnWindowFocus: true,
  });
  return { ...query, isLoading: query.isLoading && query.fetchStatus !== "idle" };
};

const useGetPriceUsdCallback = () => {
  const lib = useTwapStore((state) => state.lib);

  return async (token?: TokenData): Promise<BN> => {
    if (!lib) return BN(0);
    return new BN(await lib?.priceUsd(token!));
  };
};

const useUsdValueQuery = (token?: TokenData, onSuccess?: (value: BN) => void) => {
  const lib = useTwapStore((state) => state.lib);
  const priceUsd = useGetPriceUsdCallback();
  const query = useQuery([QueryKeys.GET_USD_VALUE, token?.address], async () => priceUsd(token!), {
    enabled: !!lib && !!token,
    onSuccess,
    refetchInterval: REFETCH_USD,
  });

  return { ...query, isLoading: query.isLoading && query.fetchStatus !== "idle" };
};
export const useBalanceQuery = (token?: TokenData, onSuccess?: (value: BN) => void, staleTime?: number) => {
  const lib = useTwapStore((state) => state.lib);

  const query = useQuery([QueryKeys.GET_BALANCE, lib?.maker, token?.address], () => lib!.makerBalance(token!), {
    enabled: !!lib && !!token,
    onSuccess,
    refetchInterval: REFETCH_BALANCE,
    staleTime,
  });
  return { ...query, isLoading: query.isLoading && query.fetchStatus !== "idle" };
};

const useGasPriceQuery = () => {
  const { maxFeePerGas, priorityFeePerGas } = useTwapContext();
  const lib = useTwapStore((state) => state.lib);

  const { isLoading, data } = useQuery([QueryKeys.GET_GAS_PRICE, priorityFeePerGas, maxFeePerGas], () => estimateGasPrice(), {
    enabled: !!lib && !BN(maxFeePerGas || 0).gt(0) && !BN(priorityFeePerGas || 0).gt(0),
    refetchInterval: REFETCH_GAS_PRICE,
  });

  return {
    isLoading,
    maxFeePerGas: BN.max(data?.fast.max || 0, maxFeePerGas || 0, priorityFeePerGas || 0),
    priorityFeePerGas: BN.max(data?.fast.tip || 0, priorityFeePerGas || 0),
  };
};

const useTokenList = () => {
  const tokens = useTwapContext().tokenList || [];
  const lib = useTwapStore((store) => store.lib);

  const tokensLength = _.size(tokens);

  return useMemo(() => {
    if (!lib || !tokensLength) return [];
    if (!tokens.find((it: TokenData) => lib.isNativeToken(it))) {
      tokens.push(lib.config.nativeToken);
    }
    if (!tokens.find((it: TokenData) => lib.isWrappedToken(it))) {
      tokens.push(lib.config.wToken);
    }
    return tokens;
  }, [lib, tokensLength]);
};

export const useOrdersHistoryQuery = (_priceUsd?: (token: TokenData) => Promise<BN>) => {
  const tokenList = useTokenList();

  const orderCreatedTimestamp = useTwapStore((state) => state.orderCreatedTimestamp);
  const lib = useTwapStore((state) => state.lib);
  const getUsdValues = usePrepareUSDValues(_priceUsd);

  const query = useQuery<OrdersData>(
    [QueryKeys.GET_ORDER_HISTORY, lib?.maker, lib?.config.chainId, orderCreatedTimestamp],
    async () => {
      const orders = await lib!.getAllOrders();

      const tokens = _.compact(
        _.uniqBy(
          _.concat(
            _.map(orders, (o) => _.find(tokenList, (t) => eqIgnoreCase(t.address, o.ask.srcToken))!),
            _.map(orders, (o) => _.find(tokenList, (t) => eqIgnoreCase(t.address, o.ask.dstToken))!)
          ),
          (t) => (t ? t.address : undefined)
        )
      );

      const tokensWithUsd = await getUsdValues(tokens);
      const parsedOrders = orders.map((o: Order) => {
        try {
          return parseOrderUi(lib!, tokensWithUsd, o);
        } catch (error) {
          return undefined;
        }
      });

      return _.chain(_.compact(parsedOrders))
        .orderBy((o: OrderUI) => o.order.time, "desc")
        .groupBy((o: OrderUI) => o.ui.status)
        .value();
    },
    {
      enabled: !!lib && _.size(tokenList) > 0,
      refetchInterval: REFETCH_ORDER_HISTORY,
      onError: (error: any) => console.log(error),
      refetchOnWindowFocus: true,
      retry: 5,
    }
  );
  return { ...query, orders: query.data || {}, isLoading: query.isLoading && query.fetchStatus !== "idle" };
};

export const usePrepareUSDValues = (_priceUsd?: (token: TokenData) => Promise<BN>) => {
  const client = useQueryClient();
  const priceUsd = useGetPriceUsdCallback();

  const { mutateAsync: fetchUsdMutation } = useMutation(
    (token: TokenData) => {
      return _priceUsd ? _priceUsd(token) : priceUsd(token);
    },
    {
      onError: (error: any, token) => console.debug({ error, token }),
    }
  );

  return async (tokens: TokenData[] = []) => {
    return Promise.allSettled(
      tokens.map((token) =>
        client
          .ensureQueryData({
            queryKey: [QueryKeys.GET_USD_VALUE, token.address],
            queryFn: () => fetchUsdMutation(token),
          })
          .then((usd) => _.merge({}, token, { usd }))
      )
    ).then((results) => _.compact(_.map(results, (r) => (r.status === "fulfilled" ? r.value : undefined))));
  };
};

export const useSetTokensFromDapp = () => {
  const context = useTwapContext();

  const srcTokenAddressOrSymbol = context.srcToken;
  const dstTokenAddressOrSymbol = context.dstToken;

  const setSrcToken = useTwapStore((state) => state.setSrcToken);
  const setDstToken = useTwapStore((state) => state.setDstToken);
  const tokensList = useTokenList();
  const tokensReady = _.size(tokensList) > 0;

  const wrongNetwork = useTwapStore((store) => store.wrongNetwork);

  return useCallback(() => {
    if (!tokensReady || wrongNetwork || wrongNetwork == null) return;

    if (srcTokenAddressOrSymbol) {
      const srcToken = getTokenFromTokensList(tokensList, srcTokenAddressOrSymbol);

      setSrcToken(srcToken);
    }
    if (dstTokenAddressOrSymbol) {
      const dstToken = getTokenFromTokensList(tokensList, dstTokenAddressOrSymbol);
      setDstToken(dstToken);
    }
  }, [srcTokenAddressOrSymbol, dstTokenAddressOrSymbol, tokensReady, wrongNetwork]);
};

export const useParseTokens = (dappTokens: any, parseToken?: (rawToken: any) => TokenData | undefined): TokenData[] => {
  const listLength = _.size(dappTokens);

  const parse = parseToken ? parseToken : (t: any) => t;

  return useMemo(() => _.compact(_.map(dappTokens, parse)), [listLength]);
};

export const useOrderPastEvents = (order: OrderUI, enabled?: boolean) => {
  const lib = useTwapStore((store) => store.lib);
  const getPriceUsd = useGetPriceUsdCallback();
  const [haveValue, setHaveValue] = useState(false);

  const _enabled = haveValue ? true : !!enabled;

  return useQuery(
    ["useOrderPastEvents", order.order.id, lib?.maker, order.ui.progress],
    async () => {
      const orderEndDate = Math.min(order.order.ask.deadline, (await block()).timestamp);
      const [orderStartBlock, orderEndBlock] = await Promise.all([findBlock(order.order.time * 1000), findBlock(orderEndDate * 1000)]);

      logger({
        order,
        orderTime: moment(order.order.time * 1000).format("DD/MM/YYYY HH:mm:ss"),
        orderStartBlock: orderStartBlock.number,
        orderDeadline: moment(order.order.ask.deadline * 1000).format("DD/MM/YYYY HH:mm:ss"),
        orderEndBlock: orderEndBlock.number,
      });

      const [events, priceUsd1Token] = await Promise.all([
        getPastEvents({
          contract: lib!.twap,
          eventName: "OrderFilled",
          filter: {
            maker: lib!.maker,
            id: order.order.id,
          },
          fromBlock: orderStartBlock.number,
          toBlock: orderEndBlock.number,
          // maxDistanceBlocks: 2_000,
        }),
        getPriceUsd(order.ui.dstToken),
      ]);

      const dstAmountOut = _.reduce(
        events,
        (sum, event) => {
          return sum.plus(event.returnValues.dstAmountOut);
        },
        BN(0)
      );

      return {
        dstAmountOut: amountUi(order.ui.dstToken, dstAmountOut),
        dstAmountOutUsdPrice: amountUi(order.ui.dstToken, dstAmountOut.times(priceUsd1Token)),
      };
    },
    {
      enabled: !!lib && !!_enabled,
      retry: 5,
      staleTime: Infinity,
      onSuccess: () => setHaveValue(true),
    }
  );
};

export const useFormatNumber = ({ value, decimalScale = 3, prefix, suffix }: { value?: string | number; decimalScale?: number; prefix?: string; suffix?: string }) => {
  const result = useNumericFormat({
    allowLeadingZeros: true,
    thousandSeparator: ",",
    displayType: "text",
    value: value || "",
    decimalScale,
    prefix,
    suffix,
  });

  return result.value?.toString();
};

export const useSrcAmountNotZero = () => {
  const value = useTwapStore((store) => store.getSrcAmount());

  return value.gt(0);
};

export const useResetLimitPrice = () => {
  return useTwapStore((store) => store.setLimitOrderPriceUi);
};

export const useOnTokenSelectCallback = () => {
  const setSrcToken = useTwapStore((store) => store.setSrcToken);
  const setDstToken = useTwapStore((store) => store.setDstToken);

  return useCallback(
    (isSrc: boolean, token: any, parsedToken?: TokenData, onSrcSelect?: (token: any) => void, onDstSelect?: (token: any) => void) => {
      if (isSrc) {
        analytics.onSrcTokenClick(parsedToken?.symbol);
        setSrcToken(parsedToken);
        onSrcSelect?.(token);
      } else {
        analytics.onDstTokenClick(parsedToken?.symbol);
        setDstToken(parsedToken);
        onDstSelect?.(token);
      }
    },
    [setSrcToken, setDstToken]
  );
};

export const useToken = (isSrc?: boolean) => {
  const srcTokenLogo = useTwapStore((store) => store.srcToken);
  const dstTokenLogo = useTwapStore((store) => store.dstToken);

  return isSrc ? srcTokenLogo : dstTokenLogo;
};

export const useSwitchTokens = () => {
  const { dappTokens } = useTwapContext();
  const switchTokens = useTwapStore((s) => s.switchTokens);
  const srcToken = useTwapStore((s) => s.srcToken);
  const dstToken = useTwapStore((s) => s.dstToken);
  return useCallback(
    (onSrcTokenSelected?: (token: any) => void, onDstTokenSelected?: (token: any) => void) => {
      switchTokens();
      const _srcToken = getTokenFromTokensList(dappTokens, srcToken?.address || srcToken?.symbol);
      const _dstToken = getTokenFromTokensList(dappTokens, dstToken?.address || dstToken?.symbol);

      srcToken && onSrcTokenSelected?.(_dstToken);
      dstToken && onDstTokenSelected?.(_srcToken);
    },
    [_.size(dappTokens), srcToken?.address, srcToken?.symbol, dstToken?.address, dstToken?.symbol]
  );
};

export const useOrdersTabs = () => {
  const { data: orders, dataUpdatedAt } = useOrdersHistoryQuery();

  const _orders = orders || {};

  const {
    uiPreferences: { orderTabsToExclude = ["All"] },
  } = useTwapContext();

  return useMemo(() => {
    const keys = ["All", ..._.keys(Status)];

    const res = _.filter(keys, (it) => !orderTabsToExclude?.includes(it));
    const mapped = _.map(res, (it) => {
      if (it === "All") {
        return { All: _.size(_.flatMap(_orders)) || 0 };
      }
      return { [it]: _.size(_orders[it as Status]) || 0 };
    });

    return _.reduce(mapped, (acc, it) => ({ ...acc, ...it }), {});
  }, [dataUpdatedAt]);
};
