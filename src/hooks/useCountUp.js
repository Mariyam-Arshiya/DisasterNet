import { useState, useEffect, useRef } from "react";

export function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(0);
  const raf = useRef();
  const from = useRef(0);

  useEffect(() => {
    const start = performance.now();
    const startVal = from.current;
    const diff = target - startVal;

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setValue(startVal + diff * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else from.current = target;
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return value;
}
