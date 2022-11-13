import { React } from "../deps.js";

/**
 * @param {string} key
 * @param {() => Promise<unknown>} fetcher
 */
export function useQuery(key, fetcher) {
  const [data, setData] = React.useState();
  const [error, setError] = React.useState();

  React.useEffect(() => fetcher().then(setData).catch(setError), [key]);

  return { data, error };
}
