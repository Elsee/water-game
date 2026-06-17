import { ButtonDesktop } from '@tui-react/button';
import { Surface } from '@tui-react/surface';
import { gameActions } from '../../store/game-store';

interface StartMenuProps {
  title?: string;
  onStart?: () => void;
}

export function StartMenu({ title = 'Game', onStart }: StartMenuProps) {
  const handleStart = () => {
    gameActions.startGame();
    onStart?.();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Surface
        padding="l"
        radius="l"
        shadow="popup"
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-6">{title}</h1>
        <ButtonDesktop size="l" onClick={handleStart}>
          Play
        </ButtonDesktop>
      </Surface>
    </div>
  );
}
