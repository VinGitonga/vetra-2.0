import { create } from "zustand";

export interface IModal {
  openCreateModal: boolean;
  openUploadModal: boolean;
  setCreateModal: (open: boolean) => void;
  setUploadModal: (open: boolean) => void;
}

export const useModal = create<IModal>((set) => ({
  openCreateModal: false,
  openUploadModal: false,
  setCreateModal: (open) => set({ openCreateModal: open }),
  setUploadModal: (open) => set({ openUploadModal: open }),
}));
