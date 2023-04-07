import { ReactNode } from "react";
import Navbar from "@/components/layouts/main/Navbar";
import Sidebar from "@/components/layouts/main/Sidebar";
import ShareFile from "@/components/dialogs/ShareFile";
import CreateFolder from "@/components/dialogs/CreateFolder";
import UploadFile from "@/components/dialogs/UploadFile";
import { useModal } from "@/hooks/store/useModal";
import { shallow } from "zustand/shallow";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { setCreateModal, setUploadModal, openCreateModal, openUploadModal } =
    useModal(
      (state) => ({
        setCreateModal: state.setCreateModal,
        setUploadModal: state.setUploadModal,
        openCreateModal: state.openCreateModal,
        openUploadModal: state.openUploadModal,
      }),
      shallow
    );

  const closeModal = () => setCreateModal(false);
  const openModal = () => setCreateModal(true);

  const closeUpload = () => setUploadModal(false);
  const openUpload = () => setUploadModal(true);
  return (
    <div className="bg-white">
      <CreateFolder isOpen={openCreateModal} closeModal={closeModal} />
      <UploadFile
        isOpen={openUploadModal}
        closeModal={closeUpload}
        setIsOpen={setUploadModal}
      />
      <ShareFile />
      <Navbar />
      <main className="grid grid-cols-8 gap-4 px-16 py-8 border-r mt-16">
        <div className="hidden md:block md:col-span-2">
          <Sidebar />
        </div>
        <div className={`col-span-8 md:col-span-6`}>{children}</div>
      </main>
    </div>
  );
}
