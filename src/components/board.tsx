import { useEffect, useState } from 'react';
import player1Profile from '../assets/background.png';
import player2Profile from '../assets/background.png';
import { PlayerCard } from './player_card_layout.tsx';
import { calculateWinner } from './winner_data.tsx';
import Confetti from 'react-dom-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { Square } from './square.tsx';
import { BoardProps } from '../types/player-info';
import { query, collection, onSnapshot } from '@firebase/firestore';
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




  
function Board({ playerNames, updateLeaderboard, leaderboard }:BoardProps) {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [showPopup, setShowPopup] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winningSquares, setWinningSquares] = useState([]);
  useEffect(() => {
    console.log("Fetching Sqaures");

    const fetchSquares = async () => {
      const q = query(collection(db, "games"));
      onSnapshot(q, (querySnapshot) => {
        const squares: any[] = [];
        querySnapshot.forEach((doc) => {
          squares.push(doc.data());
        });
        console.log("Current Sqaures: ", squares);
        setSquares(squares);
      });
    }

    fetchSquares();


  }, [])

    function handleClick(i: number) {
      if (squares[i] || winner) {
        return;
      }
    
      const nextSquares = squares.slice();
      nextSquares[i] = xIsNext ? 'X' : 'O';
      setSquares(nextSquares);
      setXIsNext(!xIsNext);
    
      const newWinner = calculateWinner(nextSquares);
      if (newWinner === null && isBoardFull(nextSquares)) {
        setWinner(newWinner);
        setShowPopup(true);
        updateLeaderboard(playerNames, '');
      } else if (newWinner) {
        setWinner(newWinner);
        setShowPopup(true);
        updateLeaderboard(playerNames, newWinner);
      }
      
    }
    
    function isBoardFull(squares: any[]) {
      return squares.every((square) => square !== null);
    }
    function calculateWinningSquares(squares : any[]) {
      const winningCombination = calculateWinner(squares);
      if (winningCombination) {
        const [a, b, c] = winningCombination;
        return [a, b, c];
      }
      return [];
    }
  
    function renderSquare(i : never) {
      const isWinningSquare = winningSquares.includes(i);
      return (
        <Square
          key={i}
          value={squares[i]}
          onClick={() => handleClick(i)}
          isWinningSquare={isWinningSquare}
        />
      );
    }
  
    function handleRestart() {
      setXIsNext(true);
      setSquares(Array(9).fill(null));
      setWinner(null);
      setShowPopup(false);
    }
  
    if (!winner) {
      status = `Next player: ${xIsNext ? playerNames.player1 : playerNames.player2}`;
    }
    const playerName = winner === 'X' ? playerNames.player1 : playerNames.player2;
    const player1Wins = leaderboard.find((item: { name: any; }) => item.name === playerNames.player1)?.wins || 0;
    const player2Wins = leaderboard.find((item: { name: any; }) => item.name === playerNames.player2)?.wins || 0;
  
    return (
      <>
  {/* {winner === null && (
    <div className="status text-center text-white p-6">
      <div className="p-2 border border-gray-300 rounded">
        {status}
      </div>
    </div>
  )} */}
      <div className="flex items-center justify-center">
        
    <div className="flex justify-between mb-4">
      <div className="w-1/4 mb-4 text-white">
        <PlayerCard
          name={playerNames.player1}
          profilePicture={player1Profile}
          wins={player1Wins}
          isCurrentPlayer={xIsNext}
        />
      </div>
      <div className="w-1/4 flex justify-center">
  <div className="board">
    <div className="board-row flex">
      {squares.slice(0, 3).map((value, index) => (
        <Square key={index} value={value} onClick={() => handleClick(index)} isWinningSquare />
      ))}
    </div>
    <div className="board-row flex mt-1">
      {squares.slice(3, 6).map((value, index) => (
        <Square key={index + 3} value={value} onClick={() => handleClick(index + 3)} isWinningSquare />
      ))}
    </div>
    <div className="board-row flex mt-1">
      {squares.slice(6).map((value, index) => (
        <Square key={index + 6} value={value} onClick={() => handleClick(index + 6)} isWinningSquare />
      ))}
    </div>
  </div>
</div>

      <div className="w-1/4 mb-4 text-white">
        <PlayerCard
          name={playerNames.player2}
          profilePicture={player2Profile}
          wins={player2Wins}
          isCurrentPlayer={!xIsNext}
        />
      </div>
    </div>
  </div>
  
  <AnimatePresence>
    {showPopup &&(
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="winner-popup fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center p-4 bg-white border border-gray-300 shadow-md"
      >
        <Confetti active={winner !== null} config={confettiConfig} />
        <p className="text-xl mb-2">
          {winner ? `Congratulations, ${playerName}! You won!` : "It's a draw!"}
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
  
      </>
    );
  }

  export {Board};