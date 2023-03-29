import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { BsFillFileTextFill } from "react-icons/bs";
import RadioButton from "@/components/buttons/RadioButton";
import { toast } from "react-hot-toast";
import { useModal } from "@/hooks/store/useModal";
import { shallow } from "zustand/shallow";
import useApi from "@/hooks/useApi";
import { useAuth } from "@/hooks/store/useAuth";
import { encrypt } from "@/utils/asymetric";
import {
  contractTx,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { ContractID } from "@/types/Contracts";
import { generateRandomString } from "@/utils/utils";

type TShare = "wallet" | "email";

export default function ShareFile() {
  const { getUserPublicKey, addAddressToAccessFile } = useApi();
  const userInfo = useAuth((state) => state.user);
  const { activeAccount, activeSigner, api } = useInkathon();
  const { contract } = useRegisteredContract(ContractID.Vetra);
  const [shareType, setShareType] = useState<TShare>("wallet");
  const handleShareTypeWalletChange = () => setShareType("wallet");
  const handleShareTypeEmailChange = () => setShareType("email");
  const [email, setEmail] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");

  const { fileDetails, setFileDetails, modalOpen, setModalOpen } = useModal(
    (state) => ({
      fileDetails: state.fileShareDetails,
      setFileDetails: state.setFileShareDetails,
      modalOpen: state.openShareModal,
      setModalOpen: state.setShareModal,
    }),
    shallow
  );

  const resetForm = () => {
    setEmail("");
    setWalletAddress("");
    setShareType("wallet");
    setFileDetails(null);
    setModalOpen(false);
  };

  const closeModal = () => {
    resetForm();
  };

  function getAddress(shareType: TShare) {
    switch (shareType) {
      case "wallet":
        return walletAddress;
      case "email":
        return email;
      default:
        return walletAddress;
    }
  }

  const clickSubmit = async () => {
    const address = getAddress(shareType);
    if (address === "") {
      toast.error("Please enter a valid address");
      return;
    }

    if (!activeAccount || !activeSigner || !api || !contract) {
      toast.error("Please connect to your wallet");
      return;
    }

    const id = toast.loading("Sharing file...");

    try {
      if (fileDetails) {
        const publicKey = await getUserPublicKey(address);
        if (publicKey) {
          toast.loading("Encrypting key...", { id });
          const encryptedKey = encrypt(userInfo.secret, publicKey);
          const shareId = generateRandomString(8);
          toast.loading("Sharing file...", { id });
          await contractTx(
            api,
            activeAccount.address,
            contract,
            "createShare",
            {},
            [
              fileDetails.entityId,
              fileDetails.displayName,
              fileDetails.fileCid,
              address,
              encryptedKey,
              shareId,
            ],
            async ({ status }) => {
              if (status.isInBlock) {
                toast.success("File shared successfully", { id });
                const resp = await addAddressToAccessFile(
                  address,
                  fileDetails.entityId
                );
                if (resp.status === "ok") {
                  toast.success("Address added to file access", { id });
                } else {
                  toast.error("Error adding address to file access", { id });
                }
                resetForm();
              }
            }
          );
        } else {
          toast.error("User not found", { id });
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Error sharing file", { id });
    }
  };

  return (
    <>
      <Transition appear show={modalOpen} as={Fragment}>
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
                  <div className="flex items-center">
                    <BsFillFileTextFill className="w-5 h-5 text-blue-500 mr-2" />
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Share File
                    </Dialog.Title>
                  </div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Share to
                  </label>
                  <div className="flex mt-2">
                    <RadioButton
                      label={"Wallet Address"}
                      value={shareType === "wallet"}
                      onChange={handleShareTypeWalletChange}
                    />
                    <RadioButton
                      label={"Email Address"}
                      value={shareType === "email"}
                      onChange={handleShareTypeEmailChange}
                    />
                  </div>
                  <div className="mt-2">
                    {shareType === "wallet" ? (
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        placeholder="HVJqBuGymzQWAM7JwixLvQcVSZ6rKowvo3j7eH1yScHN"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                      />
                    ) : (
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        placeholder="otherperson@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton
                      text={"Share"}
                      isWidthFull={false}
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
