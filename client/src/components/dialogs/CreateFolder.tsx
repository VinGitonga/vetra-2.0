import { Dialog, Transition } from "@headlessui/react";
import { useInkathon } from "@scio-labs/use-inkathon";
import { Fragment, useState } from "react";
import PrimaryButton from "../buttons/PrimaryButton";
import { toast } from "react-hot-toast";
import useDb from "@/hooks/useDb";
import { IBloc } from "@/types/Bloc";

interface CreateFolderProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function CreateFolder({
  isOpen,
  closeModal,
}: CreateFolderProps) {
  const { activeAccount } = useInkathon();
  const { createBloc } = useDb();
  const [displayName, setDisplayName] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const clickSubmit = async () => {
    if (!activeAccount) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!displayName) {
      toast.error("Please enter a folder name");
      return;
    }

    const created = new Date()

    const blocDetails: IBloc = {
      displayName,
      ownerAddress: activeAccount.address,
      allowedAddresses: [activeAccount.address],
      created,
      updated: created,
    };

    setLoading(true);

    try {
      const resp = await createBloc(blocDetails);
      if (resp.status === "ok") {
        toast.success("Folder created successfully");
        closeModal();
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create New Folder
                  </Dialog.Title>
                  <div className="mt-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Folder Name
                    </label>
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="My Stuff"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton
                      text={"Create"}
                      isWidthFull={false}
                      isLoading={loading}
                      loadingText={"Saving Folder ..."}
                      onClick={clickSubmit}
                    />
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
