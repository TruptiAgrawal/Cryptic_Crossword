import React from 'react';
import Cell from './Cell';

function Grid({ gridSpec, size, activeCellIndex, onCellFocus, onCellChange, onCellKeyDown, userAnswers, validationState, highlightedCells }) {
  // Set CSS variable for grid layout (can be done higher up too)
  React.useEffect(() => {
    document.documentElement.style.setProperty('--grid-size', size);
  }, [size]);

  return (
    <div id="grid-container">
      {gridSpec.map((cellSpec, index) => (
        <Cell
          key={index} // Or a more stable ID if available
          cellSpec={cellSpec}
          index={index}
          isActive={activeCellIndex === index}
          onFocus={onCellFocus}
          onChange={onCellChange}
          onKeyDown={onCellKeyDown}
          value={userAnswers[index] || ''}
          validation={validationState[index]}
          isHighlighted={highlightedCells.includes(index)}
        />
      ))}
    </div>
  );
}
export default Grid;
