import { useState } from 'react';
import { addDoc, collection } from '@firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [gameId, setGameId] = useState('');
  const navigate = useNavigate();
  const [player, setPlayer] = useState('');

  const createGame = async () => {
    try {
      const gameRef = await addDoc(collection(db, "games"), {
        state: 'waiting',
        squares: [null, null, null, null, null, null, null, null, null],
        playerOne: player,
        playerTwo: '',
      });
  
      const newGameId = gameRef.id;
      console.log(`Game created with ID: ${newGameId}`);
      setGameId(newGameId);
  
      navigate('/game', { state: { gameId: newGameId, playerNames: { player1: player, player2: '' } } });
    } catch (error) {
      console.error('Error creating a new game:', error);
    }
  };
  
  const joinGame = () => {
    navigate('/game', { state: { gameId, playerNames: { player1: '', player2: player } } });
  };


return (
  <div>
    <label>
      Enter your name:
      <input value={player} onChange={e => setPlayer(e.target.value)} />
    </label>
    <button onClick={createGame}>Create a Game</button>
    <input value={gameId} onChange={e => setGameId(e.target.value)} placeholder="Enter game ID" />
    <button onClick={joinGame}>Join a Game</button>
  </div>
);
}

export default HomePage;
