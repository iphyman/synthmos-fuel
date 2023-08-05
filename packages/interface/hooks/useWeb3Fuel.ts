import { Fuel, FuelWalletLocked } from '@fuel-wallet/sdk';
import { CoinQuantity } from 'fuels';
import { useCallback, useEffect, useState } from 'react';

export function useWeb3Fuel() {
  const [accounts, setAccounts] = useState<Array<string> | undefined>(
    undefined
  );
  const [account, setAccount] = useState<string | undefined>(undefined);
  const [wallet, setWallet] = useState<FuelWalletLocked | undefined>(undefined);
  const [balances, setBalances] = useState<CoinQuantity[]>([]);
  const [error, setError] = useState<string>('');
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [fuel] = useState<Fuel>(new Fuel({ name: 'Fuel Wallet' }));

  const loadAccounts = useCallback(async () => {
    const currentAccount = await fuel.currentAccount();
    setAccounts(await fuel.accounts());
    setAccount(currentAccount);

    const currentWallet = await fuel.getWallet(currentAccount);
    const bals = await currentWallet.getBalances();
    setWallet(currentWallet);
    setBalances(bals);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnection = useCallback(
    async () => setIsConnected(await fuel.isConnected()),
    [fuel]
  );

  useEffect(() => {
    fuel.hasWallet().then((hasWallet) => {
      setError(hasWallet ? '' : 'fuel not detected on the window!');
      setIsInstalled(hasWallet);
      setIsLoading(false);
    });

    if (fuel) {
      handleConnection();
      loadAccounts();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fuel) {
      handleConnection();
    }

    fuel?.on(fuel.events.connection, handleConnection);

    return () => {
      fuel?.off(fuel.events.connection, handleConnection);
    };
  }, [fuel, handleConnection]);

  const connect = async () => {
    const state = await fuel.connect();
    setIsConnected(state);
  };

  const disconnect = async () => {
    const state = await fuel.disconnect();

    if (state) {
      setIsConnected(state);
      setAccounts(undefined);
      setAccount(undefined);
      setBalances([]);
      setWallet(undefined);
    }
  };

  return {
    fuel,
    error,
    wallet,
    account,
    accounts,
    balances,
    isLoading,
    isConnected,
    isInstalled,
    connect,
    disconnect,
  } as const;
}
