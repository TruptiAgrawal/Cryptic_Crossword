import React, { createContext, useState, useEffect } from 'react';

const PuzzleDataContext = createContext();

export const PuzzleDataProvider = ({ children, puzzleFile }) => {
  const [puzzleData, setPuzzleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solution, setSolution] = useState(null);
  const [cellClueMapping, setCellClueMapping] = useState(null);
  const [clueCellMapping, setClueCellMapping] = useState(null);

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

  useEffect(() => {
    if (!puzzleFile) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setPuzzleData(null);
    setSolution(null);
    setCellClueMapping(null);
    setClueCellMapping(null);

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
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [puzzleFile]);

  return (
    <PuzzleDataContext.Provider
      value={{
        puzzleData,
        loading,
        error,
        solution,
        cellClueMapping,
        clueCellMapping,
      }}
    >
      {children}
    </PuzzleDataContext.Provider>
  );
};

export default PuzzleDataContext;
