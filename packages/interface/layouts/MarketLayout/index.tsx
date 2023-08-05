"use client";

import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Footer, Navbar } from "@app/components/Navbar";

export function MarketLayout({ children }: { children: ReactNode }) {
  return (
    <Flex flexDirection="column" minH="100vh">
      <Navbar />
      <Flex w="full" h="full" flex={1} px="1.5rem">
        {children}
      </Flex>
      <Footer />
    </Flex>
  );
}
