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
    return Math.floor(timeDiff / 1000) + " seconds ago";
  } else if (timeDiff < hour) {
    return Math.floor(timeDiff / minute) + " minutes ago";
  } else if (timeDiff < day) {
    return Math.floor(timeDiff / hour) + " hours ago";
  } else if (timeDiff < week) {
    return Math.floor(timeDiff / day) + " days ago";
  } else if (timeDiff < month) {
    return Math.floor(timeDiff / week) + " weeks ago";
  } else if (timeDiff < year) {
    return Math.floor(timeDiff / month) + " months ago";
  } else {
    return Math.floor(timeDiff / year) + " years ago";
  }
}
