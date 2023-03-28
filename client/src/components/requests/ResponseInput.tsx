interface ResponseInputProps {
  msg: string;
  setMsg: (msg: string) => void;
  onClickSelectFile?: () => void;
  onClickSubmit: () => void;
  loading: boolean;
}

export default function ResponseInput({
  msg,
  setMsg,
  onClickSelectFile,
  onClickSubmit,
  loading,
}: ResponseInputProps) {
  return (
    <div>
      <label className="sr-only">Your response</label>
      <div className="flex items-center py-2 px-3 bg-gray-50 rounded-lg">
        <button
          type="button"
          //   onClick={onClickSelectFile}
          className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 "
        >
          <svg
            aria-hidden="true"
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Select File to Share</span>
        </button>

        <textarea
          id="chat"
          rows={1}
          value={msg}
          className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
          placeholder="Type your response..."
          onChange={(e) => setMsg(e.target.value)}
        ></textarea>
        <button
          type="submit"
          disabled={loading}
          onClick={onClickSubmit}
          className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100"
        >
          <svg
            aria-hidden="true"
            className="w-6 h-6 rotate-90"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
          </svg>
          <span className="sr-only">Send message</span>
        </button>
      </div>
    </div>
  );
}
