import React from 'react';
import Cell from './Cell';

function Grid({ gridSpec, size, activeCellIndex, onCellFocus, onCellChange, onCellKeyDown, userAnswers, validationState }) {
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
          onKeyDown={(e) => onCellKeyDown(index, e)}
          value={userAnswers[index] || ''}
          validation={validationState[index]}
          // ... other props for highlighting
        />
      ))}
    </div>
  );
}
export default Grid;
