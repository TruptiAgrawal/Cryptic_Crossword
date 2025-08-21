import React, { useState, useEffect } from 'react';

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

  if (loading) return <div>Loading puzzles...</div>;
  if (error) return <div>Error loading puzzles: {error.message}</div>;

  return (
    <div className="level-selection-container">
      <h1>Select a Puzzle</h1>
      <div id="puzzle-list">
        {puzzles.map(puzzle => (
          <button
            key={puzzle.file} // Unique key for list items
            onClick={() => onSelectPuzzle(puzzle.file)}
          >
            {puzzle.title} ({puzzle.difficulty})
          </button>
        ))}
      </div>
    </div>
  );
}
export default PuzzleSelector;
