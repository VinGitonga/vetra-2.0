import { FC, ReactNode } from "react";
import { useAsPathInitializer } from "./hooks/store/useAsPath";
import useAuthStateListener from "./hooks/useAuthStateListener";

const AppServices: FC<{ children: ReactNode | ReactNode[] }> = ({
  children,
}) => {
  useAsPathInitializer();
  useAuthStateListener();
  return <>{children}</>;
};

export default AppServices;
