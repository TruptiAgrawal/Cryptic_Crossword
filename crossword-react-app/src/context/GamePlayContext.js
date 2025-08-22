import React, { createContext, useState, useCallback, useContext } from 'react';
import PuzzleDataContext from './PuzzleDataContext';

const GamePlayContext = createContext();

export const GamePlayProvider = ({ children }) => {
  const { puzzleData, solution, cellClueMapping, clueCellMapping } = useContext(PuzzleDataContext);

  const [userAnswers, setUserAnswers] = useState({});
  const [validationState, setValidationState] = useState({});
  const [activeCellIndex, setActiveCellIndex] = useState(0);
  const [currentDirection, setCurrentDirection] = useState('across'); // 'across' or 'down'
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);

  // Reset game state when a new puzzle loads
  React.useEffect(() => {
    if (puzzleData) {
      setUserAnswers({});
      setValidationState({});
      setActiveCellIndex(0);
      setCurrentDirection('across');
      setHintsUsed(0);
      setShowWinModal(false);
    }
  }, [puzzleData]);

  const handleCellChange = useCallback((index, value) => {
    if (!solution) return; // Ensure solution is loaded

    const processedValue = (typeof value === 'string' && value.length > 0 && value.match(/^[a-zA-Z]$/))
      ? value.toUpperCase()
      : '';
    setUserAnswers(prev => ({ ...prev, [index]: processedValue }));

    if (processedValue) {
      const correctAnswer = solution[index];
      if (processedValue === correctAnswer) {
        setValidationState(prev => ({ ...prev, [index]: 'correct' }));
      } else {
        setValidationState(prev => ({ ...prev, [index]: 'incorrect' }));
      }
    } else {
      setValidationState(prev => { const newState = { ...prev }; delete newState[index]; return newState; });
    }
  }, [solution]);

  const checkPuzzle = useCallback(() => {
    if (!puzzleData || !solution) return;

    let allCorrect = true;
    const newValidationState = {};
    puzzleData.gridSpec.forEach((cellSpec, index) => {
      if (!cellSpec.black) {
        const userAnswer = (typeof userAnswers[index] === 'string' && userAnswers[index]) ? userAnswers[index].toUpperCase() : '';
        const correctAnswer = solution[index];

        if (userAnswer === correctAnswer) {
          newValidationState[index] = 'correct';
        } else {
          newValidationState[index] = 'incorrect';
          allCorrect = false;
        }
      }
    });
    setValidationState(newValidationState);
    if (allCorrect) {
      setShowWinModal(true);
    }
  }, [puzzleData, solution, userAnswers]);

  const handleCloseWinModal = useCallback(() => {
    setShowWinModal(false);
    // Optionally reset game or navigate back to puzzle selection
    // For now, just clear answers and validation
    setUserAnswers({});
    setValidationState({});
    setActiveCellIndex(0);
    setCurrentDirection('across');
  }, []);

  const handleCellFocus = useCallback((index) => {
    setActiveCellIndex(index);
    if (cellClueMapping && cellClueMapping[index]) {
      const cellMap = cellClueMapping[index];
      if (cellMap.across && cellMap.down) {
        setCurrentDirection(prevDir => prevDir === 'across' ? 'across' : 'down');
      } else if (cellMap.across) {
        setCurrentDirection('across');
      } else if (cellMap.down) {
        setCurrentDirection('down');
      }
    }
  }, [cellClueMapping]);

  const handleCellKeyDown = useCallback((index, key) => {
    if (!puzzleData) return;

    const { size, gridSpec } = puzzleData;
    let nextIndex = index;
    let nextDirection = currentDirection;
    let increment = 0;

    switch (key) {
      case 'ArrowRight':
        increment = 1;
        nextDirection = 'across';
        break;
      case 'ArrowLeft':
        increment = -1;
        nextDirection = 'across';
        break;
      case 'ArrowDown':
        increment = size;
        nextDirection = 'down';
        break;
      case 'ArrowUp':
        increment = -size;
        nextDirection = 'down';
        break;
      case 'Backspace':
        handleCellChange(index, '');
        if (currentDirection === 'across') {
          increment = -1;
        } else {
          increment = -size;
        }
        break;
      case ' ':
        if (cellClueMapping && cellClueMapping[index]) {
          const otherDirection = currentDirection === 'across' ? 'down' : 'across';
          if (cellClueMapping[index][otherDirection]) {
            nextDirection = otherDirection;
          }
        }
        break;
      default:
        if (typeof key === 'string' && key.match(/^[a-zA-Z]$/i) && !gridSpec[index].black) {
          nextIndex = index;
          nextDirection = currentDirection;
        } else {
          return; // Not a letter or a navigation key
        }
    }

    if (increment !== 0) {
      let i = index + increment;
      while (i >= 0 && i < gridSpec.length) {
        if (Math.abs(increment) === 1 && Math.floor(i / size) !== Math.floor(index / size)) {
          break; // Moved to a different row on horizontal movement
        }
        if (!gridSpec[i].black) {
          nextIndex = i;
          break;
        }
        if (i + increment < 0 || i + increment >= gridSpec.length) {
            break;
        }
        i += increment;
      }
    }

    if (nextIndex !== index || nextDirection !== currentDirection) {
      setActiveCellIndex(nextIndex);
      setCurrentDirection(nextDirection);
    }
  }, [puzzleData, currentDirection, handleCellChange, cellClueMapping]);

  const handleClueClick = useCallback((type, clueNumber) => {
    setCurrentDirection(type);
    if (clueCellMapping && clueCellMapping[type] && clueCellMapping[type][clueNumber]) {
      const firstCellIndex = clueCellMapping[type][clueNumber][0];
      setActiveCellIndex(firstCellIndex);
    }
  }, [clueCellMapping]);

  const checkWord = useCallback(() => {
    if (!puzzleData || !solution || activeCellIndex === null) return;

    const activeClueNumber = cellClueMapping[activeCellIndex][currentDirection];
    if (!activeClueNumber) return; // No active clue for current cell/direction

    const cellsInActiveWord = clueCellMapping[currentDirection][activeClueNumber];
    const newValidationState = { ...validationState };

    cellsInActiveWord.forEach(cellIndex => {
      const userAnswer = (typeof userAnswers[cellIndex] === 'string' && userAnswers[cellIndex]) ? userAnswers[cellIndex].toUpperCase() : '';
      const correctAnswer = solution[cellIndex];

      if (userAnswer === correctAnswer) {
        newValidationState[cellIndex] = 'correct';
      } else {
        newValidationState[cellIndex] = 'incorrect';
      }
    });
    setValidationState(newValidationState);
  }, [puzzleData, solution, activeCellIndex, currentDirection, cellClueMapping, userAnswers, validationState]);

  const handleHintClick = useCallback(() => {
    if (!puzzleData || !solution || activeCellIndex === null || puzzleData.gridSpec[activeCellIndex].black) {
      return; // Cannot give hint for black cells or if no puzzle data
    }

    const correctAnswer = solution[activeCellIndex];
    if (userAnswers[activeCellIndex] !== correctAnswer) { // Only give hint if current answer is incorrect or empty
      setUserAnswers(prev => ({ ...prev, [activeCellIndex]: correctAnswer }));
      setValidationState(prev => ({ ...prev, [activeCellIndex]: 'correct' }));
      setHintsUsed(prev => prev + 1);
    }
  }, [puzzleData, solution, activeCellIndex, userAnswers]);

  return (
    <GamePlayContext.Provider
      value={{
        userAnswers,
        validationState,
        activeCellIndex,
        currentDirection,
        hintsUsed,
        showWinModal,
        handleCellChange,
        checkPuzzle,
        handleCloseWinModal,
        handleCellFocus,
        handleCellKeyDown,
        handleClueClick,
        checkWord,
        handleHintClick,
        setActiveCellIndex,
        setCurrentDirection,
        setShowWinModal,
      }}
    >
      {children}
    </GamePlayContext.Provider>
  );
};

export default GamePlayContext;
