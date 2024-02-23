import gsap from "gsap";
const playPoints = "M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z";
const pausePoints = "M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z";

const theatrePoints = "m 28,11 0,14 -20,0 0,-14 z m -18,2 16,0 0,10 -16,0 0,-10 z";
const normalPoints = "m 26,13 0,10 -16,0 0,-10 z m -14,2 12,0 0,6 -12,0 0,-6 z";

export function toPlay() {
  gsap.to("#svg-play-pause", {
    attr: { d: playPoints },
    duration: 0.2,
  });
}

export function toPause() {
  gsap.to("#svg-play-pause", {
    attr: { d: pausePoints },
    duration: 0.2,
  });
}

export function toTheatre() {
  gsap.to("#svg-theatre-normal", {
    attr: { d: normalPoints },
    duration: 0.2,
  });
}

export function toNormal() {
  gsap.to("#svg-theatre-normal", {
    attr: { d: theatrePoints },
    duration: 0.2,
  });
}
