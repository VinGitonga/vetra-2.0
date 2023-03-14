import { TbCloudUpload } from "react-icons/tb";
import { GrAdd, GrShareOption } from "react-icons/gr";
import { RiBookletLine, RiShareForwardBoxLine } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { TbMessage2Share } from "react-icons/tb";
import { VscGitPullRequestCreate } from "react-icons/vsc";
import { useRouter } from "next/router";
import { IconType } from "react-icons";
import { BiHomeAlt } from "react-icons/bi";
import { useModal } from "@/hooks/store/useModal";
import CreateFolder from "@/components/dialogs/CreateFolder";
import { shallow } from "zustand/shallow";
import UploadFile from "@/components/dialogs/UploadFile";

interface NavItemProps {
  title: string;
  hrefPath: string;
  Icon: IconType;
}

export default function Sidebar() {
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

  const router = useRouter();
  return (
    <div className="w-64 h-screen fixed">
      <CreateFolder isOpen={openCreateModal} closeModal={closeModal} />
      <UploadFile
        isOpen={openUploadModal}
        closeModal={closeUpload}
        setIsOpen={setUploadModal}
      />
      <button
        type="button"
        onClick={openUpload}
        className="text-white bg-blue-700 flex items-center hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
      >
        <TbCloudUpload className="mr-2 h-6 w-6" />
        Upload File
      </button>

      <button
        type="button"
        onClick={openModal}
        className="py-2.5 px-5 mr-2 mt-6 mb-2 flex items-center text-sm font-medium text-blue-800 focus:outline-none bg-white rounded-full border border-blue-800 hover:bg-gray-100 hover:text-blue-900 focus:z-10 focus:ring-4 focus:ring-gray-200"
      >
        <GrAdd className="mr-2 h-6 w-6" />
        Create Folder
      </button>

      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav>
          <NavItem title="Home" Icon={BiHomeAlt} hrefPath={"/dashboard"} />
          <NavItem
            title="My Files"
            Icon={RiBookletLine}
            hrefPath={"/my-files"}
          />
          <NavItem
            title="Shared With Me"
            Icon={FaUsers}
            hrefPath={"/shared-with-me"}
          />
          <NavItem
            title="Create New File Request"
            Icon={VscGitPullRequestCreate}
            hrefPath={"/create-request"}
          />
          <NavItem
            title="My File Requests"
            Icon={RiShareForwardBoxLine}
            hrefPath={"/my-requests"}
          />
          <NavItem
            title="File Requests to Me"
            Icon={TbMessage2Share}
            hrefPath={"/requests-to-me"}
          />
          <NavItem
            title="File Share Transactions"
            Icon={GrShareOption}
            hrefPath={"/share-transactions"}
          />
          <hr className="my-6 border-gray-200 dark:border-gray-600" />
        </nav>
      </div>
    </div>
  );
}

const NavItem = ({ title, Icon, hrefPath }: NavItemProps) => {
  const router = useRouter();
  return (
    <a
      className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md  hover:bg-gray-200 cursor-pointer"
      onClick={() => router.push(hrefPath)}
    >
      <Icon className="w-5 h-5" />

      <span className="mx-4 font-medium">{title}</span>
    </a>
  );
};
