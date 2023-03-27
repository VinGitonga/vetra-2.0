import { IRequest } from "@/types/Contracts";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import Badge from "../badge";
import PrimaryButton from "../buttons/PrimaryButton";
import ResponseInput from "./ResponseInput";
import ResponseItem from "./ResponseItem";

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo("en-US");

interface RequestItemProps {
  data: IRequest;
}

const RequestItem = ({ data }: RequestItemProps) => {
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
        <p className="text-md text-gray-800 my-2 w-3/4">
          {data.msg}
        </p>
        <ResponseInput />
        <Badge text="Carbon.png" onClick={() => {}} />
        <div className="my-4 flex justify-between items-center">
          <PrimaryButton
            // text={`${showResponses ? "Hide" : "Show"} Responses`}
            text="Show Response"
            isWidthFull={false}
            // onClick={() => handleShowHideReplies(showResponses)}
          />
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Refresh Replies
          </button>
        </div>

        {[...Array(2)].map((_, i) => (
          <ResponseItem key={i} timeAgo={timeAgo} />
        ))}
      </div>
    </>
  );
};

export default RequestItem;
