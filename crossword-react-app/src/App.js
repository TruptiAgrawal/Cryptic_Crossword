import React, { useState } from 'react';
import PuzzleSelector from './components/PuzzleSelector';
import CrosswordGame from './components/CrosswordGame';

function App() {
  const [selectedPuzzleFile, setSelectedPuzzleFile] = useState(null);

  return (
    <div className="app-container">
      {!selectedPuzzleFile ? (
        <PuzzleSelector onSelectPuzzle={setSelectedPuzzleFile} />
      ) : (
        <CrosswordGame puzzleFile={selectedPuzzleFile} />
      )}
    </div>
  );
}
export default App;