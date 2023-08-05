'use client';

import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { Option } from './Option';
import { PendingView } from './PendingView';
import { useEagerlyConnect, useFuel } from '@app/hooks';

const WALLETS_VIEWS = {
  OPTIONS: 'options',
  PENDING: 'pending',
};

export default function Wallet(props: Pick<ModalProps, 'isOpen' | 'onClose'>) {
  const { isOpen, onClose } = props;
  const { isInstalled } = useFuel();
  const { isConnected } = useEagerlyConnect();
  const [walletView, setWalletView] = useState(WALLETS_VIEWS.OPTIONS);
  const [pendingConnector, setPendingConnector] = useState<string | undefined>(
    undefined
  );

  const tryActivation = useCallback(async (connector: string) => {
    try {
      setPendingConnector(connector);
      setWalletView(WALLETS_VIEWS.PENDING);

      await window.fuel?.connect();
      setPendingConnector(undefined);
    } catch (error) {
      setPendingConnector(undefined);
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      onClose();
    }
  }, [isConnected, onClose]);

  const Options = () => {
    return (
      <Flex w="full" gap="8px" flexDirection="column">
        <Option
          header="Fuel Wallet"
          subheader={isInstalled ? 'Available' : 'Install wallet'}
          icon="/fuelwallet.png"
          onClick={() => tryActivation('Fuel Wallet')}
          isDisabled={!isInstalled}
        />
        <Flex w="full" flexDir="column" padding="0.25rem 0rem" color="gray.400">
          By connecting a wallet, you agree to Synthmos Protocol Terms of
          Service and consent to its Privacy Policy.
        </Flex>
      </Flex>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="grey.150">
        <ModalHeader>Connect a wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {walletView === 'options' && <Options />}
          {walletView === 'pending' && pendingConnector && (
            <PendingView
              connector={pendingConnector}
              tryActivation={() => tryActivation(pendingConnector)}
              openOptions={() => setWalletView(WALLETS_VIEWS.OPTIONS)}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
