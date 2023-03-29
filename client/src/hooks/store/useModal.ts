import { IBlocFile } from "@/types/BlocFile";
import { create } from "zustand";

export interface IModal {
  openCreateModal: boolean;
  openUploadModal: boolean;
  openShareModal: boolean;
  fileShareDetails: IBlocFile | null;
  setCreateModal: (open: boolean) => void;
  setUploadModal: (open: boolean) => void;
  setShareModal: (open: boolean) => void;
  setFileShareDetails: (file: IBlocFile | null) => void;
}

export const useModal = create<IModal>((set) => ({
  openCreateModal: false,
  openUploadModal: false,
  openShareModal: false,
  fileShareDetails: null,
  setCreateModal: (open) => set({ openCreateModal: open }),
  setUploadModal: (open) => set({ openUploadModal: open }),
  setShareModal: (open) => set({ openShareModal: open }),
  setFileShareDetails: (file) => set({ fileShareDetails: file }),
}));
