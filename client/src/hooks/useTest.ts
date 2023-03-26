import { stringToU8a } from "@polkadot/util";
import { blake2AsHex, blake2AsU8a } from "@polkadot/util-crypto";
import { useInkathon } from "@scio-labs/use-inkathon";

const useTest = () => {
  const { activeAccount, activeSigner } = useInkathon();
  const tests = async () => {
    const hash = blake2AsU8a(activeAccount.address)
    // convert the hash back to string
    const hashString = hash.toString()

    console.log(hashString)
  };

    return {
        tests
    }
};

export default useTest;
