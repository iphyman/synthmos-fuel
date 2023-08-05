'use client';

import ChartWidget from '@app/components/ChartWidget';
import Sidebar from '@app/components/Sidebar';
import { useMarketData } from '@app/hooks/useMarketData';
import { Flex } from '@chakra-ui/react';

export default function HomeView() {
  useMarketData();

  return (
    <>
      <Flex
        flex={1}
        bgImage="/map.png"
        bgPosition="center"
        bgSize="contain"
        position="relative"
      >
        <ChartWidget />
      </Flex>
      <Sidebar />
    </>
  );
}
