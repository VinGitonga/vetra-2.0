import { ContractID } from "@/types/Contracts";
import { alephzeroTestnet, SubstrateDeployment } from "@scio-labs/use-inkathon";

export const getDeployments = async (): Promise<SubstrateDeployment[]> => {
  return [
    {
      contractId: ContractID.Vetra,
      networkId: alephzeroTestnet.network,
      abi: await import("./vetra.json"),
      address: "5G3bbpS83yUGbDUhhWzY7gJVSbfDEQdxwyFJUK4b7dJbg9xL",
    },
  ];
};
