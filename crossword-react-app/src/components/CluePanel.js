import React, { useState, useContext } from 'react';
import { Tabs, TabsList, TabsContentGroup, TabsTrigger, TabsContent } from '@chakra-ui/react';
import PuzzleDataContext from '../context/PuzzleDataContext';
import GamePlayContext from '../context/GamePlayContext';
import Clues from './Clues'; // This will be the modified Clues component

function CluePanel() {
  const { puzzleData, solution, clueCellMapping } = useContext(PuzzleDataContext);
  const { userAnswers } = useContext(GamePlayContext);
  const [activeTab, setActiveTab] = useState(0); // 0 for Across, 1 for Down
  const [searchTerm, setSearchTerm] = useState('');

  if (!puzzleData) return null;

  const acrossClues = puzzleData.clues.across;
  const downClues = puzzleData.clues.down;

  const filterClues = (clues) => {
    if (!searchTerm) return clues;
    return clues.filter(clue =>
      clue.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getClueProgress = (type, clueNumber) => {
    if (!solution || !clueCellMapping) return 'untouched';

    const cellsInWord = clueCellMapping[type][clueNumber];
    let solvedCount = 0;
    let totalCells = 0;

    for (const cellIndex of cellsInWord) {
      if (!puzzleData.gridSpec[cellIndex].black) { // Only count non-black cells
        totalCells++;
        if (userAnswers[cellIndex] && userAnswers[cellIndex].toUpperCase() === solution[cellIndex].toUpperCase()) {
          solvedCount++;
        }
      }
    }

    if (solvedCount === totalCells && totalCells > 0) {
      return 'solved'; // ✅
    } else if (solvedCount > 0) {
      return 'partially-filled'; // ✳
    } else {
      return 'untouched'; // ○
    }
  };

  const filteredAcrossClues = filterClues(acrossClues);
  const filteredDownClues = filterClues(downClues);

  return (
    <div className="clue-panel">
      <input
        type="text"
        placeholder="Search clues..."
        className="clue-search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Tabs index={activeTab} onChange={setActiveTab} isFitted variant="enclosed">
        <TabsList>
          <TabsTrigger>Across ({filteredAcrossClues.length})</TabsTrigger>
          <TabsTrigger>Down ({filteredDownClues.length})</TabsTrigger>
        </TabsList>
        <TabsContentGroup>
          <TabsContent>
            <Clues type="across" clues={filteredAcrossClues} getClueProgress={getClueProgress} />
          </TabsContent>
          <TabsContent>
            <Clues type="down" clues={filteredDownClues} getClueProgress={getClueProgress} />
          </TabsContent>
        </TabsContentGroup>
      </Tabs>
    </div>
  );
}

export default CluePanel;
