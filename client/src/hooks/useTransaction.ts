
import { ContractID } from "@/types/Contracts";
import {
  contractQuery,
  unwrapResultOrError,
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
          return unwrapResultOrError(result);
        }
      }, [activeAccount]);
      return {getRequestBySentBy}
}

export default useTransaction
