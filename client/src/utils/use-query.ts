import { useEffect, useState } from "react";

export function useQuery<T>(key: string, fetcher: () => Promise<T>) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    fetcher().then(setData).catch(setError);

    return () => {
      setData(undefined);
      setError(undefined);
    };
  }, [key]);

  return { data, error };
}
