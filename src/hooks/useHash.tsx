import { useState, useCallback, useEffect } from "react";

const getRealHash = () => {
  if (window.location.hash === "") return "";

  return "#" + decodeURIComponent(window.location.hash.slice(1));
};

const setRealHash = (hash: string) => {
  window.location.hash = "#" + encodeURIComponent(hash.slice(1));
};

export const useHash = () => {
  const [hash, setHash] = useState(getRealHash);

  const hashChangeHandler = useCallback(() => {
    setHash(getRealHash());
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", hashChangeHandler);
    return () => {
      window.removeEventListener("hashchange", hashChangeHandler);
    };
  }, []);

  const updateHash = useCallback(
    (newHash: string) => {
      if ("#" + newHash === hash) return;

      setRealHash("#" + newHash);
    },
    [hash]
  );

  return [hash.slice(1), updateHash] as const;
};
