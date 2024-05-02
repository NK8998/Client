import moment from "moment-timezone";

export const DateFormatter = (timestamp, timezone = "UTC") => {
  return moment.tz(timestamp, timezone).format("DD MMMM YYYY");
};
