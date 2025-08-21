import React from 'react';

function WinModal({ onClose }) {
  return (
    <div className="win-modal-overlay">
      <div className="win-modal-content">
        <h2>Congratulations!</h2>
        <p>You've successfully completed the crossword!</p>
        <button onClick={onClose}>Play Again</button>
      </div>
    </div>
  );
}

export default WinModal;
