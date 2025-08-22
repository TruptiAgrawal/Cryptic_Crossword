import React, { memo, useContext, useEffect } from 'react';
import Cell from './Cell';
import PuzzleDataContext from '../context/PuzzleDataContext';
import GamePlayContext from '../context/GamePlayContext';

function Grid() {
  const { puzzleData, cellClueMapping, clueCellMapping } = useContext(PuzzleDataContext);
  const {
    userAnswers,
    validationState,
    activeCellIndex,
    currentDirection,
    handleCellFocus,
    handleCellChange,
    handleCellKeyDown,
  } = useContext(GamePlayContext);

  // Highlighted cells
  const highlightedCells = [];
  if (puzzleData && cellClueMapping && clueCellMapping) {
    const activeClueNumber = cellClueMapping[activeCellIndex]?.[currentDirection];
    if (activeClueNumber) {
      highlightedCells.push(...clueCellMapping[currentDirection][activeClueNumber]);
    }
  }

  // CSS variable for grid size
  useEffect(() => {
    if (puzzleData) {
      document.documentElement.style.setProperty('--grid-size', puzzleData.size);
    }
  }, [puzzleData]);

  if (!puzzleData || !puzzleData.gridSpec) return null; // safeguard

  return (
    <div id="grid-container">
      {puzzleData.gridSpec.map((cellSpec, index) => (
        <Cell
          key={index}
          cellSpec={cellSpec}
          index={index}
          isActive={activeCellIndex === index}
          onFocus={handleCellFocus}
          onChange={handleCellChange}
          onKeyDown={handleCellKeyDown}
          value={userAnswers[index] || ''}
          validation={validationState[index]}
          isHighlighted={highlightedCells.includes(index)}
        />
      ))}
    </div>
  );
}

// ✅ make sure this is OUTSIDE of Grid function, at bottom of file
export default memo(Grid);
