"use client";

import { Box } from "@chakra-ui/react";
import { Coordinate } from "lightweight-charts";

export function Highlight({
  isLow,
  isHigh,
  cordinate,
}: {
  isLow: boolean;
  isHigh: boolean;
  cordinate: Coordinate;
}) {
  return (
    <Box
      position="absolute"
      w="full"
      h={`calc((100% - ${cordinate.toString()}px) - 32px)`}
      display="flex"
      top={`${cordinate.toString()}px`}
      bgImage={
        isLow
          ? "linear-gradient(to bottom,rgba(219, 73, 33, 0.3),transparent)"
          : isHigh
          ? "linear-gradient(to bottom,rgba(42, 141, 64, 0.3),transparent)"
          : ""
      }
      transform={isHigh ? "rotate(180deg) translate(0, 100%)" : ""}
    />
  );
}
