'use client';

import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
  useNumberInput,
} from '@chakra-ui/react';
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { MARKET_CONTROLLER } from '@app/configs';
import { useEffect } from 'react';

export default function Faucet({
  isOpen,
  onClose,
}: Pick<ModalProps, 'isOpen' | 'onClose'>) {
  const {
    getDecrementButtonProps,
    getIncrementButtonProps,
    getInputProps,
    valueAsNumber,
  } = useNumberInput({
    step: 100,
    defaultValue: 100,
    min: 100,
    max: 1000,
    precision: 0,
  });

  const amountProps = getInputProps();
  const incrementProps = getIncrementButtonProps();
  const decrementProps = getDecrementButtonProps();

  const claim = async () => {
    // if (!account || !contract) return;
    // claimTx.signAndSend([valueAsNumber]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="grey.150">
        <ModalHeader>sUSDt Faucet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box py="1rem">
            <Box padding="2px" w="full" bg="whiteAlpha.200" borderRadius="md">
              <Box bg="gray.800" padding="0.5rem">
                <HStack w="full" justifyContent="space-between">
                  <Text fontSize="1rem" whiteSpace="nowrap" noOfLines={1}>
                    sUSDt Amount
                  </Text>
                  <IconButton
                    variant="tooltip"
                    aria-label="help"
                    icon={<BsFillQuestionCircleFill />}
                  />
                </HStack>
                <Input
                  border="0px solid"
                  pl="0rem"
                  _focus={{
                    outline: 'none',
                    outlineOffset: '0px !important',
                    boxShadow: 'none',
                  }}
                  {...amountProps}
                />
              </Box>
              <HStack w="full" spacing={1} justifyContent="space-between">
                <IconButton
                  w="full"
                  h="2.5rem"
                  borderRadius="0px"
                  fontSize="1rem"
                  aria-label="increment"
                  icon={<FaPlus />}
                  {...incrementProps}
                />
                <IconButton
                  w="full"
                  h="2.5rem"
                  borderRadius="0px"
                  fontSize="1rem"
                  aria-label="decrement"
                  icon={<FaMinus />}
                  {...decrementProps}
                />
              </HStack>
            </Box>
          </Box>
          <ButtonGroup w="full">
            <Button
              w="full"
              h="3rem"
              colorScheme="green"
              onClick={claim}
              isDisabled={false}
              isLoading={false}
            >
              Claim
            </Button>
            <Button w="full" h="3rem" onClick={onClose}>
              Cancel
            </Button>
          </ButtonGroup>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
