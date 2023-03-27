import { ContractID, IRequest } from "@/types/Contracts";
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
      const requests =  unwrapResultOrDefault(result, [] as IRequest[]);
      return requests
    }
  }, [activeAccount]);

  const getReply = useCallback(async (requestId: number) => {
    if (contract && api && activeAccount) {
      const result = await contractQuery(
        api,
        activeAccount?.address,
        contract,
        "getReply",
        {},
        [requestId]
      );
      const response =  unwrapResultOrDefault(result, [] as IRequest[]);
      return response
    }
  }, [activeAccount]);
  const getRequestsByAddressedTo  = useCallback(async () => {
    if (contract && api && activeAccount) {
      const result = await contractQuery(
        api,
        activeAccount?.address,
        contract,
        "getRequestsByAddressedTo",
        {},
        [activeAccount.address]
      );
      const requests =  unwrapResultOrDefault(result, [] as IRequest[]);
      return requests
    }
  }, [activeAccount]);


  return { getRequestBySentBy, getReply, getRequestsByAddressedTo };
};

export default useTransaction;
