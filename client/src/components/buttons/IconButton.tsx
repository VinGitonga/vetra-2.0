import { IconType } from "react-icons";

interface IconButtonProps {
  Icon: IconType;
  text: string;
  onClick?: () => void;
}

const IconButton = ({ Icon, text, onClick }: IconButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      <Icon className="w-5 h-5 mr-2" />
      <span className="sr-only">{text}</span>
    </button>
  );
};

export default IconButton;
