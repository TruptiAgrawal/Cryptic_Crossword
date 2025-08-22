import React, { useContext } from 'react';
import GamePlayContext from '../context/GamePlayContext';
import TimerContext from '../context/TimerContext';

function WinModal() {
  const { handleCloseWinModal } = useContext(GamePlayContext);
  const { timer, formatTime } = useContext(TimerContext);

  const finalTime = formatTime(timer);
  return (
    <div className="win-modal-overlay">
      <div className="win-modal-content">
        <h2>Congratulations!</h2>
        <p>You've successfully completed the crossword!</p>
        {finalTime && <p style={{ fontSize: '1.1em', fontWeight: 'bold' }}>Time: {finalTime}</p>}
        {/* hintsUsed is passed as a prop to WinModal from CrosswordGame, so no need to get it from context here */}
        <button onClick={handleCloseWinModal}>Play Again</button>
      </div>
    </div>
  );
}

export default WinModal;
