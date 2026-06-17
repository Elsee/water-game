import { createStore } from '@tanstack/store';

export interface CounterState {
  count: number;
}

export const counterStore = createStore<CounterState>({
  count: 0,
});

export function increment() {
  counterStore.setState((state) => ({ count: state.count + 1 }));
}

export function decrement() {
  counterStore.setState((state) => ({ count: state.count - 1 }));
}

export function reset() {
  counterStore.setState(() => ({ count: 0 }));
}
