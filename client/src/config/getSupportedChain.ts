export const getSupportedChains = (): string[] => {
    const defaultChain = process.env.NEXT_PUBLIC_DEFAULT_CHAIN;
  
    const parsedChains =
      !!process.env.NEXT_PUBLIC_SUPPORTED_CHAINS &&
      JSON.parse(process.env.NEXT_PUBLIC_SUPPORTED_CHAINS);
  
    return parsedChains || [defaultChain];
  };
  