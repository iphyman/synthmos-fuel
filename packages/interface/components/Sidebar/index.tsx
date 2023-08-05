'use client';

import {
  Box,
  chakra,
  Button,
  Text,
  VStack,
  IconButton,
  HStack,
  useNumberInput,
  Input,
  Icon,
  useDisclosure,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import { FaMinus, FaPlus, FaRegClock } from 'react-icons/fa';
import { useCountDown, useMarketStore } from '@app/hooks';
import { formatPrice } from '@app/utils';

const ConfirmPosition = dynamic(() => import('../Modals/ConfirmPosition'), {
  ssr: false,
});

export default function Sidebar() {
  const {
    getDecrementButtonProps,
    getIncrementButtonProps,
    getInputProps,
    valueAsNumber,
  } = useNumberInput({
    step: 1,
    defaultValue: 5,
    min: 2,
    precision: 0,
  });

  const amountProps = getInputProps();
  const incrementProps = getIncrementButtonProps();
  const decrementProps = getDecrementButtonProps();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const setMarketGesture = useMarketStore((state) => state.setMarketGesture);

  const round = useMarketStore((state) => state.round);
  const [position, setPosition] = useState<'0' | '1'>('0');

  const closingTime = round ? parseInt(round.closingTime) : null;
  const entryDeadline = round ? parseInt(round.entryDeadline) : null;

  const closeTime = useCountDown(closingTime);
  const deadline = useCountDown(entryDeadline);

  const isActiveRound = () => {
    const now = Date.now();
    if (
      closingTime &&
      entryDeadline &&
      closingTime > now &&
      entryDeadline > now
    ) {
      return true;
    }
    return false;
  };

  const handler = (option: '0' | '1') => {
    setPosition(option);
    onOpen();
  };

  const reward = round?.percentageReward
    ? (parseInt(round.percentageReward) * valueAsNumber).toString()
    : '0';

  return (
    <>
      <Box w="8rem" h="full">
        <VStack spacing={3} w="full">
          <Box padding="2px" w="full" bg="whiteAlpha.200" borderRadius="md">
            <Box bg="whiteAlpha.200" padding="0.5rem">
              <HStack w="full" justifyContent="space-between">
                <Text fontSize="11px" whiteSpace="nowrap" noOfLines={1}>
                  Expiry Time
                </Text>
                <IconButton
                  variant="tooltip"
                  aria-label="help"
                  icon={<BsFillQuestionCircleFill />}
                />
              </HStack>
              <HStack>
                <Icon as={FaRegClock} />
                <Text>{closeTime}</Text>
              </HStack>
            </Box>
            {/* <HStack w="full" spacing={1} justifyContent="space-between">
              <IconButton
                w="full"
                h="1rem"
                borderRadius="0px"
                fontSize="12px"
                aria-label="decrement"
                icon={<FaMinus />}
              />
              <IconButton
                w="full"
                h="1rem"
                borderRadius="0px"
                fontSize="12px"
                aria-label="increment"
                icon={<FaPlus />}
              />
            </HStack> */}
          </Box>
          <Box padding="2px" w="full" bg="whiteAlpha.200" borderRadius="md">
            <Box bg="whiteAlpha.200" padding="0.5rem">
              <HStack w="full" justifyContent="space-between">
                <Text fontSize="11px" whiteSpace="nowrap" noOfLines={1}>
                  Entry deadline
                </Text>
                <IconButton
                  variant="tooltip"
                  aria-label="help"
                  icon={<BsFillQuestionCircleFill />}
                />
              </HStack>
              <HStack>
                <Icon as={FaRegClock} />
                <Text>{deadline}</Text>
              </HStack>
            </Box>
          </Box>
          <Box padding="2px" w="full" bg="whiteAlpha.200" borderRadius="md">
            <Box bg="gray.800" padding="0.5rem">
              <HStack w="full" justifyContent="space-between">
                <Text fontSize="11px" whiteSpace="nowrap" noOfLines={1}>
                  Amount
                </Text>
                <IconButton
                  variant="tooltip"
                  aria-label="help"
                  icon={<BsFillQuestionCircleFill />}
                />
              </HStack>
              <HStack>
                <Text>$</Text>
                <Input
                  h="1.5rem"
                  border="0px solid"
                  pl="0rem"
                  _focus={{
                    outline: 'none',
                    outlineOffset: '0px !important',
                    boxShadow: 'none',
                  }}
                  {...amountProps}
                />
              </HStack>
            </Box>
            <HStack w="full" spacing={1} justifyContent="space-between">
              <IconButton
                w="full"
                h="1rem"
                borderRadius="0px"
                fontSize="12px"
                aria-label="decrement"
                icon={<FaMinus />}
                {...decrementProps}
              />
              <IconButton
                w="full"
                h="1rem"
                borderRadius="0px"
                fontSize="12px"
                aria-label="increment"
                icon={<FaPlus />}
                {...incrementProps}
              />
            </HStack>
          </Box>
          <Box w="full" p="1rem" borderRadius="md">
            <VStack spacing={1} alignItems="center">
              <HStack>
                <Text fontSize="12px">Profit</Text>
                <IconButton
                  variant="tooltip"
                  aria-label="help"
                  icon={<BsFillQuestionCircleFill />}
                />
              </HStack>
              <Text
                fontSize="2.5rem"
                color="green.950"
                lineHeight={1}
                textAlign="center"
              >
                <chakra.span fontSize="1.5rem">+</chakra.span>
                {round?.percentageReward}
                <chakra.span fontSize="1.5rem">%</chakra.span>
              </Text>
              <Box>
                <Text
                  fontWeight={700}
                  color="green.950"
                  fontSize="1.2rem"
                  noOfLines={1}
                  textAlign="center"
                >
                  +{formatPrice(reward, 2)}
                </Text>
                <Text fontSize="10px" color="whiteAlpha.600" textAlign="center">
                  sUSDt Token
                </Text>
              </Box>
            </VStack>
          </Box>
          <Button
            variant="high"
            onClick={() => handler('1')}
            onMouseEnter={() =>
              setMarketGesture({ isHigh: true, isLow: false })
            }
            onMouseLeave={() =>
              setMarketGesture({ isHigh: false, isLow: false })
            }
            isDisabled={!isActiveRound()}
          >
            <Box pos="relative" boxSize="2rem">
              <Image src="/higher.png" alt="high" fill />
            </Box>
            HIGHER
          </Button>
          <Button
            variant="low"
            onClick={() => handler('0')}
            onMouseEnter={() =>
              setMarketGesture({ isHigh: false, isLow: true })
            }
            onMouseLeave={() =>
              setMarketGesture({ isHigh: false, isLow: false })
            }
            isDisabled={!isActiveRound()}
          >
            <Box pos="relative" boxSize="2.5rem">
              <Image src="/lower.png" alt="low" fill />
            </Box>
            LOWER
          </Button>
        </VStack>
      </Box>
      <ConfirmPosition
        isOpen={isOpen}
        onClose={onClose}
        prediction={position}
        wager={valueAsNumber}
      />
    </>
  );
}
