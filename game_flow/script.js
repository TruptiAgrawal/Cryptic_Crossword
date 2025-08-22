class CrosswordGame {
    constructor(puzzleData) {
        this.puzzleData = puzzleData;
        this.gridCells = [];
        this.currentDirection = 'across';
        this.activeCellIndex = -1;
        this.cellClueMapping = {}; // { cellIndex: { across: clue, down: clue } }
        this.clueCellMapping = { across: {}, down: {} }; // { across: { clueNum: [cellIndex] } }

        // DOM Elements
        this.gridContainer = document.getElementById('grid-container');
        this.acrossCluesList = document.getElementById('across-clues');
        this.downCluesList = document.getElementById('down-clues');
        this.checkButton = document.getElementById('check-button');
    }

    init() {
        this.generateSolution();
        this.buildClueMappings();
        this.renderGrid();
        this.renderClues();
        this.addEventListeners();
    }

    generateSolution() {
        this.puzzleData.solution = Array(this.puzzleData.size * this.puzzleData.size).fill('');
        this.puzzleData.clues.across.forEach(clue => {
            for (let i = 0; i < clue.len; i++) {
                const index = (clue.x * this.puzzleData.size) + (clue.y + i);
                this.puzzleData.solution[index] = clue.answer[i];
            }
        });
        // Also populate from down clues for robustness
        this.puzzleData.clues.down.forEach(clue => {
            for (let i = 0; i < clue.len; i++) {
                const index = (clue.x + i) * this.puzzleData.size + clue.y;
                this.puzzleData.solution[index] = clue.answer[i];
            }
        });
    }

    buildClueMappings() {
        this.puzzleData.clues.across.forEach(clue => {
            const cells = [];
            for (let i = 0; i < clue.len; i++) {
                const index = (clue.x * this.puzzleData.size) + (clue.y + i);
                if (!this.cellClueMapping[index]) this.cellClueMapping[index] = {};
                this.cellClueMapping[index].across = clue;
                cells.push(index);
            }
            this.clueCellMapping.across[clue.number] = cells;
        });
        this.puzzleData.clues.down.forEach(clue => {
            const cells = [];
            for (let i = 0; i < clue.len; i++) {
                const index = (clue.x + i) * this.puzzleData.size + clue.y;
                if (!this.cellClueMapping[index]) this.cellClueMapping[index] = {};
                this.cellClueMapping[index].down = clue;
                cells.push(index);
            }
            this.clueCellMapping.down[clue.number] = cells;
        });
    }

    renderGrid() {
        // --- Dynamic Grid Sizing ---
        document.documentElement.style.setProperty('--grid-size', this.puzzleData.size);

        this.gridContainer.setAttribute('role', 'grid');
        this.gridContainer.setAttribute('aria-label', 'Crossword Grid');

        this.puzzleData.gridSpec.forEach((cellSpec, index) => {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.dataset.index = index;
            cell.setAttribute('role', 'gridcell');
            this.gridCells.push(cell);

            if (cellSpec.black) {
                cell.classList.add('black');
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.dataset.index = index;

                const row = Math.floor(index / this.puzzleData.size) + 1;
                const col = (index % this.puzzleData.size) + 1;
                let label = `Cell R${row}C${col}`;
                const clues = this.cellClueMapping[index];
                if (clues) {
                    if (clues.across) label += `, ${clues.across.number} Across: ${clues.across.text}`;
                    if (clues.down) label += `, ${clues.down.number} Down: ${clues.down.text}`;
                }
                input.setAttribute('aria-label', label);

                cell.appendChild(input);
                if (cellSpec.number) {
                    const numberSpan = document.createElement('span');
                    numberSpan.classList.add('number');
                    numberSpan.textContent = cellSpec.number;
                    cell.appendChild(numberSpan);
                }
            }
            this.gridContainer.appendChild(cell);
        });
    }

    renderClues() {
        const render = (clues, listElement, dir) => {
            clues.forEach(clue => {
                const li = document.createElement('li');
                li.textContent = `${clue.number}. ${clue.text}`;
                li.dataset.clue = `${dir}${clue.number}`;
                li.addEventListener('click', () => {
                    this.currentDirection = dir;
                    this.highlightClue(clue, dir);
                    const firstCellIndex = (dir === 'across') 
                        ? (clue.x * this.puzzleData.size) + clue.y 
                        : (clue.x * this.puzzleData.size) + clue.y;
                    this.gridContainer.querySelector(`input[data-index='${firstCellIndex}']`)?.focus();
                });
                listElement.appendChild(li);
            });
        };
        render(this.puzzleData.clues.across, this.acrossCluesList, 'across');
        render(this.puzzleData.clues.down, this.downCluesList, 'down');
    }

    addEventListeners() {
        this.checkButton.addEventListener('click', this.checkPuzzle.bind(this));

        this.gridContainer.addEventListener('mousedown', (e) => {
            const input = e.target.closest('input');
            if (!input) return;
            const index = parseInt(input.dataset.index);
            
            if (index === this.activeCellIndex) {
                const clues = this.cellClueMapping[index];
                if (clues && clues.across && clues.down) {
                     this.currentDirection = (this.currentDirection === 'across') ? 'down' : 'across';
                     this.handleFocus(index);
                }
            }
        });

        this.gridContainer.addEventListener('keyup', (e) => {
            const input = e.target.closest('input');
            if (!input) return;

            const index = parseInt(input.dataset.index);
            const { size } = this.puzzleData;
            let nextIndex = -1;

            if (e.key === 'ArrowRight') {
                this.currentDirection = 'across';
                nextIndex = Math.min(index + 1, size * size - 1);
            } else if (e.key === 'ArrowLeft') {
                this.currentDirection = 'across';
                nextIndex = Math.max(index - 1, 0);
            } else if (e.key === 'ArrowDown') {
                this.currentDirection = 'down';
                nextIndex = Math.min(index + size, size * size - 1);
            } else if (e.key === 'ArrowUp') {
                this.currentDirection = 'down';
                nextIndex = Math.max(index - size, 0);
            } else if (e.key === 'Backspace') {
                input.value = '';
                if (this.currentDirection === 'across') {
                    nextIndex = Math.max(index - 1, 0);
                } else {
                    nextIndex = Math.max(index - size, 0);
                }
            } else if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
                 if (this.currentDirection === 'across') {
                    nextIndex = Math.min(index + 1, size * size - 1);
                } else {
                    nextIndex = Math.min(index + size, size * size - 1);
                }
            }

            if (nextIndex !== -1 && this.gridCells[nextIndex] && !this.gridCells[nextIndex].classList.contains('black')) {
                this.gridContainer.querySelector(`input[data-index='${nextIndex}']`)?.focus();
            }
        });
        
        this.gridContainer.addEventListener('focusin', (e) => {
            const input = e.target.closest('input');
            if (!input) return;
            const index = parseInt(input.dataset.index);
            this.handleFocus(index);
        });

        // Modal closing logic
        document.querySelector('.close-button').addEventListener('click', () => {
            document.getElementById('win-modal').style.display = 'none';
        });
    }

    highlightClue(clue, dir) {
        document.querySelectorAll('.grid-cell.highlighted').forEach(c => c.classList.remove('highlighted'));
        document.querySelectorAll('.clue-list li.active').forEach(c => c.classList.remove('active'));
        if (!clue) return;

        const clueId = `${dir}${clue.number}`;
        const cellsToHighlight = (dir === 'across') ? this.clueCellMapping.across[clue.number] : this.clueCellMapping.down[clue.number];
        
        cellsToHighlight.forEach(cellIndex => {
            this.gridCells[cellIndex].classList.add('highlighted');
        });

        const clueLi = document.querySelector(`li[data-clue='${clueId}']`);
        if (clueLi) clueLi.classList.add('active');
    }
    
    highlightCurrentClues(cellIndex) {
         document.querySelectorAll('.clue-list li.active').forEach(c => c.classList.remove('active'));
         const clues = this.cellClueMapping[cellIndex];
         if(clues) {
             if(clues.across) document.querySelector(`li[data-clue='across${clues.across.number}']`)?.classList.add('active');
             if(clues.down) document.querySelector(`li[data-clue='down${clues.down.number}']`)?.classList.add('active');
         }
    }

    handleFocus(index) {
        this.activeCellIndex = index;
        const clues = this.cellClueMapping[index];
        if (!clues) {
            this.highlightClue(null);
            return;
        }
        
        if (clues.across && clues.down) {
            this.highlightClue(clues[this.currentDirection], this.currentDirection);
        } else if (clues.across) {
            this.currentDirection = 'across';
            this.highlightClue(clues.across, 'across');
        } else if (clues.down) {
            this.currentDirection = 'down';
            this.highlightClue(clues.down, 'down');
        }
        this.highlightCurrentClues(index);
    }

    checkPuzzle() {
        const inputs = this.gridContainer.querySelectorAll('input');
        let allCorrect = true;
        inputs.forEach(input => {
            const index = parseInt(input.dataset.index);
            const solutionChar = this.puzzleData.solution[index];
            
            input.classList.remove('correct', 'incorrect');

            if (input.value.trim() === '') {
                allCorrect = false;
                return;
            }

            if (input.value.toUpperCase() === solutionChar) {
                input.classList.add('correct');
            } else {
                input.classList.add('incorrect');
                allCorrect = false;
            }
        });

        if (allCorrect) {
            document.getElementById('win-modal').style.display = 'block';
        }
    }
}

// --- New Main Execution Flow ---

const levelSelectionContainer = document.getElementById('level-selection-container');
const gameWrapper = document.getElementById('game-wrapper');
const puzzleList = document.getElementById('puzzle-list');

function loadPuzzle(puzzleFile) {
    fetch(puzzleFile)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(puzzleData => {
            levelSelectionContainer.style.display = 'none';
            gameWrapper.style.display = 'flex'; // Use flex to show the game

            // Clear old game if any
            document.getElementById('grid-container').innerHTML = '';
            document.getElementById('across-clues').innerHTML = '';
            document.getElementById('down-clues').innerHTML = '';

            const game = new CrosswordGame(puzzleData);
            game.init();
        })
        .catch(e => {
            console.error('Could not load puzzle:', e);
            gameWrapper.innerHTML = '<h1>Error: Could not load puzzle data.</h1><p>Please check the console for more details.</p>';
        });
}

function showLevelSelector() {
    fetch('puzzles.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(puzzles => {
            puzzles.forEach(puzzle => {
                const button = document.createElement('button');
                button.textContent = `${puzzle.title} (${puzzle.difficulty})`;
                button.onclick = () => loadPuzzle(puzzle.file);
                puzzleList.appendChild(button);
            });
        })
        .catch(e => {
            console.error('Could not load puzzle manifest:', e);
            levelSelectionContainer.innerHTML = '<h1>Error: Could not load puzzle list.</h1>';
        });
}

document.addEventListener('DOMContentLoaded', () => {
    showLevelSelector();
});