export const getTimeStamp = (duration) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration - hours * 3600) / 60);
  const seconds = duration - hours * 3600 - minutes * 60;

  let timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  if (hours > 0) {
    timeString = `${hours}:${timeString}`;
  }

  return timeString;
};

export function removeLeadingZero(timeString) {
  if (timeString.startsWith("0")) {
    return timeString.slice(1);
  }
  return timeString;
}
