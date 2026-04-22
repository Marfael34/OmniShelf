import { create } from 'zustand';

export const useScannerStore = create((set) => ({
  isOpen: false,
  openScanner: () => set({ isOpen: true }),
  closeScanner: () => set({ isOpen: false }),
}));