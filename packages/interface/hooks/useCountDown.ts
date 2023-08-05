import { useEffect, useState } from 'react';

export function useCountDown(timestamp: number | null) {
  const [time, setTime] = useState<string>('00:00:00');

  const formatTIme = (tm: number) => {
    return tm.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      if (!timestamp) return;

      const diff = Math.floor(timestamp / 1000) - now;

      if (timestamp > 0 && diff > 0) {
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff / 60) % 60);
        const seconds = Math.floor(diff % 60);

        setTime(
          `${formatTIme(hours)}:${formatTIme(minutes)}:${formatTIme(seconds)}`
        );
      } else {
        setTime('00:00:00');
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timestamp]);

  return time;
}
