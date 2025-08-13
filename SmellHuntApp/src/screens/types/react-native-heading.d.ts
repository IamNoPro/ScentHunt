// src/types/react-native-heading.d.ts
declare module 'react-native-heading' {
    export function start(updateInterval: number): Promise<boolean>;
    export function stop(): void;
    export function on(callback: (data: { heading: number }) => void): void;
  }
  