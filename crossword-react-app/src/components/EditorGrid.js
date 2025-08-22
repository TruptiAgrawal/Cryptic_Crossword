import React, { useState, useEffect, useCallback } from 'react';
import EditorCell from './EditorCell';
import { Box, Button, Flex, Input, Textarea, Heading } from '@chakra-ui/react';

function EditorGrid() {
  const [gridSize, setGridSize] = useState(5); // Default size
  const [gridSpec, setGridSpec] = useState([]);
  const [exportedJson, setExportedJson] = useState('');

  // Initialize grid based on size
  useEffect(() => {
    const newGridSpec = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
      newGridSpec.push({
        x: Math.floor(i / gridSize),
        y: i % gridSize,
        black: false, // Default to white
      });
    }
    setGridSpec(newGridSpec);
  }, [gridSize]);

  const handleToggleBlack = useCallback((index) => {
    setGridSpec(prevGridSpec => {
      const newGridSpec = [...prevGridSpec];
      newGridSpec[index] = { ...newGridSpec[index], black: !newGridSpec[index].black };
      return newGridSpec;
    });
  }, []);

  const handleExport = useCallback(() => {
    const exportData = {
      size: gridSize,
      gridSpec: gridSpec.map(cell => {
        const newCell = { x: cell.x, y: cell.y };
        if (cell.black) {
          newCell.black = true;
        }
        // Add number property for cells that start a clue (this logic is complex and needs to be done manually or with a separate tool)
        // For now, just export black/white
        return newCell;
      }),
      // Clues will need to be added manually after grid is designed
      clues: {
        across: [],
        down: []
      }
    };
    setExportedJson(JSON.stringify(exportData, null, 2));
  }, [gridSize, gridSpec]);

  // Set CSS variable for grid size
  useEffect(() => {
    document.documentElement.style.setProperty('--grid-size', gridSize);
  }, [gridSize]);

  return (
    <Box className="grid-editor-container" p={8}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">Crossword Grid Editor</Heading>

      <Flex mb={6} align="center" justify="center">
        <Box mr={4}>
          <label htmlFor="grid-size-input">Grid Size:</label>
          <Input
            id="grid-size-input"
            type="number"
            value={gridSize}
            onChange={(e) => setGridSize(parseInt(e.target.value) || 1)}
            min="1"
            max="20"
            width="80px"
            ml={2}
          />
        </Box>
        <Button onClick={handleExport} colorScheme="blue">Export Grid JSON</Button>
      </Flex>

      <Box id="grid-container" mb={8} mx="auto"> {/* Reusing grid-container ID for styling */}
        {gridSpec.map((cellSpec, index) => (
          <EditorCell
            key={index}
            cellSpec={cellSpec}
            index={index}
            onToggleBlack={handleToggleBlack}
          />
        ))}
      </Box>

      {exportedJson && (
        <Box>
          <Heading as="h2" size="md" mb={3}>Exported Grid JSON:</Heading>
          <Textarea
            value={exportedJson}
            isReadOnly
            height="300px"
            fontFamily="monospace"
            p={4}
          />
        </Box>
      )}
    </Box>
  );
}

export default EditorGrid;
