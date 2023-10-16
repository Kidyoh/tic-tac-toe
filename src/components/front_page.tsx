import '../layout/FrontPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Game from '../game';

function FrontPage() {
  const [playerNames, setPlayerNames] = useState({
    player1: '',
    player2: '',
  });
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const history = useNavigate();


  function handleCharacterSelect(character: string) {
    setSelectedCharacter(character);
  }

  function handlePlayerNameChange(event: React.ChangeEvent<HTMLInputElement>, player: string) {
    const { value } = event.target;
    setPlayerNames((prevPlayerNames) => ({
      ...prevPlayerNames,
      [player]: value,
    }));
  }

  function handleChooseClick() {
    if (selectedCharacter === '') {
      // Handle case when no character is selected
      return;
    }

    // Open the modal for entering player's name
    setIsModalOpen(true);
  }

  // function handleModalClose() {
  //   // Close the modal
  //   setIsModalOpen(false);
  // }

  const handleNameSubmit = () => {
    history('/game', { state: { playerNames, selectedCharacter } });
};



  return (
    <div className="bg-image flex min-h-screen items-center justify-center px-6 py-12">
      <div className="flex justify-center space-x-4">
        <div className="text-white">
          <div className="w-50 pr-20 flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`feather feather-x w-36 h-36 ${
                selectedCharacter === 'X' ? 'text-red-500' : ''
              }`}
              onClick={() => handleCharacterSelect('X')}
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <button
              className="bg-white text-black rounded px-4 py-2 mt-4"
              onClick={handleChooseClick}
              disabled={selectedCharacter === ''}
            >
              Choose
            </button>
          </div>
        </div>
        <div className="text-white">
          <div className="w-48 pl-20 flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`feather feather-circle w-36 h-36 ${
                selectedCharacter === 'O' ? 'text-blue-500' : ''
              }`}
              onClick={() => handleCharacterSelect('O')}
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
            <button
              className="bg-white text-black rounded px-4 py-2 mt-4"
              onClick={handleChooseClick}
              disabled={selectedCharacter === ''}
            >
              Choose
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content winner-popup fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center p-4 bg-grey border border-gray-300 shadow-md">
            <h2>Enter Player Name</h2>
            <input
              type="text"
              placeholder="Player Name"
              value={playerNames.player1}
              onChange={(event) => handlePlayerNameChange(event, 'player1')}
              className="w-full text-black bg-white mb-4"
            />
            <button className="px-4 py-2 text-base bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-700" onClick={handleNameSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>

  );
}

export default FrontPage;