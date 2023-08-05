import { cookies } from 'next/headers';

import Providers from './providers';
import { MarketLayout } from '@app/layouts/MarketLayout';

export const metadata = {
  title: 'Synthmos',
  description: 'A decentralized prediction market',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let cookie = cookies().get('chakra-ui-color-mode') || '';
  cookie = cookie as string;

  return (
    <html lang="en">
      <head />
      <body>
        <Providers cookie={cookie}>
          <MarketLayout>{children}</MarketLayout>
        </Providers>
      </body>
    </html>
  );
}
