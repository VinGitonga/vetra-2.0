import { Dialog, Transition } from "@headlessui/react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useInkathon } from "@scio-labs/use-inkathon";
import { Fragment, useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Badge from "../badge";
import PrimaryButton from "../buttons/PrimaryButton";
import toast from "react-hot-toast";
import axios, { AxiosProgressEvent } from "axios";
import { encryptBlob, generateRandomNumbers } from "@/utils/utils";
import { estuary_prod_api_key } from "../../../env";
import useDb from "@/hooks/useDb";
import { IEstuaryResponseData } from "@/types/Estuary";
import { IBlocFile } from "@/types/BlocFile";
import { IBloc } from "@/types/Bloc";
import SelectBloc from "./SelectBloc";
import { encryptBlobSecretKey } from "@/utils/locks";
import { useAuth } from "@/hooks/store/useAuth";

interface UploadFileProps {
  isOpen: boolean;
  closeModal: () => void;
  setIsOpen: (value: boolean) => void;
}

interface IFileInfo {
  name: string;
  fileDataUrl: ArrayBuffer | string;
  fileType: string;
  size: number;
}

const UploadFile = ({ isOpen, closeModal, setIsOpen }: UploadFileProps) => {
  const { activeAccount } = useInkathon();
  const { saveFileStorageInfo, getOwnerBlocs } = useDb();
  const [show, setShow] = useState(false);
  const [files, setFiles] = useState<IFileInfo[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<IBloc | null>(null);
  const [startUpload, setStartUpload] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [localNodeUrl] = useState<string>("http://localhost:3004");
  const [productionNodeUrl] = useState<string>("https://api.estuary.tech");
  const [blocs, setBlocs] = useState<IBloc[]>([]);
  const userData = useAuth((state) => state.user);

  const resetFields = () => {
    setFiles([]);
    setStartUpload(false);
    setIsOpen(false);
  };

  const closeDirModal = () => {
    setShow(false);
  };

  async function getFolders() {
    if (!activeAccount) {
      toast.error("Please connect your wallet first");
      return;
    }

    const resp = await getOwnerBlocs();

    if (resp.status === "ok") {
      setBlocs(resp.data);
    }
  }

  const showDirModal = () => {
    getFolders();
    setSelectedFolder(blocs[0]);
    setShow(true);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    acceptedFiles.forEach((fileInfo) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const binaryStr = reader.result;
        setFiles((prev) => [
          ...prev,
          {
            name: fileInfo.name,
            fileDataUrl: binaryStr as ArrayBuffer,
            fileType: fileInfo.type,
            size: fileInfo.size,
          },
        ]);
      };
      reader.readAsArrayBuffer(fileInfo);
    });
  }, []);

  const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
    const { loaded, total } = progressEvent;
    // @ts-ignore
    const percent = Math.floor((loaded * 100) / total);
    setProgress(percent);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const uploadToStorage = async () => {
    if (files.length <= 0) {
      toast?.error("Please select a file first");
      return;
    }

    if (!activeAccount) {
      toast?.error("Please connect your wallet first");
      return;
    }

    // check if a folder is selected
    if (!selectedFolder) {
      toast?.error("Please select a folder first");
      return;
    }

    // encrypt file

    const { blob, iv, exportedkey } = await encryptBlob(
      new Blob([files[0].fileDataUrl])
    );

    const stringExportedKey = JSON.stringify(exportedkey);

    let encryptedSecret: string | null = null;

    const encryptionSecret = userData.secret;

    if (!encryptionSecret) {
      toast.error("Please set your secret first");
      return;
    }

    encryptedSecret = await encryptBlobSecretKey(
      encryptionSecret,
      stringExportedKey
    );

    // const decryptedBlob = await decryptBlob(blob, iv, exportedkey);

    // console.log(decryptedBlob);

    // // generate decrypted blob with its file type
    // const decryptedFile = new File([decryptedBlob], files[0].name, {
    //   type: files[0].fileType,
    // });

    // console.log(decryptedFile);

    // // download the decrypted file
    // const url = window.URL.createObjectURL(decryptedFile);

    // const link = document.createElement("a");

    // link.href = url;

    // link.setAttribute("download", files[0].name);

    // document.body.appendChild(link);

    // link.click();

    // link.remove();

    const formData = new FormData();

    formData.append("data", blob, files[0].name);

    const config = {
      method: "post",
      url: `${productionNodeUrl}/content/add`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${estuary_prod_api_key}`,
      },
      data: formData,
      onUploadProgress,
    };

    const toastId = generateRandomNumbers().toString();

    try {
      toast.loading("Uploading file...", { id: toastId });
      setStartUpload(true);

      const resp = await axios(config);

      if (resp.status === 200) {
        toast?.success("File uploaded successfully", { id: toastId });
        // save data to offchain db
        const ipfsData = resp.data as IEstuaryResponseData;

        const created = new Date().valueOf();

        const fileInfo: IBlocFile = {
          displayName: files[0].name,
          ownerAddress: activeAccount.address,
          allowedAddresses: [activeAccount.address],
          size: files[0].size,
          type: files[0].fileType,
          fileCid: ipfsData.cid,
          storageProviders: ipfsData.providers,
          estuaryId: ipfsData.estuaryId,
          estuaryRetrievalUrl: ipfsData.estuary_retrieval_url,
          retrievalUrl: ipfsData.retrieval_url,
          currentBloc: selectedFolder?.entityId,
          created,
          updated: created,
          encryptedKey: encryptedSecret,
          iv,
        };

        const dbResp = await saveFileStorageInfo(fileInfo);

        if (dbResp.status === "ok") {
          toast.success("File info saved successfully", { id: toastId });
        } else {
          toast.error("Error saving file info", { id: toastId });
        }
        resetFields();
      } else {
        toast.error("Error uploading file", { id: toastId });
      }
    } catch (err) {
      console.log(err);
      toast.error("Error uploading file", { id: toastId });
    } finally {
      setStartUpload(false);
      toast.dismiss();
    }

    // let formDatas: Array<FormData> = [];

    // // create each formdata for each file
    // files.forEach((file) => {
    //   const randomNumber = generateRandomNumbers();
    //   const formData = new FormData();
    //   formData.append(
    //     "data",
    //     new Blob([file.fileDataUrl as ArrayBuffer]),
    //     file.name
    //   );
    //   formDatas.push(formData);
    // });

    // // generate config for each file
    // const configs = formDatas.map((formData) => {
    //   return {
    //     method: "post",
    //     url: `${localNodeUrl}/content/add`,
    //     headers: {
    //       Accept: "application/json",
    //       Authorization: `Bearer ESTc9eefff5-cb0e-4ed9-9fa6-668e76ba8c23ARY`,
    //     },
    //     data: formData,
    //     onUploadProgress,
    //   };
    // });

    // // generate axios promise for each file
    // const promises = configs.map((config) => axios(config));

    // // toast for start of upload
    // toast.loading("Uploading files...");

    // await Promise.all(promises)
    //   .then(async () => {
    //     axios.spread((...allData) => {
    //       console.log(allData);
    //       toast?.success(`${allData.length} files uploaded successfully`);
    //       resetFields();
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     toast.error("Something went wrong");
    //   })
    //   .finally(() => {
    //     toast.dismiss();
    //   });
  };

  useEffect(() => {
    if (activeAccount) {
      getFolders();
    }
  }, [activeAccount]);

  return (
    <>
      <SelectBloc
        show={show}
        closeDirModal={closeDirModal}
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
        blocs={blocs}
      />
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
                    Upload File
                  </Dialog.Title>
                  <div className="mt-2">
                    <div
                      className="flex justify-center items-center w-full"
                      {...getRootProps()}
                    >
                      <input className="hidden" {...getInputProps()} />
                      <label className="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100">
                        <div className="flex flex-col justify-center items-center pt-5 pb-6">
                          <svg
                            className="mb-3 w-10 h-10 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path>
                          </svg>
                          {isDragActive ? (
                            <p className="mb-2 text-sm text-gray-500 ">
                              <span className="font-semibold">
                                Drop files here
                              </span>
                            </p>
                          ) : (
                            <p className="mb-2 text-sm text-gray-500 ">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                          )}
                          <p className="text-xs text-gray-500 ">
                            Any file types except folders
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="mt-4">
                    {files?.length > 0 ? (
                      files?.map((file, i) => (
                        <Badge
                          text={file?.name}
                          key={i}
                          onClick={() => {
                            let newFiles = files.filter((_, id) => id != i);
                            setFiles(newFiles);
                          }}
                        />
                      ))
                    ) : (
                      <p className="text-md text-gray-700 dark:text-gray-400">
                        No files selected
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={showDirModal}
                    >
                      Select Folder to Upload Files
                    </button>
                    <p className="text-md text-gray-700 dark:text-gray-400">
                      {selectedFolder
                        ? selectedFolder?.displayName
                        : "No Folder Selected"}
                    </p>
                  </div>
                  {startUpload && (
                    <div className="mt-4">
                      <ProgressBar maxCompleted={100} completed={progress} />
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton
                      text={"Upload"}
                      isWidthFull={false}
                      onClick={uploadToStorage}
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
};

export default UploadFile;
