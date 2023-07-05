import { useState } from 'react';
import { addDoc, collection } from '@firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';


function HomePage() {
  const [gameId, setGameId] = useState('');
  const navigate = useNavigate();
  
  const createGame = async () => {
    // Creating a new game in Firebase Firestore
    const gameRef = await addDoc(collection(db, "games"), {
      state: 'waiting',  // Initial state of the game

    });
    
    // gameRef.id will contain the ID of the newly created game
    console.log(`Game created with ID: ${gameRef.id}`);
    navigate('/game', { state: { gameId: 'your-game-id' } });

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
