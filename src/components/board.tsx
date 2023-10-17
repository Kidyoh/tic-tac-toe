import { useEffect, useState } from 'react';
import { calculateWinner } from './winner_data.tsx';
import Confetti from 'react-dom-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { Square } from './square.tsx';
import { BoardProps } from '../types/player-info';
import { collection, doc, getDoc, onSnapshot, updateDoc } from '@firebase/firestore';
import { db } from '../firebase.tsx';

const confettiConfig = {
  angle: 90,
  spread: 360,
  startVelocity: 40,
  elementCount: 50,
  dragFriction: 0.1,
  duration: 2000,
  stagger: 3,
  width: '10px',
  height: '10px',
  colors: ['#ff0000', '#00ff00', '#0000ff'],
};

function Board({ updateLeaderboard, leaderboard, gameId: initialGameId }: BoardProps) {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [showPopup, setShowPopup] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameId] = useState<string | undefined | null>(initialGameId);
  const { playerNames } = (location as { state?: { playerNames: { player1: string; player2: string } } }).state || { playerNames: { player1: '', player2: '' } };
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');


  useEffect(() => {
    if (!gameId) return;

    const gameRef = doc(db, 'games', gameId);
    const unsubscribe = onSnapshot(gameRef, (doc) => {
      const data = doc.data();
      if (!data) return;

      setSquares(data.squares);
      setXIsNext(data.xIsNext);
      setWinner(data.winner);
    });

    const playersCollection = collection(db, 'players');

    const player1Doc = doc(playersCollection, 'player1');
    getDoc(player1Doc)
      .then((player1DocSnapshot) => {
        if (player1DocSnapshot.exists()) {
          const player1Data = player1DocSnapshot.data();
          if (player1Data) {
            setPlayer1Name(player1Data.name);
          }
        }
        console.log("player1 name is" + player1Name)
      });

    const player2Doc = doc(playersCollection, 'player2');
    getDoc(player2Doc)
      .then((player2DocSnapshot) => {
        if (player2DocSnapshot.exists()) {
          const player2Data = player2DocSnapshot.data();
          if (player2Data) {
            setPlayer2Name(player2Data.name);
          }
        }
      });


    return () => {
      unsubscribe();
    };
  }, [gameId]);




  function handleClick(i: number) {
    if (squares[i] || winner) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(xIsNext);

    const newWinner = calculateWinner(nextSquares);
    if (newWinner === null && isBoardFull(nextSquares)) {
      setWinner(newWinner);
      setShowPopup(true);
      updateLeaderboard(playerNames, '');
      updateDoc(doc(db, 'games', gameId || ''), { squares: Array(9).fill(null), xIsNext: true, winner: null });
    } else if (newWinner) {
      setWinner(newWinner);
      setShowPopup(true);
      updateLeaderboard(playerNames, newWinner);
      updateDoc(doc(db, 'games', gameId || ''), { squares: nextSquares, xIsNext: !xIsNext, winner: newWinner });
    } else {
      updateDoc(doc(db, 'games', gameId || ''), { squares: nextSquares, xIsNext: !xIsNext });
    }
  }

  function isBoardFull(squares: any[]) {
    return squares.every((square) => square !== null);
  }

  function handleRestart() {
    setXIsNext(true);
    setSquares(Array(9).fill(null));
    setWinner(null);
    setShowPopup(false);
    updateDoc(doc(db, 'games', gameId || ''), { squares: Array(9).fill(null), xIsNext: true, winner: null });
  }

  if (!winner) {
    status = `Next player: ${xIsNext ? playerNames.player1 : playerNames.player2}`;
  }
  const playerName = winner === 'X' ? playerNames.player1 : playerNames.player2;
  const player1Wins = leaderboard.find((item: { name: any; }) => item.name === playerNames.player1)?.wins || 0;
  const player2Wins = leaderboard.find((item: { name: any; }) => item.name === playerNames.player2)?.wins || 0;

  console.log("player names are" + player1Name + player2Name)

  return (
    <>
      <div className="flex items-center justify-center">
        {!gameId && (
          <h5>Please Wait ....</h5>
        )}
        {gameId && (
          <div className="grid grid-cols-5 justify-items-center">
            <div className="col-span-3 grid grid-cols-3 gap-3 col-start-2">
              {squares.map((value, index) => (
                <Square key={index} value={value} onClick={() => handleClick(index)} isWinningSquare />

              ))}

            </div>
          </div>
        )}
      </div>

      <div>

        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 12 }}
              className="winner-popup fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center p-4 bg-white border border-gray-300 shadow-md"
            >
              <Confetti active={winner !== null} config={confettiConfig} />
              <p className="text-xl mb-2">
                {winner ? `Congratulations, ${winner}! You won!` : "It's a draw!"}
              </p>
              <button
                className="px-4 py-2 text-base bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-700"
                onClick={handleRestart}
              >
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-24 text-slate-400 text-center mt-16">

      <div className="flex flex-col gap-1">
          <p
            className={`text-5xl font-inter font-medium ${xIsNext ? "text-white animate-bounce" : ""
              }`}
          >
            X
          </p>
          <p
            className={`text-2xl font-semibold ${xIsNext ? "text-black" : ""
              }`}
          >
            {player2Name}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p
            className={`text-5xl font-inter font-medium ${!xIsNext ? "text-white animate-bounce" : ""
              }`}
          >
            O
          </p>
          <p
            className={`text-2xl font-semibold ${!xIsNext ? "text-redish" : ""
              }`}
          >
            {player1Name}
          </p>
        </div>
       
      </div>
    </>

  );
}

export { Board };