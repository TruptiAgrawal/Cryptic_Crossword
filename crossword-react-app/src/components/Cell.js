import React from 'react';

function Cell({ cellSpec, index, isActive, onFocus, onChange, onKeyDown, value, validation, isHighlighted }) {
  const isBlack = cellSpec.black;
  const displayValue = (typeof value === 'string' && value) ? value.toUpperCase() : '';

  const cellClassName = `grid-cell ${isBlack ? 'black' : ''} ${isActive ? 'active' : ''} ${validation || ''} ${isHighlighted ? 'highlighted' : ''}`;

  return (
    <div className={cellClassName} role="gridcell" aria-label={`Cell ${index + 1}`}>
      {cellSpec.number && <span className="number">{cellSpec.number}</span>}
      {!isBlack && (
        <input
          type="text"
          maxLength="1"
          value={displayValue}
          onFocus={() => onFocus(index)}
          onChange={(e) => onChange(index, e.target.value)} // Pass e.target.value directly
          onKeyDown={(e) => {
            // Prevent default behavior for arrow keys and spacebar to avoid scrolling
            if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', ' ', 'Backspace'].includes(e.key)) {
              e.preventDefault();
            }
            console.log(`Cell ${index} KeyDown (from Cell.js):`, e.key); // Re-added log
            onKeyDown(index, e.key); // Pass e.key directly
          }}
          // Ref for programmatic focus if needed
        />
      )}
    </div>
  );
}
export default Cell;