'use client';

import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

export default function Withdraw({
  isOpen,
  onClose,
}: Pick<ModalProps, 'isOpen' | 'onClose'>) {
  const [amount, setAmount] = useState<string>('0');
  const toast = useToast();

  const withdraw = async () => {
    try {
      toast({
        title: 'Withdrawal',
        description: 'You have successfully requested for withdrawal',
        status: 'success',
        duration: 10000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: '',
        status: 'error',
        duration: 10000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="grey.150">
        <ModalHeader>Request Withdrawal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box py="1rem">
            <FormControl>
              <Text>Amount</Text>
              <Input
                size="lg"
                value={amount}
                placeholder="Enter amount to withdraw"
                onChange={(e) => setAmount(e.target.value)}
              />
            </FormControl>
          </Box>
          <ButtonGroup w="full">
            <Button
              w="full"
              colorScheme="green"
              onClick={withdraw}
              isDisabled={false}
            >
              Withdraw
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
