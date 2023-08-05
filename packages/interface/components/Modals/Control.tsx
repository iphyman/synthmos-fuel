'use client';

import { MARKET, MarketIds } from '@app/configs';
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
} from '@chakra-ui/react';
import { getTimestamp } from '@app/utils';
import { useMarketStore } from '@app/hooks';

export default function Control({
  isOpen,
  onClose,
}: Pick<ModalProps, 'isOpen' | 'onClose'>) {
  const price = useMarketStore((state) => state.price);

  const handleStart = () => {
    const openingTime = getTimestamp(0);
    const closingTime = getTimestamp(10);
    const entryDeadline = getTimestamp(5);
  };

  const handleFinalize = async () => {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="grey.150">
        <ModalHeader>Operator Control</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box py="1rem">
            <Text>
              From this mini panel you can control the opening and closing of a
              prediction round, in production this will be automated.
            </Text>
          </Box>
          <ButtonGroup w="full">
            <Button
              w="full"
              h="3rem"
              variant="high"
              onClick={handleStart}
              isDisabled={false}
              isLoading={false}
            >
              Start New Round
            </Button>
            <Button
              w="full"
              h="3rem"
              variant="low"
              onClick={handleFinalize}
              isDisabled={false}
              isLoading={false}
            >
              Finalize Round
            </Button>
          </ButtonGroup>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
