import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import Badge from "../badge";
import PrimaryButton from "../buttons/PrimaryButton";
import ResponseInput from "./ResponseInput";
import ResponseItem from "./ResponseItem";
import useTransaction from "@/hooks/useTransaction";
import { IRequest } from "@/types/Contracts";
import { useState } from "react";

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo("en-US");

const RequestItem = () => {
  const [requests, setRequests] = useState<IRequest[]>([]);
  const { getRequestBySentBy } = useTransaction();

  const fetchReplies = async () => {
    const request = await getRequestBySentBy();
    if (request) {
      setRequests(request);
    }
  }
  return (
    <>
   {requests?.map((request, i) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-md p-4 mb-5">
     
    {/* TODO add select file modal */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <img
          className="w-12 h-12 rounded-full"
          src={`https://avatars.dicebear.com/api/adventurer/benstone.svg`}
          alt=""
        />
        <div>
          <div className="font-bold text-gray-700">{"Ben Stone"}</div>
          <div className="text-sm text-gray-500">
            {/* {request?.sentBy} */}
            "0x1234567890"
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600">
        {timeAgo.format(new Date(), "twitter-now")}
      </p>
    </div>
    <p className="text-md text-gray-800 my-2 w-3/4">
      {
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, nisl eget ultricies tincidunt, nisl eros aliquam nisl, etlacinia nisl lorem eget nisl. Sed tincidunt, nisl eget ultricies tincidunt, nisl eros aliquam nisl, et lacinia nisl lorem eget nisl."
      }
    </p>
    <ResponseInput />
    <Badge text="Carbon.png" onClick={() => { }} />
    <div className="my-4 flex justify-between items-center">
      <PrimaryButton
        // text={`${showResponses ? "Hide" : "Show"} Responses`}
        text="Show Response"
        isWidthFull={false}
      // onClick={() => handleShowHideReplies(showResponses)}
      />
      <button
        type="button"
        onClick={fetchReplies}
        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        Refresh Replies
      </button>
    </div>

    {[...Array(2)].map((_, i) => (
      <ResponseItem key={i} timeAgo={timeAgo} />
    ))}
  </div>
  )) }
    </>
  );
};

export default RequestItem;