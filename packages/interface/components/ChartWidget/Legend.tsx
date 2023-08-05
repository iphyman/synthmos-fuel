"use client";

import {
  Avatar,
  AvatarGroup,
  Box,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

export function Legend() {
  return (
    <Box position="absolute" zIndex="tooltip">
      <HStack>
        <AvatarGroup>
          <Avatar src="/BTC.png" name="BTC" boxSize="1.5rem" ignoreFallback />
          <Avatar src="/USD.png" name="USD" boxSize="1.5rem" ignoreFallback />
        </AvatarGroup>
        <VStack spacing="2px" alignItems="flex-start">
          <HStack spacing="0px">
            <Text color="white" fontWeight={600} textTransform="uppercase">
              BTC
            </Text>
            <Text color="white">/</Text>
            <Text color="white" fontWeight={600} textTransform="uppercase">
              USD
            </Text>
          </HStack>
          <Text fontSize="12px" fontWeight={600} color="whiteAlpha.600">
            Crypto
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}
