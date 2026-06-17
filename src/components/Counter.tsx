import { useSelector } from '@tanstack/react-store';
import { counterStore, increment, decrement, reset } from '../store/counter';

export function Counter() {
  const count = useSelector(counterStore, (state) => state.count);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>Counter: {count}</h2>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button onClick={decrement}>-</button>
        <button onClick={increment}>+</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
