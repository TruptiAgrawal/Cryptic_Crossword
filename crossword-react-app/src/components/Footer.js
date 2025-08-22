import React from 'react';
import { Button } from '@chakra-ui/react';

function Footer({ onCheckPuzzle, onCheckWord, onHintClick, onReset, hintsUsed }) {
  return (
    <footer className="footer-actions">
      <Button onClick={onCheckPuzzle}>Check Puzzle</Button>
      <Button onClick={onCheckWord}>Check Word</Button>
      <Button onClick={onHintClick}>Hint ({hintsUsed})</Button>
      <Button onClick={onReset}>Reset</Button>
    </footer>
  );
}

export default Footer;
