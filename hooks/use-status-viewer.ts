import { useState, useEffect } from 'react';
import { Status } from '@/lib/types';

export function useStatusViewer(statuses: Status[] = []) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null);

  const startProgressTimer = () => {
    if (progressInterval) {
      clearInterval(progressInterval);
    }

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (currentIndex < statuses.length - 1) {
            setCurrentIndex(prev => prev + 1);
            return 0;
          } else {
            clearInterval(timer);
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    setProgressInterval(timer);
  };

  useEffect(() => {
    setProgress(0);
    startProgressTimer();

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < statuses.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
      startProgressTimer();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
      startProgressTimer();
    }
  };

  const reset = () => {
    setCurrentIndex(0);
    setProgress(0);
    if (progressInterval) {
      clearInterval(progressInterval);
      setProgressInterval(null);
    }
  };

  return {
    currentIndex,
    progress,
    handleNext,
    handlePrevious,
    reset
  };
}