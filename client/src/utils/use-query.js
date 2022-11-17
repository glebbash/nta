import { React } from "../deps.js";

/**
 * @param {string} key
 * @param {() => Promise<unknown>} fetcher
 */
export function useQuery(key, fetcher) {
  const [data, setData] = React.useState();
  const [error, setError] = React.useState();

  React.useEffect(() => {
    fetcher().then(setData).catch(setError);

    return () => {
      setData(undefined);
      setError(undefined);
    };
  }, [key]);

  return { data, error };
}
