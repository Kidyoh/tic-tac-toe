import { useState } from 'react';
import { addDoc, collection, doc, getDoc, updateDoc } from '@firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Container from './container';
import wavingHAnd from "/images/waving-hand-emoji.png"

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
        currentTurn: 'playerOne', // Initialize the current turn
        xIsNext: true, // Initialize the xIsNext
      });
  
      const newGameId = gameRef.id;
      console.log(`Game created with ID: ${newGameId}`);
      setGameId(newGameId);
  
      navigate('/game', { state: { gameId: newGameId, player: 'playerOne', playerNames: { player1: player, player2: '' } }});

    } catch (error) {
      console.error('Error creating a new game:', error);
    }
  };
  

  const joinGame = async () => {
    try {
      // Fetch the game document that you want to join
      const gameDocRef = doc(db, "games", gameId);
      const gameDoc = await getDoc(gameDocRef);
  
      // Ensure the game is in the 'waiting' state and playerTwo is empty
      if (gameDoc.exists() && gameDoc.data().state === 'waiting' && !gameDoc.data().playerTwo) {
        await updateDoc(gameDocRef, {
          playerTwo: player,
          currentTurn: 'playerOne', // Set the current turn to playerTwo
        });
  
        navigate('/game', { state: { gameId, player: 'playerTwo', playerNames: { player1: gameDoc.data().playerOne, player2: player } }});

      } else {
        console.error('Game is not available for joining or already joined.');
      }
    } catch (error) {
      console.error('Error joining a game:', error);
    }
  };
  


  return (
    <div className="bg-light h-screen overflow-hidden font-inter">
      <title>XO game</title>
      <meta name="description" content="XO game" />
      <link rel="icon" href="/xo.ico" />
      <main className="flex h-4/6 justify-center items-center">
        <Container className="flex flex-col gap-5 py-12 px-10 w-2/5 justify-center items-center">
          <div className="flex gap-3">
            <img
              src={wavingHAnd}
              alt="greetings to the users"
              className="w-10 hover:-rotate-6 duration-300 hover:scale-110 "
            />
            <h2 className="text-4xl font-bold text-texts-light">Hi</h2>
          </div>
          <div className="text-texts-light text-center text-xl ">
            <p className="tracking-widest font-light">welcome to Shega XO game</p>
            <p className="font-medium">please enter Players name:</p>
          </div>
          <div className="flex justify-center gap-4 flex-col">
            <input
              onChange={(e) => setPlayer(e.target.value)}
              type="text"
              value={player}
              name="name1"
              id="name1"
              placeholder="Your Name"
              className="bg-secondary-light outline-none  px-5 py-2 border border-primary-light focus:border-2 focus:shadow-md text-center rounded-lg text-lg text-texts-light"
            />
            <button
              onClick={createGame}
              type="button"
              className="bg-primary-light text-white font-medium px-6 shadow-md hover:shadow-lg text-lg py-2 rounded-lg hover:scale-105 duration-300 transition"
            >Create a Game</button>

            <input value={gameId} onChange={e => setGameId(e.target.value)} placeholder="Enter game ID" 
             className="bg-secondary-light outline-none  px-5 py-2 border border-primary-light focus:border-2 focus:shadow-md text-center rounded-lg text-lg text-texts-light" />
            <button
              onClick={joinGame}
              type="button"
              className="bg-primary-light text-white font-medium px-6 shadow-md hover:shadow-lg text-lg py-2 rounded-lg hover:scale-105 duration-300 transition"
            >
              Join Game
            </button>
          </div>
        </Container>
      </main>
    </div>


  );
}

export default HomePage;
