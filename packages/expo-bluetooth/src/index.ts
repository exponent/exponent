
export * from './Bluetooth';

let hasWarned = false;
if (!hasWarned) {
  hasWarned = true;
  throw new Error('expo-bluetooth is currently a stub');
}
