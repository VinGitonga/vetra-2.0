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
  return { getRequestBySentBy };
};

export default useTransaction;
