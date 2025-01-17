import Modal from "@mui/material/Modal";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { AiOutlineClose } from "react-icons/ai";
import {
  StyledCloseIcon,
  StyledDappLayoutContent,
  StyledDrawerContent,
  StyledListToken,
  StyledMenuDrawer,
  StyledMenuList,
  StyledMenuListItemButton,
  StyledMenuLogo,
  StyledMenuMobileToggle,
  StyledSearchInput,
  StyledThemeToggle,
  StyledTokens,
  StyledTokensList,
  StyledUISelector,
  StyledUISelectorButton,
} from "./styles";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FiMenu } from "react-icons/fi";
import Backdrop from "@mui/material/Backdrop";
import { Fade } from "@mui/material";
import { Config } from "@orbs-network/twap";
import { Components, hooks, Styles } from "@orbs-network/twap-ui";
import { eqIgnoreCase } from "@defi.org/web3-candies";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import { dapps } from "./config";
import { Status } from "./Status";
import { useBalance, useDebounce, useDisconnectWallet, useNetwork, useSelectedDapp, useTheme } from "./hooks";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { TokenData } from "@orbs-network/twap";
import { SelectorOption, TokenListItem } from "./types";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { network } from "@defi.org/web3-candies";
import { useFormatNumber } from "@orbs-network/twap-ui/dist/hooks";

const FAVICON = "https://raw.githubusercontent.com/orbs-network/twap-ui/master/logo/64.png";

export interface Dapp {
  config: Config;
  logo: string;
  Component: any;
  invertLogo?: boolean;
  theme?: "light" | "dark";
  workInProgress?: boolean;
}

export const Popup = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: ReactNode }) => {
  return (
    <Modal open={isOpen} onClose={onClose} onBackdropClick={onClose}>
      <>
        <StyledCloseIcon onClick={onClose}>
          <AiOutlineClose className="icon" />
        </StyledCloseIcon>
        <Fade in={isOpen}>
          <div>{children}</div>
        </Fade>
      </>
    </Modal>
  );
};

export const MetaTags = ({ title }: { title: string }) => {
  return (
    <Helmet>
      <link rel="icon" href={FAVICON} />
      <title>TWAP On {title}</title>
    </Helmet>
  );
};

const ToggleTheme = () => {
  const { selectedDapp } = useSelectedDapp();
  const showLight = !selectedDapp?.theme || selectedDapp.theme === "light";
  const showDark = !selectedDapp?.theme || selectedDapp.theme === "dark";
  const size = 18;
  const { setTheme, isDarkTheme } = useTheme();
  return (
    <StyledThemeToggle>
      {showLight && (
        <button
          style={{
            opacity: isDarkTheme ? 0.5 : 1,
          }}
          onClick={() => setTheme("light")}
        >
          <BsFillSunFill style={{ width: size, height: size }} />
        </button>
      )}
      {showDark && (
        <button
          style={{
            opacity: !isDarkTheme ? 0.5 : 1,
          }}
          onClick={() => setTheme("dark")}
        >
          <BsFillMoonFill style={{ width: size, height: size }} />
        </button>
      )}
    </StyledThemeToggle>
  );
};

const drawerWidth = 260;

export const DappsMenu = () => {
  const { isSelected } = useSelectedDapp();

  const isMobile = useMediaQuery("(max-width:1200px)");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const disconnect = useDisconnectWallet();
  const reset = hooks.useResetStore();
  const onSelect = (dapp: Dapp) => {
    reset();
    disconnect();
    navigate(`/${dapp.config.name.toLowerCase()}`);
  };

  const open = !isMobile ? true : isMobile && isOpen;

  const handleDrawerToggle = () => {
    setIsOpen(!isOpen);
  };

  const onSelectClick = (dapp: Dapp) => {
    if (isMobile) {
      setIsOpen(false);
    }
    onSelect(dapp);
  };

  return (
    <>
      {isMobile && (
        <StyledMenuMobileToggle className="menu-button" color="inherit" edge="start" onClick={handleDrawerToggle}>
          <FiMenu />
        </StyledMenuMobileToggle>
      )}
      <StyledMenuDrawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "rgb(16, 23, 38)",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Backdrop open={isMobile && isOpen} onClick={() => setIsOpen(false)} />

        <StyledDrawerContent>
          <ToggleTheme />
          <StyledMenuList>
            {dapps.map((dapp) => (
              <ListItem onClick={() => onSelectClick(dapp)} key={dapp.config.name.toLowerCase()} disablePadding selected={isSelected(dapp)}>
                <StyledMenuListItemButton>
                  <div>
                    <StyledMenuLogo src={network(dapp.config.chainId).logoUrl} style={{ width: 16, height: 16 }} />
                    <StyledMenuLogo src={dapp.logo} width={32} height={32} style={{ filter: dapp.invertLogo ? "invert(100%)" : "unset" }} />
                  </div>
                  <ListItemText primary={`${dapp.workInProgress ? "[WIP]" : dapp.config.name}`} />
                </StyledMenuListItemButton>
              </ListItem>
            ))}
          </StyledMenuList>
          <Status />
        </StyledDrawerContent>
      </StyledMenuDrawer>
    </>
  );
};

export const DappLayout = ({ children, name, className }: { children: ReactNode; name: string; className?: string }) => {
  return (
    <>
      <MetaTags title={name} />
      <DappsMenu />
      <StyledDappLayoutContent className={className}>{children}</StyledDappLayoutContent>
    </>
  );
};

export const TokenSearchInput = ({ setValue }: { value: string; setValue: (value: string) => void }) => {
  const [localValue, setLocalValue] = useState("");
  const debouncedValue = useDebounce(localValue, 300);

  useEffect(() => {
    setValue(debouncedValue);
  }, [debouncedValue]);

  return <StyledSearchInput placeholder="Insert token name..." value={localValue} onChange={(e) => setLocalValue(e.target.value)} />;
};

const Row = (props: any) => {
  const { index, style, data } = props;

  const item: TokenListItem = data.tokens[index];
  const { balance, isLoading } = useBalance(item.token);

  const formattedValue = useFormatNumber({ value: balance, decimalScale: 6 });

  if (!item) return null;
  return (
    <div style={style}>
      <StyledListToken onClick={() => data.onClick(item.rawToken)}>
        <Styles.StyledRowFlex justifyContent="flex-start" style={{ width: "unset", flex: 1 }}>
          <Components.Base.TokenLogo
            logo={item.token.logoUrl}
            alt={item.token.symbol}
            style={{
              width: 30,
              height: 30,
            }}
          />
          {item.token.symbol}
        </Styles.StyledRowFlex>
        <Components.Base.SmallLabel loading={isLoading} className="balance">
          {formattedValue}
        </Components.Base.SmallLabel>
      </StyledListToken>
    </div>
  );
};

const filterTokens = (list: TokenListItem[], filterValue: string) => {
  if (!filterValue) return list;
  return _.filter(list, (it) => {
    return it.token.symbol.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0 || eqIgnoreCase(it.token.address, filterValue);
  });
};

interface TokensListProps {
  tokens?: TokenListItem[];
  onClick: (token: TokenData) => void;
}

export const TokensList = ({ tokens = [], onClick }: TokensListProps) => {
  const [filterValue, setFilterValue] = useState("");
  const tokensLength = _.size(tokens);

  const filteredTokens = useMemo(() => filterTokens(tokens, filterValue), [filterValue, tokensLength]);

  return (
    <StyledTokens>
      <TokenSearchInput setValue={setFilterValue} value={filterValue} />
      <StyledTokensList>
        <AutoSizer>
          {({ height, width }: any) => (
            <List
              overscanCount={30}
              className="List"
              itemData={{ tokens: filteredTokens, onClick }}
              height={height || 0}
              itemCount={filteredTokens.length}
              itemSize={50}
              width={width || 0}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </StyledTokensList>
    </StyledTokens>
  );
};

interface UIOption {
  title: string;
  component?: ReactNode;
}

export const UISelector = ({
  options,
  className = "",
  select,
  limit,
  selected,
}: {
  options?: UIOption[];
  className?: string;
  select?: (value: SelectorOption) => void;
  limit?: boolean;
  selected?: SelectorOption;
}) => {
  const tabs = limit ? [SelectorOption.TWAP, SelectorOption.LIMIT] : [SelectorOption.TWAP];

  return (
    <StyledUISelector className={`ui-selector ${className}`}>
      {tabs.map((it) => {
        return (
          <StyledUISelectorButton className={`${selected === it ? " ui-selector-btn-selected" : ""} ui-selector-btn`} key={it} onClick={() => select?.(it)}>
            {it}
          </StyledUISelectorButton>
        );
      })}
    </StyledUISelector>
  );
};
