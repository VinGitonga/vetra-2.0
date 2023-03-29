import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import Badge from "../badge";
import PrimaryButton from "../buttons/PrimaryButton";
import ResponseInput from "./ResponseInput";
import ResponseItem from "./ResponseItem";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { ContractID, IReply, IRequest } from "@/types/Contracts";
import {
  contractTx,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { generateRandomNumbers } from "@/utils/utils";
import useTransaction from "@/hooks/useTransaction";

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo("en-US");

interface RequestItemProps {
  data: IRequest;
}

const RequestItem = ({ data }: RequestItemProps) => {
  const { activeAccount, activeSigner, api } = useInkathon();
  const { contract } = useRegisteredContract(ContractID.Vetra);
  const [loading, setLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [showResponses, setShowResponses] = useState<boolean>(false);
  const [replies, setReplies] = useState<IReply[]>([]);
  const { getRepliesByRequest } = useTransaction();

  const handleShowHideReplies = (show: boolean) => {
    if (!show) {
      fetchRequestReplies();
    }
    setShowResponses(!show);
  };

  const fetchRequestReplies = async () => {
    const all_replies = await getRepliesByRequest(data.requestId);
    setReplies(all_replies);
  };

  const handleSendReply = async () => {
    if (!msg) {
      toast.error("Please enter a message");
      return;
    }
    if (!activeAccount || !activeSigner || !api || !contract) {
      toast.error("Please connect to your wallet");
      return;
    }
    try {
      const replyId = generateRandomNumbers(8);
      setLoading(true);
      api.setSigner(activeSigner);
      await contractTx(
        api,
        activeAccount.address,
        contract,
        "createReply",
        {},
        [msg, data.requestId, parseInt(replyId)],
        ({ status }) => {
          if (status.isInBlock) {
            toast.success("Reply sent successfully");
            setMsg("");
            fetchRequestReplies();
          }
        }
      );
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 shadow-md p-4 mb-5">
        {/* TODO add select file modal */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              className="w-12 h-12 rounded-full"
              src={`https://avatars.dicebear.com/api/adventurer/${data.sentBy}.svg`}
              alt=""
            />
            <div>
              {/* <div className="font-bold text-gray-700">{"Ben Stone"}</div> */}
              <div className="text-sm text-gray-500">
                {/* {request?.sentBy} */}
                {data?.sentBy}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {timeAgo.format(new Date(data.sentAt ?? 0), "twitter-now")}
          </p>
        </div>
        <p className="text-md text-gray-800 my-2 w-3/4">{data.msg}</p>
        <ResponseInput
          msg={msg}
          setMsg={setMsg}
          loading={loading}
          onClickSubmit={handleSendReply}
        />
        <Badge text="Carbon.png" onClick={() => {}} />
        <div className="my-4 flex justify-between items-center">
          <PrimaryButton
            text={`${showResponses ? "Hide" : "Show"} Responses`}
            isWidthFull={false}
            onClick={() => handleShowHideReplies(showResponses)}
          />
          <button
            type="button"
            onClick={fetchRequestReplies}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Refresh Replies
          </button>
        </div>

        {showResponses && (
          <div className="mt-4">
            {replies?.length > 0 ? (
              replies.map((reply) => (
                <ResponseItem
                  reply={reply}
                  key={reply.replyId}
                  timeAgo={timeAgo}
                />
              ))
            ) : (
              <div className="font-bold text-gray-700">No Responses yet 😢</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default RequestItem;
