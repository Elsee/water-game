import { Link } from 'wouter';
import { ButtonDesktop } from '@tui-react/button';
import { Surface } from '@tui-react/surface';
import { useSelector } from '@tanstack/react-store';
import { counterStore, increment, decrement, reset } from '../store/counter';

export function CounterPage() {
  const count = useSelector(counterStore, (state) => state.count);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="absolute top-4 left-4">
        <Link href="/">
          <ButtonDesktop size="s" appearance="flat">
            ← Back to Home
          </ButtonDesktop>
        </Link>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Counter Demo</h1>
        <p className="mb-8">
          Simple TanStack Store example — not a game, just state management
        </p>

        <Surface
          padding="l"
          radius="l"
          shadow="popup"
          className="inline-block"
        >
          <div className="text-6xl font-bold mb-8">{count}</div>

          <div className="flex gap-4 justify-center">
            <ButtonDesktop size="l" appearance="destructive" onClick={decrement}>
              -
            </ButtonDesktop>
            <ButtonDesktop size="l" appearance="accent" onClick={increment}>
              +
            </ButtonDesktop>
            <ButtonDesktop size="l" appearance="flat" onClick={reset}>
              Reset
            </ButtonDesktop>
          </div>
        </Surface>
      </div>
    </div>
  );
}
