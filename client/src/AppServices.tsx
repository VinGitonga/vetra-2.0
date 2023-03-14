import { FC, ReactNode } from "react";
import { useAsPathInitializer } from "./hooks/store/useAsPath";

const AppServices: FC<{ children: ReactNode | ReactNode[] }> = ({
  children,
}) => {
  useAsPathInitializer();
  return <>{children}</>;
};

export default AppServices;
