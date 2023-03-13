interface WalletBtnProps {
  text: string;
}

const ConnectedBtn = ({ text }: WalletBtnProps) => {
  return (
    <button
      type="button"
      className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-3xl text-sm px-5 py-2.5 mr-2 mb-2"
    >
      {text}
    </button>
  );
};

export default ConnectedBtn;
