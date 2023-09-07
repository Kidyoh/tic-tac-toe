import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import './style.css';
import { Board } from './components/board';
import { onSnapshot, doc, collection, query, setDoc, addDoc, where, getDocs, updateDoc} from '@firebase/firestore';
import { db } from './firebase';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { useLocation } from 'react-router-dom';



function Game() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const location = useLocation();
  const gameId = location.state?.gameId;
  const { playerNames: initialPlayerNames, } = location.state || {};

  const [playerNames, setPlayerNames] = useState<any>(initialPlayerNames ||{
    player1: '',
    player2: '',
  });


  useEffect(() => {


    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
      })
      .catch((error) => {
        const errorCode = error.code;
        alert(errorCode)
        const errorMessage = error.message;
        alert(errorMessage)

      });

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        addDoc(collection(db, "users"), {
          user_id: uid,
        })
      } else {

      }
    });

  })

  useEffect(() => {
    console.log("Fetching Leaderboard");

    const fetchLeaderBoard = async () => {
      const q = query(collection(db, "leaderboard"));
      onSnapshot(q, (querySnapshot) => {
        const leaderboards: any[] = [];
        querySnapshot.forEach((doc) => {
          leaderboards.push(doc.data());
        });
        console.log("Current Leaderboards: ", leaderboards);
        setLeaderboard(leaderboards);
      });
    }

    fetchLeaderBoard();


  }, [])


  const updateLeaderboard = async (playerNames: { player1: any; player2: any; }, winner: string) => {
    const playerName = winner === 'X' ? playerNames.player1 : playerNames.player2;
  
    // Query the leaderboard collection to check if a player with the same name already exists
    const leaderboardQuery = query(collection(db, 'leaderboard'), where('player_name', '==', playerName));
  
    try {
      const querySnapshot = await getDocs(leaderboardQuery);
  
      if (!querySnapshot.empty) {
        // Player with the same name already exists, update their wins
        const leaderboardDoc = querySnapshot.docs[0];
        const wins = leaderboardDoc.data().wins + 1;
  
        // Update the existing leaderboard entry
        await updateDoc(leaderboardDoc.ref, { wins });
        console.log("Updated leaderboard entry for player:", playerName);
      } else {
        //when a Player with the same name doesn't exist, create a new entry
        const newPlayerId = `player_${Date.now()}`;
        const leaderRef = doc(db, 'leaderboard', newPlayerId);
  
        // Create a new leaderboard entry for the player
        await setDoc(leaderRef, {
          player_id: newPlayerId,
          player_name: playerName,
          wins: 1,
        });
        console.log("Created new leaderboard entry for player:", playerName);
      }
    } catch (error) {
      console.error("Error updating leaderboard:", error);
    }
  };
  
  

  function handlePlayerNameChange(event: React.ChangeEvent<HTMLInputElement>, player: string) {
  const { value } = event.target;
  setPlayerNames((prevPlayerNames: any) => ({
    ...prevPlayerNames,
    [player]: value,
  }));
}

  return (
    <div className=" bg-imageflex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="game-card bg-white-0 rounded-lg p-4 shadow-xl hover:shadow-2xl">
          <div className="game-board mb-4">
            <Board   playerNames={playerNames}
  updateLeaderboard={updateLeaderboard}
  leaderboard={leaderboard}
  gameId={gameId}  />
          </div>
          <div className="flex mb-4">
            <div className="w-1/2">
  <div className="p-4 border border-white rounded mb-4">
    <input
      type="text"
      placeholder="Player 1 Name"
      value={playerNames.player1} // Use playerNames.player1 here
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
      value={playerNames.player2} // Use playerNames.player2 here
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
    <h2 className="text-xl mb-2">Leaderboard</h2>
    <div className="flex flex-col">
      {leaderboard.map((leaderboardEntry, index) => (
        <div key={leaderboardEntry.player_id} className="flex justify-between mb-2">
          <span>{index + 1}.</span>
          <span>{leaderboardEntry.player_name}</span>
          <span>{leaderboardEntry.wins}</span>
        </div>
      ))}

      {leaderboard.length === 0 && <p>No players yet</p>}
</div>
  </div>
</div>

        </div>
      </div>

    </div>

  );
}

export default Game;