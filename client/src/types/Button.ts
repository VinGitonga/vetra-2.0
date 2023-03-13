import { IconType } from "react-icons";

export interface ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  text: string;
  Icon?: IconType;
  isWidthFull?: boolean;
}
