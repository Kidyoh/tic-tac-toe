import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import './style.css'; 
import { Board } from './components/board';
import { db } from './firebase';
import { collection, doc, onSnapshot } from '@firebase/firestore';

function Game() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [playerNames, setPlayerNames] = useState({
    player1: '',
    player2: '',
  });



  
  

  function updateLeaderboard(playerNames: { player1: any; player2: any; }, winner: string) {
    const updatedLeaderboard:any[] = [...leaderboard];
    const playerName = winner === 'X' ? playerNames.player1 : playerNames.player2;
    const existingPlayerIndex = updatedLeaderboard.findIndex((item) => item.name === playerName);
    if (existingPlayerIndex > -1) {
      if (winner) {
        updatedLeaderboard[existingPlayerIndex].wins++;
      }
    } else {
      updatedLeaderboard.push({ name: playerName, wins: winner ? 1 : 0 });
    }
    setLeaderboard(updatedLeaderboard);
  }

  function handlePlayerNameChange(event: React.ChangeEvent<HTMLInputElement>, player: string) {
    const { value } = event.target;
    setPlayerNames((prevPlayerNames) => ({
      ...prevPlayerNames,
      [player]: value,
    }));
  }
  return (
    <div className=" bg-imageflex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="game-card bg-white-0 rounded-lg p-4 shadow-xl hover:shadow-2xl">
          <div className="game-board mb-4">
            <Board playerNames={playerNames} updateLeaderboard={updateLeaderboard} leaderboard={leaderboard} />
          </div>
          <div className="flex mb-4">
        <div className="w-1/2">
          <div className="p-4 border border-white rounded mb-4">
            <input
              type="text-white"
              placeholder="Player 1 Name"
              value={playerNames.player1}
              onChange={(event) => handlePlayerNameChange(event, 'player1')}
              className="w-full text-white bg-transparent"
            />
          </div>
        </div>
        <div className="w-1/4"></div> 
        <div className="w-1/2">
          <div className="p-4 border border-white rounded">
            <input
              type="text"
              placeholder="Player 2 Name"
              value={playerNames.player2}
              onChange={(event) => handlePlayerNameChange(event, 'player2')}
              className="w-full text-white bg-transparent"
            />
          </div>
        </div>
      </div>
      </div>
      <div className="leaderboard-container">
  <div className="leaderboard">
    <div className="p-4 border text-white border-gray-300 rounded">
      <h2>Leaderboard</h2>
      <ul>
      {leaderboard.map((item, index) => (
              <li key={index}>
                {item.name}: {item.wins} win{item.wins !== 1 ? 's' : ''}
              </li>
            ))}
      </ul>
    </div>
  </div>
</div>
    </div>
    
    </div>
    
  );
}


export  {Game};

