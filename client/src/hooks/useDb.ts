import { IBloc } from "@/types/Bloc";
import { useCallback } from "react";
import axios from "axios";
import { IApiResponse } from "@/types/Api";
import { IBlocFile } from "@/types/BlocFile";
import { useInkathon } from "@scio-labs/use-inkathon";

const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

const useDb = () => {
  const { activeAccount } = useInkathon();
  const createBloc = useCallback(async (blockDetails: IBloc) => {
    const response = await axios.post<IApiResponse>(
      "/api/bloc/create",
      blockDetails,
      config
    );
    return response.data;
  }, []);

  const saveFileStorageInfo = useCallback(async (fileDetails: IBlocFile) => {
    const response = await axios.post<IApiResponse>(
      "/api/file",
      fileDetails,
      config
    );
    return response.data;
  }, []);

  const getOwnerBlocs = useCallback(async () => {
    const response = await axios.get<IApiResponse>(
      `/api/bloc/get-blocs-by-wallet?owner=${activeAccount.address}`
    );
    return response.data;
  }, [activeAccount]);

  const removeBloc = useCallback(async (blocId: string) => {
    const response = await axios.delete<IApiResponse>(
      `/api/bloc/remove-bloc?blocId=${blocId}`
    );
    return response.data;
  }, []);

  return {
    createBloc,
    saveFileStorageInfo,
    getOwnerBlocs,
    removeBloc,
  };
};

export default useDb;
