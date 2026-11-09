
import { useEffect, useState } from 'react';

function useTimer(startedAt) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!startedAt) {
      setElapsedSeconds(0);
      return;
    }

    const calculateElapsedTime = () => {
      const startTime = new Date(startedAt).getTime();
      const currentTime = Date.now();

      const elapsed = Math.max(
        0,
        Math.floor((currentTime - startTime) / 1000)
      );

      setElapsedSeconds(elapsed);
    };

    calculateElapsedTime();

    const interval = setInterval(calculateElapsedTime, 1000);

    return () => clearInterval(interval);
  }, [startedAt]);

  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;

  const formattedTime = [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':');

  return {
    elapsedSeconds,
    formattedTime,
  };
}

export default useTimer;
