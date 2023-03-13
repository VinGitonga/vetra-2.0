import axios from "axios";
import { BiCloudDownload } from "react-icons/bi";

interface DownloadBtnProps {
  fileCid: string;
  btnActive: boolean;
  filename: string;
  isDisabled?: boolean;
}

const DownloadBtn = ({
  fileCid,
  btnActive,
  filename,
  isDisabled = true,
}: DownloadBtnProps) => {
  async function downloadFile() {
    try {
      const resp = await axios.get(`https://${fileCid}.ipfs.w3s.link`, {
        responseType: "blob",
        headers: {
          Accept: "application/json",
        },
      });
      console.log(resp);

      const type = resp.data.type;
      // get arrayBuffer
      const arrayBf = await resp.data.arrayBuffer();

      // get Blob
      const blob = new Blob([arrayBf], { type });

      const url = URL.createObjectURL(blob);

      console.log(url);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      link.click();

      setTimeout(() => URL.revokeObjectURL(url), 3000);
    } catch (err) {}
  }

  return (
    <button
      className={`${
        btnActive ? "bg-violet-500 text-white" : "text-gray-900"
      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
      onClick={downloadFile}
      disabled={isDisabled}
    >
      <BiCloudDownload className="mr-2 h-5 w-5" aria-hidden="true" />
      Download
    </button>
  );
};

export default DownloadBtn;
