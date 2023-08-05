import { Fuel } from '@fuel-wallet/sdk';
import { useEffect, useState } from 'react';

export function useFuel() {
  const [error, setError] = useState<string>('');
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fuel, setFuel] = useState<Fuel | undefined>(undefined);

  useEffect(() => {
    const fuel = new Fuel({ name: 'Fuel Wallet' });

    fuel.hasWallet().then((hasWallet) => {
      setFuel(hasWallet ? fuel : undefined);
      setError(hasWallet ? '' : 'fuel not detected on the window!');
      setIsInstalled(hasWallet);
      setIsLoading(false);
    });
  }, []);

  return { error, fuel, isInstalled, isLoading };
}
