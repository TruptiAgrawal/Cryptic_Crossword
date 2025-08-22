import React, { useEffect, useContext } from "react";
import { Button } from '@chakra-ui/react';
import Grid from './Grid';
import Clues from './Clues';
import WinModal from './WinModal';
import PuzzleDataContext from '../context/PuzzleDataContext';
import GamePlayContext from '../context/GamePlayContext';
import TimerContext from '../context/TimerContext';

function CrosswordGame() {
  const { puzzleData, loading, error, solution, cellClueMapping, clueCellMapping } = useContext(PuzzleDataContext);
  const {
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
    setShowWinModal,
  } = useContext(GamePlayContext);
  const { timer, formatTime, startTimer, stopTimer } = useContext(TimerContext);

  // Effect to start/stop timer based on puzzle loading and win modal
  useEffect(() => {
    if (!loading && puzzleData) {
      startTimer();
    } else if (showWinModal) {
      stopTimer();
    }
  }, [loading, puzzleData, showWinModal, startTimer, stopTimer]);

  // Effect to focus the active cell input field and scroll to active clue
  useEffect(() => {
    if (!loading && puzzleData) {
      const activeInput = document.querySelector(`.grid-cell.active input`);
      if (activeInput) {
        activeInput.focus();
      }

      // Scroll to active clue
      if (cellClueMapping && activeCellIndex !== null && currentDirection) {
        const activeClueNumber = cellClueMapping[activeCellIndex]?.[currentDirection];
        if (activeClueNumber) {
          const activeClueElement = document.querySelector(`li[data-clue="${currentDirection}${activeClueNumber}"]`);
          if (activeClueElement) {
            activeClueElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      }
    }
  }, [activeCellIndex, loading, puzzleData, cellClueMapping, currentDirection]);

  if (loading) return <div>Loading puzzle...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!puzzleData || !solution || !cellClueMapping || !clueCellMapping) return null;

  const highlightedCells = [];
  if (cellClueMapping && activeCellIndex !== null && currentDirection) {
    const activeClueNumber = cellClueMapping[activeCellIndex]?.[currentDirection];
    if (activeClueNumber) {
      highlightedCells.push(...clueCellMapping[currentDirection][activeClueNumber]);
    }
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
            activeClueNumber={currentDirection === 'across' ? (cellClueMapping[activeCellIndex]?.[currentDirection]) : null}
            onClueClick={handleClueClick}
          />
          <Clues
            type="down"
            clues={puzzleData.clues.down}
            activeClueNumber={currentDirection === 'down' ? (cellClueMapping[activeCellIndex]?.[currentDirection]) : null}
            onClueClick={handleClueClick}
          />
        </div>
      </div>
      <Button onClick={checkPuzzle}>Check Puzzle</Button>
      <Button onClick={checkWord} ml={4}>Check Word</Button>
      <Button onClick={handleHintClick} ml={4}>Hint ({hintsUsed})</Button>
      <div style={{ marginLeft: 'auto', fontSize: '1.2em', fontWeight: 'bold' }}>Time: {formatTime(timer)}</div>
      {showWinModal && <WinModal onClose={handleCloseWinModal} finalTime={formatTime(timer)} hintsUsed={hintsUsed} />}
    </div>
  );
}
export default CrosswordGame;
