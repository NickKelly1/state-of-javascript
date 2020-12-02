import { useEffect, useRef } from "react";

export function useHasMounted(): boolean {
  const ref = useRef<boolean>(false);
  useEffect(() => void (ref.current = true), []);
  return ref.current;
}