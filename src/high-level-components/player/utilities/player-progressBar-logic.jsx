export const handleFocusingElements = (isFocusing) => {
  isFocusing.current = !isFocusing.current;
};
export const seekVideo = (newTime, videoRef) => {
  videoRef.current.currentTime = newTime;
};
