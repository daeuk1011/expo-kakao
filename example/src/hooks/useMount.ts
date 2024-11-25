import { EffectCallback, useEffect } from "react";

const useMount = (callback: EffectCallback): void => {
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export { useMount };
