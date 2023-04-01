import { Dropdown } from "flowbite-react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { BsFillFileEarmarkFill } from "react-icons/bs";
import {
  decryptBlob,
  getFileExtension,
  getFileSize,
  getSlicedAddress,
} from "@/utils/utils";
import axios from "axios";
import { IBlocFile } from "@/types/BlocFile";
import { useAuth } from "@/hooks/store/useAuth";
import { decryptBlobSecretKey } from "@/utils/locks";
import { toast } from "react-hot-toast";
import { useModal } from "@/hooks/store/useModal";
import { shallow } from "zustand/shallow";
import useApi from "@/hooks/useApi";
import { decrypt } from "@/utils/asymetric";
import useTransaction from "@/hooks/useTransaction";

interface FileCardProps {
  file: IBlocFile;
  isShared?: boolean;
}

const FileCard = ({ file, isShared = false }: FileCardProps) => {
  const userData = useAuth((state) => state.user);
  const { getFileShareInfo } = useTransaction();
  const { getPrivateSecretKey } = useApi();
  const { setShareModal, setFileShareDetails } = useModal(
    (state) => ({
      setShareModal: state.setShareModal,
      setFileShareDetails: state.setFileShareDetails,
    }),
    shallow
  );

  const onClickOpenModal = () => {
    setFileShareDetails(file);
    setShareModal(true);
  };

  async function downloadSharedFile() {
    const id = toast.loading("Commencing Download ...");
    try {
      const secretKey = await getPrivateSecretKey(userData.address);
      const fileShareInfo = await getFileShareInfo(file.entityId);
      if (secretKey) {
        toast.loading("Decrypting the secret ...", { id });
        const decryptedFileKey = decrypt(fileShareInfo.fileKey, secretKey);

        // Convert the decrypted file key to JSONWebKey
        const jwk = JSON.parse(decryptedFileKey) as JsonWebKey;

        toast.loading("Downloading file ...", { id });

        const resp = await axios.get(file.retrievalUrl, {
          responseType: "blob",
          headers: {
            Accept: "application/json",
          },
        });

        toast.success("File downloaded successfully", { id });

        const arrBuf = await resp.data.arrayBuffer();

        const blob = new Blob([arrBuf], { type: file.type });

        toast.loading("Decrypting file...", { id });

        const decryptedBlob = await decryptBlob(blob, file.iv, jwk);

        toast.success("File decrypted successfully", { id });

        const url = window.URL.createObjectURL(decryptedBlob);

        const link = document.createElement("a");

        link.href = url;

        link.setAttribute("download", file.displayName);

        document.body.appendChild(link);

        link.click();

        setTimeout(() => window.URL.revokeObjectURL(url), 3000);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error downloading file");
    } finally {
      toast.dismiss();
    }
  }

  /**
   * Function to download file from IPFS to local machine
   */

  async function downloadFile() {
    try {
      const id = toast.loading("Decrypting secrets...");

      const decryptedFileKey = await decryptBlobSecretKey(
        userData.secret,
        file.encryptedKey
      );

      // convert the decryptedFileKey to JSONWebKey
      const jwk = JSON.parse(decryptedFileKey) as JsonWebKey;

      toast.loading("Downloading file...", { id });

      const resp = await axios.get(file.retrievalUrl, {
        responseType: "blob",
        headers: {
          Accept: "application/json",
        },
      });

      toast.success("File downloaded successfully", { id });

      const arrBuf = await resp.data.arrayBuffer();

      const blob = new Blob([arrBuf], { type: file.type });

      toast.loading("Decrypting file...", { id });

      const decryptedBlob = await decryptBlob(blob, file.iv, jwk);

      toast.success("File decrypted successfully", { id });

      const url = window.URL.createObjectURL(decryptedBlob);

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", file.displayName);

      document.body.appendChild(link);

      link.click();

      setTimeout(() => window.URL.revokeObjectURL(url), 3000);
    } catch (err) {
      console.log(err);
      toast.error("Error downloading file");
    } finally {
      toast.dismiss();
    }
  }
  return (
    <div className="mx-auto">
      <div className="block p-6 max-w-sm bg-white rounded-2xl border border-gray-200 shadow-md hover:bg-gray-100 ">
        <div className="flex justify-end">
          <Dropdown inline={true} label="">
            <Dropdown.Item className="bg-white">
              <button
                onClick={onClickOpenModal}
                className="block py-2 px-4 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
              >
                Share
              </button>
            </Dropdown.Item>
            <Dropdown.Item className="bg-white">
              <button
                onClick={isShared ? downloadSharedFile : downloadFile}
                className="block py-2 px-4 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
              >
                Download
              </button>
            </Dropdown.Item>
            <Dropdown.Item className="bg-white">
              <a
                href="#"
                className="block py-2 px-4 text-sm text-red-600 hover:bg-gray-100"
              >
                Remove
              </a>
            </Dropdown.Item>
          </Dropdown>
        </div>
        <div className="flex items-center w-12">
          <FileIcon
            extension={getFileExtension(file?.displayName ?? "carbon.png")}
            {...defaultStyles[
              // @ts-ignore
              getFileExtension(file?.displayName ?? "carbon.png")
            ]}
            labelUppercase={true}
          />
        </div>
      </div>
      <div className="flex items-center space-x-4 mt-2">
        <BsFillFileEarmarkFill className="w-6 h-6 text-blue-600" />
        <div className="font-medium space-y-2">
          {/* <div className="text-xs">{file?.displayName ?? "carbon.png"}</div> */}
          <div className="text-sm text-gray-500 font-semibold">
            {file?.displayName ?? "carbon.png"} • {getFileSize(file?.size ?? 0)}
          </div>
          <div className="text-xs text-gray-500">
            {getSlicedAddress(
              file?.ownerAddress ?? "0xeDa6028a4b72d60Eb2638B94FAE7CD974479bFAE"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
