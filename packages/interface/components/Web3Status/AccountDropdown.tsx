'use client';

import {
  HStack,
  Icon,
  Popover,
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  chakra,
  Flex,
  IconButton,
  useClipboard,
  Text,
  Tooltip,
  useColorModeValue,
  Box,
  Button,
} from '@chakra-ui/react';
import { FaExternalLinkAlt, FaPowerOff, FaRegCopy } from 'react-icons/fa';
import { IoChevronDownOutline, IoChevronUpOutline } from 'react-icons/io5';
import { shortenAddress } from '@app/utils';
import { useSynthBalance, useWallet } from '@app/hooks';

import { Identicon } from './Identicon';

const TriggerButton = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  const { account } = useWallet();

  return (
    <PopoverAnchor>
      <chakra.span>
        <PopoverTrigger>
          <Button
            display="flex"
            alignItems="center"
            padding="8px"
            marginRight="2px"
            marginLeft="2px"
            h="full"
            borderRadius="full"
            _focus={{ outline: 'none' }}
            cursor="pointer"
            userSelect="none"
            _hover={{ border: 'sm' }}
            pos="relative"
            onClick={onClick}
          >
            <HStack spacing="4px">
              {account && <Identicon size={32} seed={account} />}
              <Text>{account && shortenAddress(account)}</Text>
              <Icon
                as={isOpen ? IoChevronUpOutline : IoChevronDownOutline}
                boxSize="20px"
              />
            </HStack>
          </Button>
        </PopoverTrigger>
      </chakra.span>
    </PopoverAnchor>
  );
};

export const AccountDropdown = () => {
  const { account } = useWallet();

  const { isOpen, onToggle, onClose } = useDisclosure();
  const { onCopy, hasCopied } = useClipboard(account || '');

  const { formatted } = useSynthBalance();

  const disconnect = () => {
    window.fuel?.disconnect();
    window.location.reload();
  };

  return (
    <Popover isOpen={isOpen} onClose={onClose} placement="bottom-end">
      <TriggerButton isOpen={isOpen} onClick={onToggle} />
      <PopoverContent>
        <PopoverBody padding="1rem" w="20rem">
          <Flex boxSize="full" flexDirection="column">
            <Flex
              w="full"
              marginBottom="0.5rem"
              justifyContent="space-between"
              alignItems="center"
            >
              <HStack spacing="4px">
                {account && <Identicon size={32} seed={account} />}
                <Text>{account && shortenAddress(account)}</Text>
              </HStack>
              <HStack spacing="4px" justifyContent="flex-end">
                <Tooltip
                  hasArrow
                  label={hasCopied ? 'Copied!' : 'Copy'}
                  color={useColorModeValue('gray.300', 'white')}
                  bg={useColorModeValue('black', 'transparent')}
                >
                  <IconButton
                    color="current"
                    variant="ghost"
                    fontSize="sm"
                    size="sm"
                    ml={{ base: '0', md: '3' }}
                    onClick={onCopy}
                    icon={<FaRegCopy />}
                    aria-label="copy wallet address"
                    borderRadius="50%"
                  />
                </Tooltip>
                <Tooltip
                  hasArrow
                  label="Explore"
                  color={useColorModeValue('gray.300', 'white')}
                  bg={useColorModeValue('black', 'transparent')}
                >
                  <IconButton
                    color="current"
                    variant="ghost"
                    fontSize="sm"
                    size="sm"
                    ml={{ base: '0', md: '3' }}
                    onClick={onCopy}
                    icon={<FaExternalLinkAlt />}
                    aria-label="view wallet on explorer"
                    borderRadius="50%"
                    as="a"
                    href={`https://fuellabs.github.io/block-explorer-v2/beta-3/#/address//${account}`}
                  />
                </Tooltip>
                <Tooltip
                  hasArrow
                  label="Disconnect"
                  color={useColorModeValue('gray.300', 'white')}
                  bg={useColorModeValue('black', 'transparent')}
                >
                  <IconButton
                    color="current"
                    variant="ghost"
                    fontSize="sm"
                    size="sm"
                    ml={{ base: '0', md: '3' }}
                    icon={<FaPowerOff />}
                    aria-label="disconnect wallet"
                    borderRadius="50%"
                    onClick={disconnect}
                  />
                </Tooltip>
              </HStack>
            </Flex>
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              paddingY="1rem"
              gap="0.5rem"
            >
              <Box fontSize="1rem" lineHeight={1}>
                sUSDt Balance
              </Box>
              <Box
                fontSize="2.5rem"
                fontWeight={600}
                color={useColorModeValue('blackAlpha.800', 'white')}
                lineHeight={1}
              >
                {formatted}
              </Box>
            </Flex>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
