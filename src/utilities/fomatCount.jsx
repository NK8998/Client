export function formatCount(count) {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(2) + "M";
  } else if (count >= 1000) {
    return (count / 1000).toFixed(0) + "K";
  } else {
    return count.toString();
  }
}

export function generateRandomInteger() {
  let min = 10000;
  let max = 1000000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
