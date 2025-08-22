import React, { memo, useRef, useEffect } from 'react';

function Cell({ cellSpec, index, isActive, onFocus, onChange, onKeyDown, value, validation, isHighlighted }) {
  const isBlack = cellSpec.black;
  const displayValue = (typeof value === 'string' && value) ? value.toUpperCase() : '';
  const inputRef = useRef(null);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

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
          onChange={(e) => onChange(index, e.target.value)}
          onKeyDown={(e) => {
            if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', ' ', 'Backspace'].includes(e.key)) {
              e.preventDefault();
            }
            onKeyDown(index, e.key);
          }}
          ref={inputRef}
        />
      )}
    </div>
  );
}
export default memo(Cell);
