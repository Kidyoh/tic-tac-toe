import { PlayerInfo } from "../types/player-info";

function PlayerCard({ name, profilePicture, wins, isCurrentPlayer }: PlayerInfo & { isCurrentPlayer?: boolean }) {
  return (
    <div className={`p-4 border border-gray-300 rounded shadow-xl hover:shadow-2xl ${isCurrentPlayer ? 'shadow-outline' : ''}`}>
      <div className="flex items-center">
        <img src={profilePicture} alt={name} className="w-8 h-8 rounded-full mr-2" />
        <div>
          <p>{name}</p>
          <p>Wins: {wins}</p>
          {isCurrentPlayer && <p className="text-sm text-green-500 font-bold">Your Turn</p>}
        </div>
      </div>
    </div>
  );
}

export { PlayerCard };
