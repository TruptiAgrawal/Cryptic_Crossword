import React, { memo, useContext } from 'react';
import PuzzleDataContext from '../context/PuzzleDataContext';
import GamePlayContext from '../context/GamePlayContext';

function Clues({ type }) {
  const { puzzleData } = useContext(PuzzleDataContext);
  const { activeCellIndex, currentDirection, handleClueClick, cellClueMapping } = useContext(GamePlayContext);

  if (!puzzleData) return null; // Render nothing if puzzleData is not available yet

  const clues = puzzleData.clues[type]; // Get clues based on type (across or down)
  const activeClueNumber = cellClueMapping?.[activeCellIndex]?.[currentDirection];

  return (
    <div className="clue-list-container">
      <h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
      <ul id={`${type}-clues`}>
        {clues.map(clue => (
          <li
            key={`${type}${clue.number}`}
            className={activeClueNumber === clue.number && currentDirection === type ? 'active' : ''}
            onClick={() => handleClueClick(type, clue.number)}
            data-clue={`${type}${clue.number}`}
          >
            {clue.number}. {clue.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default memo(Clues);
