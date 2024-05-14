export function getTimeUploaded(uploadTime) {
  const currentTime = new Date(); // Current time
  const uploadedAt = new Date(uploadTime); // Uploaded time

  const timeDiff = Math.abs(currentTime - uploadedAt); // Time difference in milliseconds

  // Define the time intervals in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  // Calculate the time ago based on the time difference
  if (timeDiff < minute) {
    const time = Math.floor(timeDiff / 1000);
    return time + `${time > 1 ? " seconds ago" : " second ago"}`;
  } else if (timeDiff < hour) {
    const time = Math.floor(timeDiff / minute);
    return time + `${time > 1 ? " minutes ago" : " minute ago"}`;
  } else if (timeDiff < day) {
    const time = Math.floor(timeDiff / hour);
    return time + `${time > 1 ? " hours ago" : " hour ago"}`;
  } else if (timeDiff < week) {
    const time = Math.floor(timeDiff / day);
    return time + `${time > 1 ? " days ago" : " day ago"}`;
  } else if (timeDiff < month) {
    const time = Math.floor(timeDiff / week);
    return time + `${time > 1 ? " weeks ago" : " week ago"}`;
  } else if (timeDiff < year) {
    const time = Math.floor(timeDiff / month);
    return time + `${time > 1 ? " months ago" : " month ago"}`;
  } else {
    const time = Math.floor(timeDiff / year);
    return time + `${time > 1 ? " years ago" : "year ago"}`;
  }
}

export const isLessThanAweekOld = (uploadTime) => {
  const currentTime = new Date(); // Current time
  const uploadedAt = new Date(uploadTime); // Uploaded time

  const timeDiff = Math.abs(currentTime - uploadedAt); // Time difference in milliseconds
  const week = 7 * 24 * 60 * 60 * 1000;
  if (timeDiff < week) {
    return true;
  }

  return false;
};
