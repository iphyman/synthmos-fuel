"use client";

import { defineStyleConfig } from "@chakra-ui/react";

export const Button = defineStyleConfig({
  baseStyle: {},
  variants: {
    navbar: {
      bg: "transparent",
      color: "gray.600",
      _dark: {
        color: "gray.400",
        _hover: {
          color: "white",
        },
      },
      _hover: {
        bg: "transparent",
        color: "gray.900",
      },
    },
    darkgreen: {
      bg: "transparent",
      color: "#2cac40",
      border: "1px solid #2cac40",
      _hover: {
        bg: "#2cac40",
        color: "white",
      },
    },
    high: {
      w: "full",
      h: "7rem",
      bg: "green.950",
      color: "white",
      flexDirection: "column",
      _hover: {
        bg: "green.1000",
        color: "white",
      },
    },
    low: {
      w: "full",
      h: "7rem",
      bg: "red.950",
      color: "white",
      flexDirection: "column",
      _hover: {
        bg: "red.1000",
        color: "white",
      },
    },
    tooltip: {
      boxSize: "10px",
      minW: "10px",
      bg: "transparent",
      padding: "0px",
      color: "whiteAlpha.600",
      _hover: {
        color: "white",
      },
    },
  },
});
