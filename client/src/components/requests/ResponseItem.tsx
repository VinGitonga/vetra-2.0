import { Dropdown } from "flowbite-react";
import DownloadBtn from "../buttons/DownloadBtn";

interface ResponseItemProps {
  reply: any;
  timeAgo: any;
}

interface DropdownMenuProps {
  label: string;
  documentCid: string;
  documentName: string;
}

export default function ResponseItem({ reply, timeAgo }: Partial<ResponseItemProps>) {
  return (
    <div className="rounded-lg border border-gray-200 shadow-md p-4 ml-4 my-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            className="w-12 h-12 rounded-full"
            src={`https://avatars.dicebear.com/api/adventurer/lutherjones.svg`}
            alt=""
          />
          <div>
            <div className="font-bold text-gray-700 ">
              {reply?.replyAuthor}
            </div>
            <div className="text-sm text-gray-500">
              {"0xeDa6028a4b72d60Eb2638B94FAE7CD974479bFAE"}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          {timeAgo.format(new Date(), "twitter-now")}
        </p>
      </div>
      <p className="text-sm text-gray-600 my-2 w-3/4">
        {
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, nisl eget ultricies tincidunt, nisl eros aliquam nisl, etlacinia nisl lorem eget nisl. Sed tincidunt, nisl eget ultricies tincidunt, nisl eros aliquam nisl, et lacinia nisl lorem eget nisl."
        }
      </p>
      {reply?.documentCid && (
        <div className="mt-4">
          <DropdownMenu
            label={reply.documentName ?? "Download"}
            documentCid={reply.documentCid}
            documentName={reply.documentName ?? "Document Name"}
          />
        </div>
      )}
    </div>
  );
}

const DropdownMenu = ({
  label,
  documentCid,
  documentName,
}: DropdownMenuProps) => (
  <Dropdown label={label}>
    <Dropdown.Item>
      <DownloadBtn
        fileCid={documentCid}
        filename={documentName}
        btnActive={true}
        isDisabled={false}
      />
    </Dropdown.Item>
    <Dropdown.Item>Save to My Files</Dropdown.Item>
  </Dropdown>
);
