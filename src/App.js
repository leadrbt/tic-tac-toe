import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState("Next Player: X");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');

  const winner = calculateWinner(board);

  useEffect(() => {
    if (!isXNext && !winner && board.includes(null)) {
      const timeout = setTimeout(() => {
        let move;
        if (difficulty === 'easy') {
          move = getRandomMove(board);
        } else if (difficulty === 'intermediate') {
          move = getBestMoveRandom(board, 'O', 'X');
        } else {
          move = getBestMove(board, 'O', 'X');
        }
        handleClick(move);
      }, 500);

      return () => clearTimeout(timeout);
    } else if (!winner && !board.includes(null)) {
      setStatus("Draw");
    } else if (winner) {
      setStatus(`Winner: ${winner}`);
    } else {
      setStatus(`Next player: ${isXNext ? 'X' : 'O'}`);
    }

  }, [isXNext, winner, board]);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  const handleClick = (index) => {
    const boardCopy = [...board];
    if (winner || boardCopy[index]) return;
    boardCopy[index] = isXNext ? 'X' : 'O';
    setBoard(boardCopy);
    setIsXNext(!isXNext);
    setStatus(`Next Player: ${isXNext ? 'O' : 'X'}`);
  };

  const getRandomMove = (board) => {
    const availableMoves = board
      .map((cell, index) => cell === null ? index : null)
      .filter((cell) => cell !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  const getBestMoveRandom = (board, player, other) => {
    // Vérifier si le bot peut gagner au prochain tour
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        const boardCopy = [...board];
        boardCopy[i] = player;
        if (calculateWinner(boardCopy) === player) {
          return i;
        }
      }
    }

    // Vérifier si l'adversaire peut gagner au prochain tour et bloquer
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        const boardCopy = [...board];
        boardCopy[i] = other;
        if (calculateWinner(boardCopy) === other) {
          return i;
        }
      }
    }

    // Sinon, jouer de manière aléatoire
    return getRandomMove(board);
  };

  const getBestMove = (board, player, opponent) => {
    const bestMove = minimax(board, player, opponent, true, 0).move;
    return bestMove;
  };

  const minimax = (board, player, opponent, isMaximizing, depth) => {
    const winner = calculateWinner(board);
    if (winner === player) return { move: null, value: 10 - depth };
    if (winner === opponent) return { move: null, value: -10 + depth };
    if (board.every(cell => cell !== null)) return { move: null, value: 0 };

    const availableMoves = board
      .map((cell, index) => cell === null ? index : null)
      .filter(cell => cell !== null);

    let bestValue = isMaximizing ? -Infinity : Infinity;
    let bestMove = null;

    for (let move of availableMoves) {
      const boardCopy = [...board];
      boardCopy[move] = isMaximizing ? player : opponent;

      const result = minimax(boardCopy, player, opponent, !isMaximizing, depth + 1);

      if (isMaximizing) {
        if (result.value > bestValue) {
          bestValue = result.value;
          bestMove = move;
        }
      } else {
        if (result.value < bestValue) {
          bestValue = result.value;
          bestMove = move;
        }
      }
    }

    return { move: bestMove, value: bestValue };
  };

  const renderCell = (index) => {
    return (
      <button className="cell" onClick={() => handleClick(index)}>
        {board[index]}
      </button>
    );
  };

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setStatus("Next Player: X");
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  }

  return (
    <div className={"game"}>
      <h1 className={`title-${isDarkMode ? 'dark' : 'light'}`}>Tic Tac Toe</h1>
      <div className="game-board">
        <div className="board-row">
          {renderCell(0)}
          {renderCell(1)}
          {renderCell(2)}
        </div>
        <div className="board-row">
          {renderCell(3)}
          {renderCell(4)}
          {renderCell(5)}
        </div>
        <div className="board-row">
          {renderCell(6)}
          {renderCell(7)}
          {renderCell(8)}
        </div>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <button className={`restart-button-${isDarkMode ? 'dark' : 'light'}`} onClick={restartGame}>Restart</button>
      </div>
      <label className={"switch"}>
        <input type="checkbox" checked={isDarkMode} onChange={toggleTheme}/>
        <span className="slider"></span>
      </label>
      <div className="difficulty-selector">
        <label htmlFor="difficulty">Difficulty: </label>
        <select id="difficulty" value={difficulty} onChange={handleDifficultyChange}>
          <option value="easy">Easy</option>
          <option value="intermediate">Intermediate</option>
          <option value="impossible">Impossible</option>
        </select>
      </div>
    </div>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export default App;

