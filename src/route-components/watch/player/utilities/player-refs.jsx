import { useState } from "react";

export function usePlayerState() {
  const [chapters, setChapters] = useState([{ start: 0, title: "", end: 50 }]);
  const [play, setPlay] = useState(false);

  return [chapters, setChapters, play, setPlay];
}
