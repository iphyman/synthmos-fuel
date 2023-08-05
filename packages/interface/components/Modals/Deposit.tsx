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
  useBoolean,
  useNumberInput,
  useToast,
} from '@chakra-ui/react';
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useEffect } from 'react';

export default function ClaimReward({
  isOpen,
  onClose,
}: Pick<ModalProps, 'isOpen' | 'onClose'>) {
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
  const toast = useToast();

  useEffect(() => {
    // toast({
    //   title: "Deposit Successful",
    //   description: "You have successfully deposited",
    //   status: "success",
    //   duration: 10000,
    //   isClosable: true,
    // });
    // toast({
    //   title: "Approval Successful",
    //   description: "You have successfully approved the controller",
    //   status: "success",
    //   duration: 10000,
    //   isClosable: true,
    // });
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="grey.150">
        <ModalHeader>Deposit</ModalHeader>
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
              colorScheme="green"
              onClick={() => {}}
              isDisabled={false}
              isLoading={false}
            >
              Deposit
            </Button>
            <Button w="full" onClick={onClose}>
              Cancel
            </Button>
          </ButtonGroup>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
