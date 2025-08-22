import React, { useState, useEffect } from 'react';
import { Box, Text, Flex, Badge, Heading, Spinner } from '@chakra-ui/react';

function PuzzleSelector({ onSelectPuzzle }) {
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('puzzles.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setPuzzles(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []); // Empty dependency array means this runs once on mount

  if (loading) return <Flex justify="center" align="center" height="100vh"><Spinner size="xl" /></Flex>;
  if (error) return <Text color="red.500">Error loading puzzles: {error.message}</Text>;

  return (
    <Box className="level-selection-container" p={8} maxW="900px" mx="auto">
      <Heading as="h1" size="xl" mb={8} textAlign="center">Select a Puzzle</Heading>
      <Flex id="puzzle-list" wrap="wrap" justify="center" gap={6}>
        {puzzles.map(puzzle => (
          <Box
            key={puzzle.id}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="lg"
            flex="1"
            minW="200px"
            maxW="280px"
            cursor="pointer"
            _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
            transition="all 0.2s ease-in-out"
            onClick={() => onSelectPuzzle(puzzle.file)}
          >
            <Flex justify="space-between" align="center" mb={3}>
              <Text fontSize="xl" fontWeight="semibold">{puzzle.title}</Text>
              <Badge colorScheme={puzzle.difficulty === 'Easy' ? 'green' : puzzle.difficulty === 'Medium' ? 'orange' : 'red'}>
                {puzzle.difficulty}
              </Badge>
            </Flex>
            <Text fontSize="sm" color="gray.600">{puzzle.description || 'A challenging crossword puzzle.'}</Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
export default PuzzleSelector;
