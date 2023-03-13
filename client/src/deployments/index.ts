import { ContractID } from "@/types/Contracts";
import { alephzeroTestnet, SubstrateDeployment } from "@scio-labs/use-inkathon";

export const getDeployments = async (): Promise<SubstrateDeployment[]> => {
  return [
    {
      contractId: ContractID.User,
      networkId: alephzeroTestnet.network,
      abi: "",
      address: "",
    },
  ];
};
