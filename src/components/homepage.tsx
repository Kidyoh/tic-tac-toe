import { useState } from 'react';
import { addDoc, collection } from '@firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [gameId, setGameId] = useState('');
  const navigate = useNavigate();

  const createGame = async () => {
    try {
      // Create a new game in Firestore
      const gameRef = await addDoc(collection(db, "games"), {
        state: 'waiting', // Initial game state (you can change this as needed)
        board: [null, null, null, null, null, null, null, null, null], // Initial board state
        winner: null, // Initial winner (null if no winner yet)
      });
  
      // gameRef.id will contain the ID of the newly created game
      const newGameId = gameRef.id;
      console.log(`Game created with ID: ${newGameId}`);
      setGameId(newGameId);
  
      // Navigate to the game with the newly created game ID
      navigate('/game', { state: { gameId: newGameId } });
    } catch (error) {
      console.error('Error creating a new game:', error);
    }
  };

  const joinGame = () => {
    navigate('/game', { state: { gameId } });
  };

  return (
    <div>
      <button onClick={createGame}>Create a Game</button>
      <input value={gameId} onChange={e => setGameId(e.target.value)} placeholder="Enter game ID" />
      <button onClick={joinGame}>Join a Game</button>
    </div>
  );
}

export default HomePage;
