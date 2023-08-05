import { extendTheme } from "@chakra-ui/react";
import { mode, Styles } from "@chakra-ui/theme-tools";

import { Button } from "./Button";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const components = {
  Button,
};

const colors = {
  grey: {
    50: "#FCFDFE",
    100: "#F1FEF4",
    150: "#1c2030",
    200: "#262c3b",
    250: "#363c4f",
    300: "#191f2d",
    350: "#131722",
  },
  green: {
    950: "#2cac40",
    1000: "#2a8c40",
  },
  red: {
    950: "#db4921",
    1000: "#ae4236",
  },
};

const styles: Styles = {
  global: (props) => ({
    body: {
      bg: mode("grey.50", "grey.300 !important")(props),
    },
  }),
};

export const theme = extendTheme({ config, styles, components, colors });
