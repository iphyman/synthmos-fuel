"use client";

import { Box } from "@chakra-ui/react";
import {
  Coordinate,
  LastPriceAnimationMode,
  createChart,
} from "lightweight-charts";
import { useEffect, useRef } from "react";
import { shallow } from "zustand/shallow";
import { useMarketStore, useOracleStream } from "@app/hooks";
import { Legend } from "./Legend";
import { marketGesture } from "./marketGesture";
import { CHART_CONFIG } from "@app/configs";

export default function ChartWidget() {
  useOracleStream(
    "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43"
  );

  const chartWidgetRef = useRef<HTMLDivElement>(null);
  const [priceFeed, marketGestureAction, price] = useMarketStore(
    (state) => [state.priceFeed, state.marketGesture, state.price],
    shallow
  );

  useEffect(() => {
    const currentRef = chartWidgetRef.current;
    let highlight: HTMLDivElement | null = null;

    const chart = createChart(currentRef!, CHART_CONFIG);

    const series = chart.addLineSeries({
      lineWidth: 1,
      lastPriceAnimation: LastPriceAnimationMode.Continuous,
      color: "#ffffff",
      crosshairMarkerVisible: false,
    });

    series.setData(priceFeed);
    let cordinate: Coordinate | null = null;

    if (priceFeed.length > 0) {
      const lastPrice = priceFeed[priceFeed.length - 1].value;
      cordinate = lastPrice ? series.priceToCoordinate(lastPrice) : null;
    }

    highlight = marketGesture(cordinate, marketGestureAction);
    highlight && currentRef?.appendChild(highlight);

    return () => {
      chart.remove();
      highlight &&
        currentRef?.contains(highlight) &&
        currentRef?.removeChild(highlight);
    };
  }, [chartWidgetRef, priceFeed, marketGestureAction, price]);

  return (
    <Box
      id="chart-widget-container"
      w="full"
      h="full"
      pr="1rem"
      position="relative"
    >
      <Legend />
      <Box
        w="full"
        h="full"
        id="synthmos-chart-widget"
        ref={chartWidgetRef}
        position="relative"
      />
    </Box>
  );
}
