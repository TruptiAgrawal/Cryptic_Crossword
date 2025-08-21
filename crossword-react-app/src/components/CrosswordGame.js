import React, { useState, useEffect, useCallback } from 'react';
import Grid from './Grid';
import Clues from './Clues';
import WinModal from './WinModal';

// Helper function to generate the solution array from gridSpec and clues
const generateSolution = (gridSpec, clues) => {
  const solution = Array(gridSpec.length).fill('');
  clues.across.forEach(clue => {
    let cellIndex = gridSpec.findIndex(cell => cell.x === clue.x && cell.y === clue.y);
    for (let i = 0; i < clue.len; i++) {
      solution[cellIndex + i] = clue.answer[i];
    }
  });
  clues.down.forEach(clue => {
    let cellIndex = gridSpec.findIndex(cell => cell.x === clue.x && cell.y === clue.y);
    for (let i = 0; i < clue.len; i++) {
      solution[cellIndex + (i * Math.sqrt(gridSpec.length))] = clue.answer[i];
    }
  });
  return solution;
};

// Helper function to build cell-to-clue and clue-to-cell mappings
const buildClueMappings = (gridSpec, clues) => {
  const size = Math.sqrt(gridSpec.length);
  const cellClueMapping = Array(gridSpec.length).fill(null).map(() => ({ across: null, down: null }));
  const clueCellMapping = { across: {}, down: {} };

  clues.across.forEach(clue => {
    clueCellMapping.across[clue.number] = [];
    let cellIndex = gridSpec.findIndex(cell => cell.x === clue.x && cell.y === clue.y);
    for (let i = 0; i < clue.len; i++) {
      const currentCellIndex = cellIndex + i;
      cellClueMapping[currentCellIndex].across = clue.number;
      clueCellMapping.across[clue.number].push(currentCellIndex);
    }
  });

  clues.down.forEach(clue => {
    clueCellMapping.down[clue.number] = [];
    let cellIndex = gridSpec.findIndex(cell => cell.x === clue.x && cell.y === clue.y);
    for (let i = 0; i < clue.len; i++) {
      const currentCellIndex = cellIndex + (i * size);
      cellClueMapping[currentCellIndex].down = clue.number;
      clueCellMapping.down[clue.number].push(currentCellIndex);
    }
  });

  return { cellClueMapping, clueCellMapping };
};

function CrosswordGame({ puzzleFile }) {
  const [puzzleData, setPuzzleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [validationState, setValidationState] = useState({});
  const [showWinModal, setShowWinModal] = useState(false);
  const [solution, setSolution] = useState(null);
  const [cellClueMapping, setCellClueMapping] = useState(null);
  const [clueCellMapping, setClueCellMapping] = useState(null);
  const [activeCellIndex, setActiveCellIndex] = useState(0);
  const [currentDirection, setCurrentDirection] = useState('across'); // 'across' or 'down'

  useEffect(() => {
    setLoading(true);
    setPuzzleData(null);
    setSolution(null);
    setCellClueMapping(null);
    setClueCellMapping(null);
    setUserAnswers({});
    setValidationState({});
    setActiveCellIndex(0);
    setCurrentDirection('across');

    fetch(puzzleFile)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setPuzzleData(data);
        const generatedSolution = generateSolution(data.gridSpec, data.clues);
        setSolution(generatedSolution);
        const { cellClueMapping, clueCellMapping } = buildClueMappings(data.gridSpec, data.clues);
        setCellClueMapping(cellClueMapping);
        setClueCellMapping(clueCellMapping);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [puzzleFile]);

  const handleCellChange = (index, value) => { // Changed to accept value directly
    // Ensure value is a string and take only the first character if it's a letter
    const processedValue = (typeof value === 'string' && value.length > 0 && value.match(/^[a-zA-Z]$/))
      ? value.toUpperCase()
      : '';
    setUserAnswers(prev => ({ ...prev, [index]: processedValue }));
    setValidationState(prev => { const newState = { ...prev }; delete newState[index]; return newState; });
  };

  const checkPuzzle = () => {
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
  };

  const handleCloseWinModal = () => {
    setShowWinModal(false);
    // Optionally reset game or navigate back to puzzle selection
    // For now, just clear answers and validation
    setUserAnswers({});
    setValidationState({});
    setActiveCellIndex(0);
    setCurrentDirection('across');
  };

  const handleCellFocus = useCallback((index) => {
    setActiveCellIndex(index);
    // Determine initial direction based on available clues for the cell
    const cellMap = cellClueMapping[index];
    if (cellMap.across && cellMap.down) {
      // If both across and down clues exist, default to currentDirection or across
      // For now, just set to across if it's the first focus or no strong preference
      setCurrentDirection(prevDir => prevDir === 'across' ? 'across' : 'down'); // Keep current if valid, else default
    } else if (cellMap.across) {
      setCurrentDirection('across');
    } else if (cellMap.down) {
      setCurrentDirection('down');
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
        handleCellChange(index, ''); // Clear current cell
        if (currentDirection === 'across') {
          increment = -1;
        } else {
          increment = -size;
        }
        break;
      case ' ': // Spacebar to toggle direction
        const otherDirection = currentDirection === 'across' ? 'down' : 'across';
        if (cellClueMapping[index] && cellClueMapping[index][otherDirection]) {
          nextDirection = otherDirection;
        }
        break;
      default:
        if (typeof key === 'string' && key.match(/^[a-zA-Z]$/i) && !gridSpec[index].black) {
          if (currentDirection === 'across') {
            increment = 1;
          } else {
            increment = size;
          }
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
    const firstCellIndex = clueCellMapping[type][clueNumber][0];
    setActiveCellIndex(firstCellIndex);
    // Programmatically focus the input field of the newly active cell
    // This will be handled by the useEffect that watches activeCellIndex
  }, [clueCellMapping]);

  // Effect to focus the active cell input field
  useEffect(() => {
    if (!loading && puzzleData) {
      const activeInput = document.querySelector(`.grid-cell.active input`);
      if (activeInput) {
        activeInput.focus();
      }
    }
  }, [activeCellIndex, loading, puzzleData]);

  if (loading) return <div>Loading puzzle...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!puzzleData || !solution || !cellClueMapping || !clueCellMapping) return null; // Ensure all data is loaded

  // Determine which cells should be highlighted based on active cell and direction
  const highlightedCells = [];
  const activeClueNumber = cellClueMapping[activeCellIndex][currentDirection];
  if (activeClueNumber) {
    highlightedCells.push(...clueCellMapping[currentDirection][activeClueNumber]);
  }

  return (
    <div className="game-wrapper">
      <div id="game-container">
        <Grid
          gridSpec={puzzleData.gridSpec}
          size={puzzleData.size}
          userAnswers={userAnswers}
          validationState={validationState}
          activeCellIndex={activeCellIndex}
          onCellFocus={handleCellFocus}
          onCellChange={handleCellChange}
          onCellKeyDown={handleCellKeyDown}
          highlightedCells={highlightedCells}
        />
        <div id="clues-container">
          <Clues
            type="across"
            clues={puzzleData.clues.across}
            activeClueNumber={currentDirection === 'across' ? activeClueNumber : null}
            onClueClick={handleClueClick}
          />
          <Clues
            type="down"
            clues={puzzleData.clues.down}
            activeClueNumber={currentDirection === 'down' ? activeClueNumber : null}
            onClueClick={handleClueClick}
          />
        </div>
      </div>
      <button onClick={checkPuzzle}>Check Puzzle</button>
      {showWinModal && <WinModal onClose={handleCloseWinModal} />}
    </div>
  );
}
export default CrosswordGame;