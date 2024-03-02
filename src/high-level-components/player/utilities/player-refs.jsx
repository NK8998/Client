import { useEffect, useRef } from "react";

export function usePlayerRefs() {
  const videoRef = useRef();
  const controlsRef = useRef();

  useEffect(() => {}, [videoRef.current]);

  return [videoRef, controlsRef];
}
