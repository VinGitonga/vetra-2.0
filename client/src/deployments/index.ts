import { ContractID } from "@/types/Contracts";
import { alephzeroTestnet, SubstrateDeployment } from "@scio-labs/use-inkathon";

export const getDeployments = async (): Promise<SubstrateDeployment[]> => {
  return [
    {
      contractId: ContractID.Vetra,
      networkId: alephzeroTestnet.network,
      abi: await import("./vetra.json"),
      address: "5Ckyr3i6xkuYWYvPYN1VhrBVTHRG4WcKwXkNrKcnuUEgbw4z",
    },
  ];
};
