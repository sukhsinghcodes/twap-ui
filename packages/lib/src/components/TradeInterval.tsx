import { Typography } from "@mui/material";
import { styled } from "@mui/system";
import InfoIconTooltip from "../base-components/InfoIconTooltip";
import TimeSelect from "../base-components/TimeSelect";
import { useTradeInterval } from "../store/store";
import { StyledBorderWrapper, StyledShadowContainer } from "../styles";

function TradeInterval() {
  const { setMillis, millis, timeFormat, setTimeFormat } = useTradeInterval();
  return (
    <StyledContainer>
      <StyledTitle>
        <InfoIconTooltip text="some-text">
          <Typography>Trade Interval</Typography>
        </InfoIconTooltip>
      </StyledTitle>
      <TimeSelect setMillis={setMillis} millis={millis} timeFormat={timeFormat} setTimeFormat={setTimeFormat} />
    </StyledContainer>
  );
}

export default TradeInterval;

const StyledContainer = styled(StyledBorderWrapper)({});

const StyledTitle = styled(StyledShadowContainer)({
  paddingRight: 20,
  paddingLeft: 14,
});
