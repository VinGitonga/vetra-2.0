import { IBlocFile } from "@/types/BlocFile";
import { create } from "zustand";

export interface IModal {
  openCreateModal: boolean;
  openDrawer: boolean;
  openUploadModal: boolean;
  openShareModal: boolean;
  fileShareDetails: IBlocFile | null;
  setCreateModal: (open: boolean) => void;
  setOpenDrawer: (open: boolean) => void;
  setUploadModal: (open: boolean) => void;
  setShareModal: (open: boolean) => void;
  setFileShareDetails: (file: IBlocFile | null) => void;
  toggleDrawer: () => void;
}

export const useModal = create<IModal>((set, get) => ({
  openCreateModal: false,
  openUploadModal: false,
  openDrawer: false,
  openShareModal: false,
  fileShareDetails: null,
  setCreateModal: (open) => set({ openCreateModal: open }),
  setUploadModal: (open) => set({ openUploadModal: open }),
  setOpenDrawer: (open) => set({ openDrawer: open }),
  setShareModal: (open) => set({ openShareModal: open }),
  setFileShareDetails: (file) => set({ fileShareDetails: file }),
  toggleDrawer: () => set({ openDrawer: !get().openDrawer }),
}));
