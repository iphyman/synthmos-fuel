"use client";

import { Box, chakra } from "@chakra-ui/react";
import { useLayoutEffect, useRef } from "react";
import jazzicon from "@metamask/jazzicon";

export const Identicon = ({ seed, size }: { seed: string; size?: number }) => {
  const iconSize = size || 24;
  const iconRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const current = iconRef.current;
    const icon = jazzicon(iconSize, parseInt(seed.slice(2, 10), 16));

    if (icon) {
      current?.appendChild(icon);

      return () => {
        try {
          current?.removeChild(icon);
        } catch (error) {
          console.error("no avatar rendered");
        }
      };
    }
    return;
  }, [iconRef, iconSize, seed]);

  return (
    <Box
      boxSize={`${iconSize}px`}
      fontSize="initial"
      borderRadius="50%"
      marginRight="4px"
    >
      <chakra.span ref={iconRef} />
    </Box>
  );
};
