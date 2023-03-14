import { useRouter } from "next/router";
import { useEffect } from "react";
import { create } from "zustand";

interface AsPathStoreType {
  prevAsPath: string | undefined;
  currentAsPath: string | undefined;
}

const asPathStore = create<AsPathStoreType>((set) => ({
  prevAsPath: undefined,
  currentAsPath: undefined,
}));

/**
 * use as a hook to get prevAsPath and currentAsPath
 * @returns pathState
 */

export const useAsPath = () => {
  return asPathStore((state) => state);
};

/**
 * Use anywhere you like
 */
export const getAsPath = () => {
  return asPathStore.getState();
};

/**
 * Use this to initialize once the app starts running
 */
export const useAsPathInitializer = () => {
  const { asPath } = useRouter();
  const { currentAsPath } = useAsPath();

  useEffect(() => {
    if (currentAsPath !== asPath) {
      asPathStore.setState((state) => ({
        ...state,
        currentAsPath: asPath,
        prevAsPath: currentAsPath,
      }));
    }
  }, [asPath, currentAsPath]);
};
