import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "Europe/Amsterdam";

function getFridayRange() {
  const now = dayjs().tz(TZ);

  // Get this week's Friday
  let thisFriday = now.day(5); // 5 = Friday

  if (now.day() < 5) {
    thisFriday = thisFriday.subtract(7, "day");
  }

  const lastFriday = thisFriday.subtract(7, "day");

  return {
    start: lastFriday.startOf("day").toDate(),
    end: thisFriday.endOf("day").toDate(),
  };
}

export { getFridayRange };