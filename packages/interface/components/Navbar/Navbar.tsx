'use client';

import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  VStack,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import { FaGithub, FaMoon, FaPlus, FaSun, FaYoutube } from 'react-icons/fa';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Web3Status } from '../Web3Status';

const DepositModal = dynamic(() => import('../Modals/Deposit'), {
  ssr: false,
});

export function Navbar() {
  const { toggleColorMode } = useColorMode();
  const ColorModeIcon = useColorModeValue(FaMoon, FaSun);
  const themeLabel = useColorModeValue('dark', 'light');
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Box
        width="full"
        position="sticky"
        top="0px"
        boxShadow="sm"
        transition="all ease 0.2s 0s"
        _dark={{ bg: 'grey.350' }}
        _light={{ bg: 'white' }}
        borderBottom="1px solid"
        borderColor="grey.250"
        zIndex={300}
      >
        <Box width="full" height="4.5rem" padding="0px 1.5rem" margin="0 auto">
          <Flex
            width="full"
            height="full"
            justifyContent="space-between"
            alignItems="center"
          >
            <HStack alignItems="center" spacing="1rem">
              <Link
                href="/"
                fontSize="1.5rem"
                fontWeight={900}
                _hover={{ textDecor: 'none' }}
              >
                <HStack>
                  <Box pos="relative" boxSize="36px">
                    <Image src="/logo-c.png" fill alt="logo icon" />
                  </Box>
                  <Box pos="relative" w="160px" h="36px">
                    <Image src="/logo-m.png" alt="logo text" fill />
                  </Box>
                </HStack>
              </Link>
              <Button
                w="9rem"
                h="3rem"
                padding="0px 12px"
                colorScheme="grey"
                alignItems="center"
                justifyContent="flex-start"
                borderBottom="3px solid #ae4236"
                borderRadius="0px"
              >
                <HStack>
                  <AvatarGroup>
                    <Avatar
                      src="/BTC.png"
                      name="BTC"
                      boxSize="1.5rem"
                      ignoreFallback
                    />
                    <Avatar
                      src="/USD.png"
                      name="USD"
                      boxSize="1.5rem"
                      ignoreFallback
                    />
                  </AvatarGroup>
                  <VStack spacing="0px" alignItems="flex-start">
                    <Text color="white" fontSize="13px" fontWeight={600}>
                      BTC/USD
                    </Text>
                    <Text
                      color="whiteAlpha.600"
                      fontSize="11px"
                      fontWeight={600}
                    >
                      Crypto
                    </Text>
                  </VStack>
                </HStack>
              </Button>
              <IconButton
                variant="outline"
                colorScheme="gray"
                boxSize="3rem"
                fontSize="1.5rem"
                aria-label="markets"
                icon={<FaPlus />}
              />
            </HStack>
            <Flex
              alignItems="center"
              justifyContent="flex-end"
              width="full"
              maxWidth="68rem"
            >
              <HStack spacing="5">
                <Link
                  href="https://github.com/iphyman/synthmos-fuel"
                  isExternal
                  aria-label="view synthmos source code"
                >
                  <Icon
                    boxSize="5"
                    display="block"
                    transition="color 0.2s ease"
                    _hover={{ color: 'gray.600' }}
                    as={FaGithub}
                  />
                </Link>
                <Link href="/" isExternal aria-label="view synthmos source code">
                  <Icon
                    boxSize="5"
                    display="block"
                    transition="color 0.2s ease"
                    _hover={{ color: 'gray.600' }}
                    as={FaYoutube}
                  />
                </Link>
              </HStack>
              <HStack spacing="5">
                <IconButton
                  color="current"
                  variant="ghost"
                  fontSize="lg"
                  size="md"
                  ml={{ base: '0', md: '3' }}
                  onClick={toggleColorMode}
                  icon={<ColorModeIcon />}
                  aria-label={`Switch to ${themeLabel} mode`}
                />
                <Web3Status />
                <Button variant="darkgreen" p="1.5rem" onClick={onOpen}>
                  Deposit
                </Button>
              </HStack>
            </Flex>
          </Flex>
        </Box>
      </Box>
      <DepositModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
