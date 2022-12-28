import { useState } from 'react';

export enum RefreshIndex {}

export const useRefresh = () => {
  const [index, setIndex] = useState(0);

  return Object.assign(
    () => {
      setIndex((index) => index + 1);
    },
    { index: index as unknown as RefreshIndex },
  );
};
