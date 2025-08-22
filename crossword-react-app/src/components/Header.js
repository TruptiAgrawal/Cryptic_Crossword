import React, { useContext } from 'react';
import TimerContext from '../context/TimerContext';
import GamePlayContext from '../context/GamePlayContext'; // Import GamePlayContext

function Header() {
  const { timer, formatTime } = useContext(TimerContext);
  const { difficulty, setDifficulty } = useContext(GamePlayContext); // Use difficulty from GamePlayContext

  return (
    <header className="header">
      <div className="header-title">Cryptic Crossword</div>
      <div className="header-right">
        <div className="timer">Time: {formatTime(timer)}</div>
        <select
          className="difficulty-dropdown"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    </header>
  );
}

export default Header;