'use client';

import { Button, chakra, useDisclosure } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import { AccountDropdown } from './AccountDropdown';
import { useWallet } from '@app/hooks';

const WalletModal = dynamic(() => import('../Modals/Wallet'), { ssr: false });

const Web3StatusInner = () => {
  const { account } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (account) {
    return <AccountDropdown />;
  } else {
    return (
      <>
        <Button borderRadius="full" onClick={onOpen}>
          Connect
        </Button>
        <WalletModal isOpen={isOpen} onClose={onClose} />
      </>
    );
  }
};

export const Web3Status = () => {
  return (
    <chakra.div>
      <Web3StatusInner />
    </chakra.div>
  );
};
