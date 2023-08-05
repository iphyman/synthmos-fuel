'use client';

import { MARKET, MarketIds } from '@app/configs';
import { useMarketStore } from '@app/hooks';
import { formatPrice } from '@app/utils';
import {
  Box,
  Button,
  ButtonGroup,
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
import { shallow } from 'zustand/shallow';
import { useEffect } from 'react';

interface ConfirmProps extends Pick<ModalProps, 'isOpen' | 'onClose'> {
  prediction: '0' | '1';
  wager: number;
}

export default function ConfirmPosition(props: ConfirmProps) {
  const { isOpen, onClose, prediction, wager } = props;
  const toast = useToast();
  const [price, roundId] = useMarketStore(
    (state) => [state.price, state.roundId],
    shallow
  );

  const handlePredict = async () => {
    // if (!account || !price) return;
    // predict.signAndSend([roundId, wager, price.price, prediction]);
  };

  useEffect(() => {
    // toast({
    //   title: 'Position placed',
    //   description: 'You have successfully entered a position',
    //   status: 'success',
    //   duration: 10000,
    //   isClosable: true,
    // });
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="grey.150">
        <ModalHeader>Confirm Position</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box py="1rem">
            <Text color="whiteAlpha.600">
              If the price of this asset goes{' '}
              {prediction == '1' ? 'HIGHER' : 'LOWER'} than below price mark on
              round closing, you WIN otherwise its a loss position.
            </Text>
            <Text textAlign="center" fontSize="2rem" fontWeight="bold">
              {price ? formatPrice(price.price) : formatPrice('0')}
            </Text>
          </Box>
          <ButtonGroup w="full">
            <Button
              w="full"
              colorScheme="green"
              onClick={handlePredict}
              isDisabled={true}
              isLoading={true}
            >
              Confirm
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
