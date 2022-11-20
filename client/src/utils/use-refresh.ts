import { React } from "../deps";

/**
 * @param {string} key
 * @param {() => Promise<unknown>} fetcher
 */
export function useRefresh(key, fetcher) {
  const [data, setData] = useState();
  const [error, setError] = useState();

  React.useEffect(() => {
    fetcher().then(setData).catch(setError);

    return () => {
      setData(undefined);
      setError(undefined);
    };
  }, [key]);

  return { data, error };
}
