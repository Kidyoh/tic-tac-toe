function Square({ value, onClick, isWinningSquare }: { value: any; onClick(): void; isWinningSquare: boolean }) {
  const renderIcon = () => {
    switch (value) {
      case 'X':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x" style={{ width: '40px', height: '40px' }}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        );
      case 'O':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-circle" style={{ width: '40px', height: '40px' }}>
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <button className={`square w-16 h-16 text-xl text-white font-bold flex justify-center rounded items-center bg-gray-900 border-2 outline-none cursor-pointer ${isWinningSquare ? 'winning-square' : ''}`} onClick={onClick}>
      {renderIcon()}
    </button>
  );
}

export { Square };

