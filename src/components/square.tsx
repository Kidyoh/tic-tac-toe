function Square({ value, onClick, isWinningSquare }: { value: any; onClick(): void; isWinningSquare: boolean }) {
  const renderIcon = () => {
    switch (value) {
      case 'X':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x" style={{ width: '50px', height: '50px'  }}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        );
      case 'O':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-circle" style={{ width: '50px', height: '50px' }}>
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <button
      className={`w-24 h-24 bg-secondary-light border-borders border rounded-xl text-5xl font-semibold flex items-center justify-center ${
        !value ? "hover:border-2 hover:shadow-md" : ""
      } ${value === "X" ? "text-white" : "text-black"} ${
        isWinningSquare ? 'winning-square' : ''
      }`}
      onClick={onClick}
    >
      {renderIcon()}
    </button>
  );
}

export { Square };

