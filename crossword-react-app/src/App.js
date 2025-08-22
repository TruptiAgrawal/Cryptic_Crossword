import React, { useState } from 'react';
import PuzzleSelector from './components/PuzzleSelector';
import CrosswordGame from './components/CrosswordGame';
import { PuzzleDataProvider } from './context/PuzzleDataContext';
import { GamePlayProvider } from './context/GamePlayContext';
import { TimerProvider } from './context/TimerContext';
import './Crossword.css'; // Import the CSS file

function App() {
  const [selectedPuzzleFile, setSelectedPuzzleFile] = useState(null);

  return (
    <div className="app-container">
      {!selectedPuzzleFile ? (
        <PuzzleSelector onSelectPuzzle={setSelectedPuzzleFile} />
      ) : (
        <PuzzleDataProvider puzzleFile={selectedPuzzleFile}>
          <GamePlayProvider>
            <TimerProvider>
              <CrosswordGame />
            </TimerProvider>
          </GamePlayProvider>
        </PuzzleDataProvider>
      )}
    </div>
  );
}
export default App;
