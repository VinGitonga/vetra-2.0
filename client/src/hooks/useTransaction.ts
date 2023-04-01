import { ContractID, IReply, IRequest, IShare } from "@/types/Contracts";
import { getFileShared } from "@/utils/utils";
import {
  contractQuery,
  unwrapResultOrDefault,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { useCallback } from "react";

const useTransaction = () => {
  const { api, activeAccount } = useInkathon();
  const { contract } = useRegisteredContract(ContractID.Vetra);

  const getRequestBySentBy = useCallback(async () => {
    if (contract && api && activeAccount) {
      const result = await contractQuery(
        api,
        activeAccount?.address,
        contract,
        "getRequestBySentBy",
        {},
        [activeAccount.address]
      );
      const requests = unwrapResultOrDefault(result, [] as IRequest[]);
      return requests;
    }
  }, [activeAccount]);

  const getReply = useCallback(
    async (requestId: number) => {
      if (contract && api && activeAccount) {
        const result = await contractQuery(
          api,
          activeAccount?.address,
          contract,
          "getReply",
          {},
          [requestId]
        );
        const response = unwrapResultOrDefault(result, [] as IRequest[]);
        return response;
      }
    },
    [activeAccount]
  );
  const getRequestsByAddressedTo = useCallback(async () => {
    if (contract && api && activeAccount) {
      const result = await contractQuery(
        api,
        activeAccount?.address,
        contract,
        "getRequestsByAddressedTo",
        {},
        [activeAccount.address]
      );
      const requests = unwrapResultOrDefault(result, [] as IRequest[]);
      return requests;
    }
  }, [activeAccount]);

  const getRepliesByRequest = useCallback(
    async (requestId: number) => {
      if (contract && api && activeAccount) {
        const result = await contractQuery(
          api,
          activeAccount?.address,
          contract,
          "getRepliesByRequest",
          {},
          [requestId]
        );
        const replies = unwrapResultOrDefault(result, [] as IReply[]);
        console.log(replies);
        return replies;
      }
    },
    [activeAccount]
  );

  const getFileShareInfo = useCallback(
    async (entityId: string) => {
      if (contract && api && activeAccount) {
        const result = await contractQuery(
          api,
          activeAccount.address,
          contract,
          "getSharedFilesBySentTo",
          {}
        );

        const filesShared = unwrapResultOrDefault(result, [] as IShare[]);

        const fileShared = getFileShared(filesShared, entityId);

        return fileShared;
      }
    },
    [activeAccount]
  );

  const getMyShareTransactions = useCallback(async () => {
    if (contract && api && activeAccount) {
      const result = await contractQuery(
        api,
        activeAccount.address,
        contract,
        "getSharedFilesBySentBy",
        {}
      );

      const myShares = unwrapResultOrDefault(result, [] as IShare[]);

      return myShares;
    }
  }, []);

  return {
    getRequestBySentBy,
    getReply,
    getRequestsByAddressedTo,
    getRepliesByRequest,
    getFileShareInfo,
    getMyShareTransactions,
  };
};

export default useTransaction;
