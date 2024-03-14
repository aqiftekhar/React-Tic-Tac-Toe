import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import { useState } from "react";
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./winning-combinations";
import GameOver from "./components/GameOver";

const PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};
const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function derivedActivePlayer(gameTurns) {
  let currPlayer = "X";

  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currPlayer = "O";
  }
  return currPlayer;
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;
    gameBoard[row][col] = player;
  }
  return gameBoard;
}
function deriveWinner(gameBoard, players) {
  let winner = null;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSqareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSqareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSqareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstSqareSymbol &&
      firstSqareSymbol === secondSqareSymbol &&
      firstSqareSymbol === thirdSqareSymbol
    ) {
      winner = players[firstSqareSymbol];
    }
  }
  return winner;
}
function App() {
  const [players, SetPlayers] = useState(PLAYERS);

  const [gameTurns, SetGameTurns] = useState([]);

  const activePlayer = derivedActivePlayer(gameTurns);

  const gameBoard = deriveGameBoard(gameTurns);

  const winner = deriveWinner(gameBoard, players);

  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectionChanged(rowIndex, colIndex) {
    SetGameTurns((prevTurns) => {
      const currPlayer = derivedActivePlayer(prevTurns);

      const updateTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currPlayer },
        ...prevTurns,
      ];
      return updateTurns;
    });
  }

  function handleRematch() {
    SetGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    SetPlayers((prevPlayer) => {
      return {
        ...prevPlayer,
        [symbol]: newName,
      };
    });
  }
  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            name={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            name={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRematch} />
        )}
        <GameBoard
          onSelectionChanged={handleSelectionChanged}
          board={gameBoard}
        />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
