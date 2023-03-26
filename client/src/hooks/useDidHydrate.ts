import { useEffect, useState } from "react";

let hydrated = false;

const useDidHydrate = () => {
  const [didHydrate, setDidHydrate] = useState(hydrated);

  useEffect(() => {
    setDidHydrate(true);
    hydrated = true;
  }, []);

  return { didHydrate };
};

export default useDidHydrate;
