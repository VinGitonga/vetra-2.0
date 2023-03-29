import { ContractID } from "@/types/Contracts";
import { IUser } from "@/types/User";
import {
  contractQuery,
  unwrapResultOrDefault,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { useEffect } from "react";
import { useAuth } from "./store/useAuth";
import useApi from "./useApi";

const useAuthStateListener = () => {
  const { api, activeAccount } = useInkathon();
  const { contract } = useRegisteredContract(ContractID.Vetra);
  const { updateSession, getSecret } = useApi();

  const setUser = useAuth((state) => state.setUser);

  const fetchUser = async () => {
    if (api && activeAccount && contract) {
      const result = await contractQuery(
        api,
        activeAccount.address,
        contract,
        "getUser",
        {},
        [activeAccount.address]
      );
      const newRes = unwrapResultOrDefault(result, {} as IUser);
      const secret = await getSecret();

      if (newRes) {
        setUser({
          ...newRes,
          secret,
        });

        try {
          //   update session
          await updateSession(
            newRes.address ?? null,
            newRes.email ?? null,
            newRes.phone ?? null,
            secret
          );
        } catch (err) {}
      } else {
        setUser(null);
      }
    }
  };

  useEffect(() => {
    if (activeAccount) {
      fetchUser();
    }
  }, [activeAccount]);
};

export default useAuthStateListener;
