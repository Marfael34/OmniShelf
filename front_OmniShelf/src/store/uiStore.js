import { create } from 'zustand';

export const useUiStore = create((set) => ({
  isScannerOpen: false,
  openScanner: () => set({ isScannerOpen: true }),
  closeScanner: () => set({ isScannerOpen: false }),
}));