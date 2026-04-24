import { create } from 'zustand';

export const useUiStore = create((set) => ({
  isScannerOpen: false,
  openScanner: () => set({ isScannerOpen: true }),
  closeScanner: () => set({ isScannerOpen: false }),

  isCollectionModalOpen: false,
  selectedProduct: null,
  openCollectionModal: (product) => set({ isCollectionModalOpen: true, selectedProduct: product }),
  closeCollectionModal: () => set({ isCollectionModalOpen: false, selectedProduct: null }),
  
  toast: null,
  showToast: (message, type = "success") => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
}));