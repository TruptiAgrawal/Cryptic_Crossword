import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import GamePlayContext from './GamePlayContext';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const { showWinModal } = useContext(GamePlayContext);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRunning && !showWinModal) { // Stop timer if win modal is shown
      interval = setInterval(() => {
        setTimer(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, showWinModal]);

  // Start timer when game starts (e.g., puzzle loads)
  const startTimer = useCallback(() => setIsRunning(true), []);
  const stopTimer = useCallback(() => setIsRunning(false), []);
  const resetTimer = useCallback(() => {
    setTimer(0);
    setIsRunning(false);
  }, []);

  // Format time for display
  const formatTime = useCallback((totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <TimerContext.Provider
      value={{
        timer,
        isRunning,
        startTimer,
        stopTimer,
        resetTimer,
        formatTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export default TimerContext;
