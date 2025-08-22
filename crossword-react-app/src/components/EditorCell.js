import React, { memo } from 'react';

function EditorCell({ cellSpec, index, onToggleBlack }) {
  const isBlack = cellSpec.black;
  const cellClassName = `grid-cell ${isBlack ? 'black' : ''}`;

  return (
    <div
      className={cellClassName}
      role="gridcell"
      onClick={() => onToggleBlack(index)}
      style={{ cursor: 'pointer' }} // Indicate clickable
    >
      {/* No numbers or input in editor mode */}
    </div>
  );
}

export default memo(EditorCell);
