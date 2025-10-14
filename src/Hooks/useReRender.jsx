import { useState, useCallback } from "react";

const useRerender = () => {
  const [, setTick] = useState(0);
  const render = useCallback(() => setTick((tick) => tick + 1), []);
  return render;
}

export default useRerender;