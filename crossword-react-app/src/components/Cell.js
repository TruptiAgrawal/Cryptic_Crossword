import React from 'react';

function Cell({ cellSpec, index, isActive, onFocus, onChange, onKeyDown, value, validation }) {
  const isBlack = cellSpec.black;
  const displayValue = value ? value.toUpperCase() : '';

  const cellClassName = `grid-cell ${isBlack ? 'black' : ''} ${isActive ? 'active' : ''} ${validation || ''}`;

  return (
    <div className={cellClassName} role="gridcell" aria-label={`Cell ${index + 1}`}>
      {cellSpec.number && <span className="number">{cellSpec.number}</span>}
      {!isBlack && (
        <input
          type="text"
          maxLength="1"
          value={displayValue}
          onFocus={() => onFocus(index)}
          onChange={(e) => onChange(index, e)}
          onKeyDown={(e) => onKeyDown(index, e)}
          // Ref for programmatic focus if needed
        />
      )}
    </div>
  );
}
export default Cell;
