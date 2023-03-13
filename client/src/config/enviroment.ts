import { getSupportedChains } from "./getSupportedChain";
import { getUrl } from "./getUrl";

export const env = {
  url: getUrl(),
  isProduction: process.env.NEXT_PUBLIC_PRODUCTION_MODE === "true",
  defaultChain: process.env.NEXT_PUBLIC_DEFAULT_ACTION,
  supportedChains: getSupportedChains(),
};
