import { GameProvider, useGame } from '@/components/GameContext';
import { WelcomePage } from '@/components/WelcomePage';
import { TossPage } from '@/components/TossPage';
import { GamePage } from '@/components/GamePage';

function GameRouter() {
  const { state } = useGame();

  switch (state.phase) {
    case 'welcome':
      return <WelcomePage />;
    case 'toss':
    case 'roleSelect':
      return <TossPage />;
    case 'playing':
    case 'gameOver':
      return <GamePage />;
    default:
      return <WelcomePage />;
  }
}

const Index = () => {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
};

export default Index;
