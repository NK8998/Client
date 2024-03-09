import { useRef } from "react";

export function usePlayerRefs() {
  const playerRef = useRef();

  return playerRef;
}
