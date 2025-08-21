import React from 'react';

function Clues({ type, clues, activeClueNumber, onClueClick }) {
  return (
    <div className="clue-list-container">
      <h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
      <ul id={`${type}-clues`}>
        {clues.map(clue => (
          <li
            key={`${type}${clue.number}`}
            className={activeClueNumber === clue.number ? 'active' : ''}
            onClick={() => onClueClick(type, clue.number)}
            data-clue={`${type}${clue.number}`}
          >
            {clue.number}. {clue.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Clues;
