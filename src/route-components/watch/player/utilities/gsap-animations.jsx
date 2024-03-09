import gsap from "gsap";
const playPoints = "M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z";
const pausePoints = "M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z";

const theatrePoints = "m 28,11 0,14 -20,0 0,-14 z m -18,2 16,0 0,10 -16,0 0,-10 z";
const normalPoints = "m 26,13 0,10 -16,0 0,-10 z m -14,2 12,0 0,6 -12,0 0,-6 z";

const muteVolumePoints =
  "m 21.48,17.98 c 0,-1.77 -1.02,-3.29 -2.5,-4.03 v 2.21 l 2.45,2.45 c .03,-0.2 .05,-0.41 .05,-0.63 z m 2.5,0 c 0,.94 -0.2,1.82 -0.54,2.64 l 1.51,1.51 c .66,-1.24 1.03,-2.65 1.03,-4.15 0,-4.28 -2.99,-7.86 -7,-8.76 v 2.05 c 2.89,.86 5,3.54 5,6.71 z M 9.25,8.98 l -1.27,1.26 4.72,4.73 H 7.98 v 6 H 11.98 l 5,5 v -6.73 l 4.25,4.25 c -0.67,.52 -1.42,.93 -2.25,1.18 v 2.06 c 1.38,-0.31 2.63,-0.95 3.69,-1.81 l 2.04,2.05 1.27,-1.27 -9,-9 -7.72,-7.72 z m 7.72,.99 -2.09,2.08 2.09,2.09 V 9.98 z";
const lowVolumePoints =
  "M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z";
const highVolumePoints =
  "M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z";

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

export function toMute() {
  gsap.to("#svg-volume", {
    attr: { d: muteVolumePoints },
    duration: 0,
  });
}

export function toLow() {
  gsap.to("#svg-volume", {
    attr: { d: lowVolumePoints },
    duration: 0,
  });
}

export function toHigh() {
  gsap.to("#svg-volume", {
    attr: { d: highVolumePoints },
    duration: 0,
  });
}
